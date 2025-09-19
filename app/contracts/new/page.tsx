import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import NewContractForm from './NewContractForm';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export default async function NewContractPage() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return <NewContractForm user={user} />;
}