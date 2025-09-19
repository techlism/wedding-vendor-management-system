import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';

// Streamlined extensions - only essential ones for contract editing
export const tiptapExtensions = [
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
                return "What's the title?"
            }
            return 'Start typing your contract content or use AI Assist...'
        },
    }),
    BubbleMenu,
    FloatingMenu,
    Underline,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-blue-600 underline cursor-pointer',
        },
    }),
];