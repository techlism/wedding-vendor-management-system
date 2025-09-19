import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { contracts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/LogoutButton';
import {
    FileText,
    CheckCircle2,
    Edit3,
    Calendar,
    MapPin,
    DollarSign,
    Plus,
    TrendingUp,
    LetterTextIcon,
    SignatureIcon
} from 'lucide-react';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

async function getContracts(userId: string) {
    return await db.select().from(contracts).where(eq(contracts.vendorId, userId));
}

export default async function Dashboard() {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    const userContracts = await getContracts(user.id as string);
    const totalRevenue = userContracts.reduce((sum, contract) => sum + contract.amount, 0);
    const signedRevenue = userContracts
        .filter(c => c.status === 'signed')
        .reduce((sum, contract) => sum + contract.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
                                <p className="text-sm text-gray-600 capitalize flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {user.vendorType}
                                    </span>
                                    <span>•</span>
                                    <span>{user.name}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link href="/contracts/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Contract
                                </Button>
                            </Link>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                                <p className="text-3xl font-bold text-gray-900">{userContracts.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <LetterTextIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Signed Contracts</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {userContracts.filter(c => c.status === 'signed').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Draft Contracts</p>
                                <p className="text-3xl font-bold text-amber-600">
                                    {userContracts.filter(c => c.status === 'draft').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${totalRevenue.toLocaleString()}
                                </p>
                                {signedRevenue > 0 && <p className="text-xs text-green-600 flex items-center mt-1">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    ${signedRevenue.toLocaleString()} confirmed
                                </p>}
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contracts List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <SignatureIcon className="w-5 h-5 mr-2 text-gray-600" />
                            Recent Contracts
                        </h3>
                    </div>

                    {userContracts.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts yet</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first contract</p>
                            <Link href="/contracts/new">
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Your First Contract
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {userContracts.map((contract) => (
                                <Link
                                    key={contract.id}
                                    href={`/contracts/${contract.id}`}
                                    className="block hover:bg-gray-50 transition-colors"
                                >
                                    <div className="px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contract.status === 'signed'
                                                    ? 'bg-green-100'
                                                    : contract.status === 'final'
                                                        ? 'bg-blue-100'
                                                        : 'bg-amber-100'
                                                    }`}>
                                                    {contract.status === 'signed' ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <FileText className={`w-5 h-5 ${contract.status === 'final' ? 'text-blue-600' : 'text-amber-600'
                                                            }`} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900">
                                                        {contract.clientName}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            {new Date(contract.eventDate).toLocaleDateString()}
                                                        </div>
                                                        {contract.venue && (
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <MapPin className="w-3 h-3 mr-1" />
                                                                {contract.venue}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ${contract.amount.toLocaleString()}
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contract.status === 'signed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : contract.status === 'final'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-amber-100 text-amber-800'
                                                        }`}>
                                                        {contract.status === 'draft' && 'Draft'}
                                                        {contract.status === 'final' && 'Final'}
                                                        {contract.status === 'signed' && 'Signed'}
                                                    </span>
                                                </div>
                                                <div className="text-gray-400">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}