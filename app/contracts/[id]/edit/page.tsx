import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import EditContractForm from './EditContractForm';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

async function getContract(id: string, userId: string) {
    const contract = await db
        .select()
        .from(contracts)
        .where(
            and(
                eq(contracts.id, id),
                eq(contracts.vendorId, userId)
            )
        )
        .limit(1);

    return contract[0] || null;
}

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }
    const contract = await getContract((await params).id, user.id as string);

    if (!contract) {
        redirect('/dashboard');
    }

    if (contract.status !== 'draft') {
        redirect(`/contracts/${(await params).id}`);
    }

    return <EditContractForm contract={contract} />;
}