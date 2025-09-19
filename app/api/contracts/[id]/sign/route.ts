import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { contracts, signatures } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

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

        if (existingContract[0].status !== 'final') {
            return NextResponse.json(
                { error: 'Contract must be finalized before signing' },
                { status: 400 }
            );
        }

        // Check if contract is already signed by looking for existing signature
        const existingSignature = await db
            .select()
            .from(signatures)
            .where(eq(signatures.contractId, contractId))
            .limit(1);

        if (existingSignature[0]) {
            return NextResponse.json(
                { error: 'Contract is already signed' },
                { status: 400 }
            );
        }

        const requestData = await request.json();
        const { type, data } = requestData;

        if (!type || !data || !['drawn', 'typed'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid signature data' },
                { status: 400 }
            );
        }

        // Create signature record
        const signatureId = nanoid();
        await db.insert(signatures).values({
            id: signatureId,
            contractId,
            type,
            data,
            timestamp: new Date().toISOString(),
        });

        // Update contract status to signed
        await db
            .update(contracts)
            .set({
                status: 'signed',
                updatedAt: new Date().toISOString(),
            })
            .where(eq(contracts.id, contractId));

        return NextResponse.json({ message: 'Contract signed successfully' });
    } catch (error) {
        console.error('Contract signing error:', error);
        return NextResponse.json(
            { error: 'Failed to sign contract' },
            { status: 500 }
        );
    }
}