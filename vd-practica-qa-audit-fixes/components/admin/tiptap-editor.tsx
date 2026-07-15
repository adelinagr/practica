"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Youtube as YoutubeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = async () => {
    // Open a file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const toastId = toast.loading("Se încarcă imaginea...");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        
        editor.chain().focus().setImage({ src: data.url }).run();
        toast.success("Imagine adăugată!", { id: toastId });
      } catch (err) {
        toast.error("Eroare la încărcarea imaginii", { id: toastId });
      }
    };
    input.click();
  };

  const addYoutube = () => {
    const url = window.prompt("URL-ul videoclipului YouTube:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const btnClass = "p-2 rounded-md hover:bg-accent/20 transition-colors text-muted-foreground disabled:opacity-50 flex items-center justify-center";
  const activeClass = "bg-slate-200 text-foreground";

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-secondary/30 bg-accent/20 p-2 sticky top-0 z-10">
      <div className="flex items-center gap-1 pr-2 border-r border-secondary/50">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={btnClass}
          title="Undo"
        >
          <Undo className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={btnClass}
          title="Redo"
        >
          <Redo className="size-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1 px-2 border-r border-secondary/50">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(btnClass, editor.isActive("heading", { level: 2 }) && activeClass)}
          title="Heading 2"
        >
          <Heading2 className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(btnClass, editor.isActive("heading", { level: 3 }) && activeClass)}
          title="Heading 3"
        >
          <Heading3 className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(btnClass, editor.isActive("paragraph") && activeClass)}
          title="Paragraph"
        >
          <Type className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-secondary/50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(btnClass, editor.isActive("bold") && activeClass)}
          title="Bold"
        >
          <Bold className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(btnClass, editor.isActive("italic") && activeClass)}
          title="Italic"
        >
          <Italic className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={cn(btnClass, editor.isActive("strike") && activeClass)}
          title="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-secondary/50">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn(btnClass, editor.isActive({ textAlign: 'left' }) && activeClass)}
          title="Align Left"
        >
          <AlignLeft className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn(btnClass, editor.isActive({ textAlign: 'center' }) && activeClass)}
          title="Align Center"
        >
          <AlignCenter className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn(btnClass, editor.isActive({ textAlign: 'right' }) && activeClass)}
          title="Align Right"
        >
          <AlignRight className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn(btnClass, editor.isActive({ textAlign: 'justify' }) && activeClass)}
          title="Justify"
        >
          <AlignJustify className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-2 border-r border-secondary/50">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(btnClass, editor.isActive("bulletList") && activeClass)}
          title="Bullet List"
        >
          <List className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(btnClass, editor.isActive("orderedList") && activeClass)}
          title="Ordered List"
        >
          <ListOrdered className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(btnClass, editor.isActive("blockquote") && activeClass)}
          title="Blockquote"
        >
          <Quote className="size-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={btnClass}
          title="Horizontal Rule"
        >
          <Minus className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 pl-2">
        <button onClick={addImage} className={btnClass} title="Upload Image">
          <ImageIcon className="size-4 text-primary" />
        </button>
        <button onClick={addYoutube} className={btnClass} title="Embed YouTube Video">
          <YoutubeIcon className="size-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      ImageResize.configure({
        inline: true,
        allowBase64: true, // Fallback for copy-pasted images
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 480,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[500px] py-6 px-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-secondary/30 bg-secondary/10 backdrop-blur-md shadow-lg flex flex-col focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
      <MenuBar editor={editor} />
      <div className="flex-1 bg-secondary/10 backdrop-blur-md cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
