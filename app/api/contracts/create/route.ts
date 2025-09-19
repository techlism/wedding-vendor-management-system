import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

async function getUser(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const requestData = await request.json();
        const {
            clientName,
            eventDate,
            venue,
            servicePackage,
            amount,
            content,
            finalize
        } = requestData;

        if (!clientName || !eventDate || !servicePackage || !amount) {
            return NextResponse.json(
                { error: 'Missing required contract details' },
                { status: 400 }
            );
        }

        const contractId = nanoid();
        const status = finalize ? 'final' : 'draft';

        const newContract = await db.insert(contracts).values({
            id: contractId,
            vendorId: user.id as string,
            clientName,
            eventDate,
            venue: venue || '',
            servicePackage,
            amount: parseFloat(amount),
            content: content || '',
            status,
        }).returning();

        return NextResponse.json({ 
            id: contractId,
            message: status === 'final' ? 'Contract created and finalized' : 'Contract created as draft'
        });
    } catch (error) {
        console.error('Contract creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create contract' },
            { status: 500 }
        );
    }
}