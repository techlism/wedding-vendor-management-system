'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import { tiptapExtensions } from '@/lib/tiptap';
import { Button } from '@/components/ui/button';
import { forwardRef, useImperativeHandle } from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    Type
} from 'lucide-react';

interface ContractEditorProps {
    content: string;
    onChange: (content: string) => void;
    onAIAssist?: () => void;
    loading?: boolean;
}

export interface ContractEditorRef {
    insertContent: (content: string) => void;
    setContent: (content: string) => void;
    getContent: () => string;
}

export const ContractEditor = forwardRef<ContractEditorRef, ContractEditorProps>(
    ({ content, onChange, onAIAssist, loading }, ref) => {
        const editor = useEditor({
            extensions: tiptapExtensions,
            content,
            immediatelyRender: false,
            onUpdate: ({ editor }) => {
                onChange(editor.getHTML());
            },
            editorProps: {
                attributes: {
                    class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none min-h-[400px] p-4 max-w-none',
                },
            },
        });

        useImperativeHandle(ref, () => ({
            insertContent: (htmlContent: string) => {
                if (editor) {
                    editor.commands.insertContent(htmlContent);
                }
            },
            setContent: (htmlContent: string) => {
                if (editor) {
                    editor.commands.setContent(htmlContent);
                }
            },
            getContent: () => {
                return editor?.getHTML() || '';
            },
        }));

        if (!editor) {
            return <div className="animate-pulse h-96 bg-gray-200 rounded"></div>;
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                        Contract Content
                    </label>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onAIAssist}
                        disabled={loading}
                        className="text-sm"
                    >
                        {loading ? 'Generating...' : '🤖 AI Assist'}
                    </Button>
                </div>

                <div className="border rounded-md bg-white">
                    <div className="border-b p-2 flex flex-wrap gap-1">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                            title="Undo"
                        >
                            <Undo className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                            title="Redo"
                        >
                            <Redo className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Heading 1"
                        >
                            <Heading1 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Heading 2"
                        >
                            <Heading2 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Heading 3"
                        >
                            <Heading3 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Paragraph"
                        >
                            <Type className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Strikethrough"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Inline Code"
                        >
                            <Code className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>

                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Numbered List"
                        >
                            <ListOrdered className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''}`}
                            title="Quote"
                        >
                            <Quote className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="relative">
                        <EditorContent editor={editor} />
                    </div>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex flex-wrap gap-4">
                        <span><strong>Ctrl+B</strong>: Bold</span>
                        <span><strong>Ctrl+I</strong>: Italic</span>
                        <span><strong>Ctrl+Z</strong>: Undo</span>
                        <span><strong>Ctrl+Y</strong>: Redo</span>
                    </div>
                </div>
            </div>
        );
    }
);

ContractEditor.displayName = 'ContractEditor';