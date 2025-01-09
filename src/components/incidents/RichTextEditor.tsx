import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose max-w-none">
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 border-b border-neutral-200 p-2 flex space-x-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('bold') ? 'bg-neutral-200' : ''
            }`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('italic') ? 'bg-neutral-200' : ''
            }`}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('bulletList') ? 'bg-neutral-200' : ''
            }`}
          >
            Bullet List
          </button>
        </div>
        <EditorContent editor={editor} className="p-4" />
      </div>
    </div>
  );
}