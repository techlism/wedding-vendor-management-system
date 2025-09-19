'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Redirect to login page
                router.push('/login');
                router.refresh();
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleLogout}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
        >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
        </Button>
    );
}