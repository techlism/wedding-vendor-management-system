'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { SignaturePad } from './SignaturePad';

interface SignContractButtonProps {
    contractId: string;
}

export default function SignContractButton({ contractId }: SignContractButtonProps) {
    const [showSignature, setShowSignature] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSign = async (signature: { type: 'drawn' | 'typed'; data: string }) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/contracts/${contractId}/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signature)
            });

            if (response.ok) {
                setShowSignature(false);
                router.refresh();
            } else {
                console.error('Sign failed');
            }
        } catch (error) {
            console.error('Sign error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setShowSignature(true)}
                disabled={loading}
            >
                Sign Contract
            </Button>

            {showSignature && (
                <SignaturePad
                    onSave={handleSign}
                    onCancel={() => setShowSignature(false)}
                />
            )}
        </>
    );
}