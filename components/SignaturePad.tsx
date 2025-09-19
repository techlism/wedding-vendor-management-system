'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button'; // Assuming you have a custom Button component

// Props for the SignaturePad component
interface SignaturePadProps {
    onSave: (signature: { type: 'drawn' | 'typed'; data: string }) => void;
    onCancel: () => void;
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
    const [activeTab, setActiveTab] = useState<'draw' | 'type'>('draw');
    const [typedSignature, setTypedSignature] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef(false);

    // Function to prepare the canvas for drawing
    const prepareCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Adjust for device pixel ratio for high-res displays
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        contextRef.current = ctx;
    }, []);

    // Set up the canvas on mount and on resize
    useEffect(() => {
        if (activeTab === 'draw') {
            prepareCanvas();
            window.addEventListener('resize', prepareCanvas);
            return () => window.removeEventListener('resize', prepareCanvas);
        }
    }, [activeTab, prepareCanvas]);

    // --- Drawing Event Handlers ---

    const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();

        if (e instanceof MouseEvent) {
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return null;
    };

    const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const coords = getCoords(e);
        if (!coords || !contextRef.current) return;

        isDrawingRef.current = true;
        contextRef.current.beginPath();
        contextRef.current.moveTo(coords.x, coords.y);
    }, []);

    const draw = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDrawingRef.current) return;
        e.preventDefault();
        const coords = getCoords(e);
        if (!coords || !contextRef.current) return;

        contextRef.current.lineTo(coords.x, coords.y);
        contextRef.current.stroke();
    }, []);

    const stopDrawing = useCallback(() => {
        if (!contextRef.current) return;
        contextRef.current.closePath();
        isDrawingRef.current = false;
    }, []);

    // Add and remove event listeners for drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || activeTab !== 'draw') return;

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        // Touch events
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [activeTab, startDrawing, draw, stopDrawing]);


    // --- Action Handlers ---

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            prepareCanvas(); // Re-prepare to reset scaling if cleared
        }
    };

    const handleSave = () => {
        if (activeTab === 'draw') {
            const canvas = canvasRef.current;
            if (canvas) {
                // Check if canvas is empty before saving
                const blank = document.createElement('canvas');
                blank.width = canvas.width;
                blank.height = canvas.height;
                if (canvas.toDataURL() === blank.toDataURL()) {
                    alert("Please provide a signature before saving.");
                    return;
                }
                onSave({ type: 'drawn', data: canvas.toDataURL('image/png') });
            }
        } else {
            if (!typedSignature.trim()) {
                alert("Please type your name to create a signature.");
                return;
            }
            onSave({ type: 'typed', data: typedSignature });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header with Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('draw')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'draw'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Draw Signature
                        </button>
                        <button
                            onClick={() => setActiveTab('type')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'type'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Type Signature
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'draw' ? (
                        <div className='space-y-2'>
                            <p className="text-sm text-gray-600 mb-2">Draw your signature in the box below.</p>
                            <canvas
                                ref={canvasRef}
                                className="w-full h-48 bg-gray-100 rounded-md cursor-crosshair"
                            />
                            <div className="text-right">
                                <Button variant="ghost" onClick={clearCanvas}>Clear</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Type your full name to generate a signature.</p>
                            <input
                                type="text"
                                value={typedSignature}
                                onChange={(e) => setTypedSignature(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="bg-gray-100 p-4 rounded-md min-h-[6rem] flex items-center justify-center">
                                <p className="text-3xl text-gray-800 font-mono">
                                    {typedSignature || 'Your Signature'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Actions */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Signature
                    </Button>
                </div>
            </div>
        </div>
    );
}

