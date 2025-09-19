'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContractEditor, ContractEditorRef } from '@/components/ContractEditor';
import type { Contract } from '@/lib/db/schema';
import { CrossIcon } from 'lucide-react';

interface EditContractFormProps {
    contract: Contract;
}

export default function EditContractForm({ contract }: EditContractFormProps) {
    const [clientName, setClientName] = useState(contract.clientName);
    const [eventDate, setEventDate] = useState(contract.eventDate);
    const [venue, setVenue] = useState(contract.venue);
    const [servicePackage, setServicePackage] = useState(contract.servicePackage);
    const [amount, setAmount] = useState(contract.amount.toString());
    const [content, setContent] = useState(contract.content);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Ref to access editor methods
    const editorRef = useRef<ContractEditorRef>(null);

    const handleAIAssist = async () => {
        if (!clientName || !eventDate || !servicePackage || !amount) {
            setError('Please fill in all required fields before using AI Assist');
            return;
        }

        setAiLoading(true);
        setError('');

        try {
            const response = await fetch('/api/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    eventDate,
                    venue,
                    servicePackage,
                    amount: parseFloat(amount),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Use the editor ref to insert AI content
                if (editorRef.current) {
                    editorRef.current.insertContent(data.content);
                } else {
                    // Fallback to state if ref not available
                    setContent(prev => prev + data.content);
                }
            } else {
                setError(data.error || 'Failed to generate content');
            }
        } catch (error) {
            console.error(error);
            setError('Network error');
        } finally {
            setAiLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/contracts/${contract.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    eventDate,
                    venue,
                    servicePackage,
                    amount: parseFloat(amount),
                    content,
                }),
            });

            if (response.ok) {
                router.push(`/contracts/${contract.id}`);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update contract');
            }
        } catch (error) {
            console.error(error);
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/contracts/${contract.id}/finalize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    eventDate,
                    venue,
                    servicePackage,
                    amount: parseFloat(amount),
                    content,
                }),
            });

            if (response.ok) {
                router.push(`/contracts/${contract.id}`);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to finalize contract');
            }
        } catch (error) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Contract</h1>
                            <p className="text-gray-600">{contract.clientName}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/contracts/${contract.id}`)}
                        >
                            <CrossIcon />
                            Cancel
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Client Name *
                                    </label>
                                    <Input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Venue
                                    </label>
                                    <Input
                                        type="text"
                                        value={venue}
                                        onChange={(e) => setVenue(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Package *
                                    </label>
                                    <Input
                                        type="text"
                                        value={servicePackage}
                                        onChange={(e) => setServicePackage(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount *
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <ContractEditor
                                ref={editorRef}
                                content={content}
                                onChange={setContent}
                                onAIAssist={handleAIAssist}
                                loading={aiLoading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="text-red-600 text-sm">{error}</div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="outline"
                            >
                                {loading ? 'Saving...' : 'Save Draft'}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleFinalize}
                                disabled={loading}
                            >
                                {loading ? 'Finalizing...' : 'Save & Finalize'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}