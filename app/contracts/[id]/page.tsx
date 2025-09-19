import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { contracts, signatures } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SignContractButton from '@/components/SignContractButton';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

async function getContract(id: string, userId: string) {
    const result = await db
        .select()
        .from(contracts)
        .leftJoin(signatures, eq(contracts.id, signatures.contractId))
        .where(eq(contracts.id, id))
        .limit(1);

    if (!result[0] || result[0].contracts.vendorId !== userId) {
        return null;
    }

    return {
        contract: result[0].contracts,
        signature: result[0].signatures
    };
}

export default async function ViewContractPage({
    params
}: {
    params: Promise<{ id: string }> // Next.js 15 async params
}) {
    const resolvedParams = await params;
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    const data = await getContract(resolvedParams.id, user.id as string);

    if (!data) {
        redirect('/dashboard');
    }

    const { contract, signature } = data;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/dashboard">
                                <Button variant="outline">← Back to Dashboard</Button>
                            </Link>
                            <div className="ml-4">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {contract.clientName} - Contract
                                </h1>
                                <p className="text-gray-600">
                                    {contract.eventDate} • {contract.venue}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${contract.status === 'signed'
                                    ? 'bg-green-100 text-green-800'
                                    : contract.status === 'final'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                            </span>
                            {contract.status === 'draft' && (
                                <Link href={`/contracts/${contract.id}/edit`}>
                                    <Button>Edit Contract</Button>
                                </Link>
                            )}
                            {contract.status === 'final' && !signature && (
                                <SignContractButton contractId={contract.id} />
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-8">
                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <div>
                                <strong>Service Package:</strong> {contract.servicePackage}
                            </div>
                            <div>
                                <strong>Amount:</strong> ${contract.amount}
                            </div>
                            <div>
                                <strong>Created:</strong> {new Date(contract.createdAt!).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Last Updated:</strong> {new Date(contract.updatedAt!).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div
                        className="prose prose-sm max-w-none border-t pt-6"
                        dangerouslySetInnerHTML={{ __html: contract.content }}
                    />

                    {signature && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Digital Signature</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                {signature.type === 'drawn' ? (
                                    <img
                                        src={signature.data}
                                        alt="Digital signature"
                                        className="max-w-xs border border-gray-300 rounded"
                                    />
                                ) : (
                                    <div
                                        className="text-2xl"
                                        style={{ fontFamily: 'cursive' }}
                                    >
                                        {signature.data}
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    Signed on {new Date(signature.timestamp!).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}