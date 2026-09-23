"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const EMPTY_HTML = "<p></p>";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

const toolbarButtonClass =
  "cursor-pointer border-[3px] border-[#111] bg-white px-2.5 py-1.5 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-40";
const toolbarButtonActiveClass = "bg-[#c8ff00]";

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3] },
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          protocols: ["http", "https"],
        },
      }),
    ],
    content: value || EMPTY_HTML,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text-content min-h-[140px] px-3 py-2.5 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === EMPTY_HTML ? "" : html);
    },
  });

  // Keeps the editor in sync if `value` is replaced from outside after the
  // editor has already mounted (defensive — normally the edit page's form
  // is already hydrated with data by the time this mounts).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const normalizedCurrent = current === EMPTY_HTML ? "" : current;
    if (value !== normalizedCurrent) {
      editor.commands.setContent(value || EMPTY_HTML);
    }
  }, [value, editor]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Link URL (http:// or https://)", previousUrl || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="border-[3px] border-[#111]">
      <div className="flex flex-wrap gap-1.5 border-b-[3px] border-[#111] bg-[#f5f2e8] p-1.5">
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("bold") ? toolbarButtonActiveClass : ""}`}
        >
          <span className="font-black">B</span>
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("italic") ? toolbarButtonActiveClass : ""}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("strike") ? toolbarButtonActiveClass : ""}`}
        >
          <span className="line-through">S</span>
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${toolbarButtonClass} ${editor?.isActive("heading", { level: 3 }) ? toolbarButtonActiveClass : ""}`}
        >
          H3
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("bulletList") ? toolbarButtonActiveClass : ""}`}
        >
          • List
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("orderedList") ? toolbarButtonActiveClass : ""}`}
        >
          1. List
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`${toolbarButtonClass} ${editor?.isActive("blockquote") ? toolbarButtonActiveClass : ""}`}
        >
          “ Quote
        </button>
        <button
          type="button"
          disabled={!editor}
          onMouseDown={(e) => e.preventDefault()}
          onClick={setLink}
          className={`${toolbarButtonClass} ${editor?.isActive("link") ? toolbarButtonActiveClass : ""}`}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
