import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateContractContent } from '@/lib/openai';

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
        const userData = await db
            .select()
            .from(users)
            .where(eq(users.id, user.id as string))
            .limit(1);

        if (!userData[0]) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const requestData = await request.json();
        const {
            clientName,
            eventDate,
            venue,
            servicePackage,
            amount,
            section
        } = requestData;

        if (!clientName || !eventDate || !servicePackage || !amount) {
            return NextResponse.json(
                { error: 'Missing required contract details' },
                { status: 400 }
            );
        }

        const vendorName = userData[0].name;
        const content = await generateContractContent({
            vendorType: userData[0].vendorType,
            clientName,
            eventDate,
            venue,
            servicePackage,
            amount,
            section,
            vendorName
        });

        return NextResponse.json({ content });
    } catch (error) {
        console.error('AI Assist error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}