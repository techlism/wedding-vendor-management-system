import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

async function getUser(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const contractId = resolvedParams.id;

        // Verify contract exists and belongs to user
        const existingContract = await db
            .select()
            .from(contracts)
            .where(
                and(
                    eq(contracts.id, contractId),
                    eq(contracts.vendorId, user.id as string)
                )
            )
            .limit(1);

        if (!existingContract[0]) {
            return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
        }

        if (existingContract[0].status !== 'draft') {
            return NextResponse.json(
                { error: 'Contract is already finalized' },
                { status: 400 }
            );
        }

        const requestData = await request.json();
        const {
            clientName,
            eventDate,
            venue,
            servicePackage,
            amount,
            content
        } = requestData;

        if (!clientName || !eventDate || !servicePackage || !amount) {
            return NextResponse.json(
                { error: 'Missing required contract details' },
                { status: 400 }
            );
        }

        // Update the contract with final details and set status to 'final'
        await db
            .update(contracts)
            .set({
                clientName,
                eventDate,
                venue: venue || '',
                servicePackage,
                amount: parseFloat(amount),
                content: content || '',
                status: 'final',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(contracts.id, contractId));

        return NextResponse.json({ message: 'Contract finalized successfully' });
    } catch (error) {
        console.error('Contract finalization error:', error);
        return NextResponse.json(
            { error: 'Failed to finalize contract' },
            { status: 500 }
        );
    }
}