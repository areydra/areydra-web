"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { useAdminAuth } from "@/contexts/majourney/AdminAuthContext";
import { uploadImage } from "@/lib/majourney/uploads";

const EMPTY_HTML = "<p></p>";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  /** R2 upload folder for images inserted via the toolbar's "Upload file" option (e.g. "work-history", "blog"). */
  folder: string;
};

const toolbarButtonClass =
  "cursor-pointer border-[3px] border-[#111] bg-white px-2.5 py-1.5 text-[13px] font-bold text-[#111] disabled:cursor-not-allowed disabled:opacity-40";
const toolbarButtonActiveClass = "bg-[#c8ff00]";

export default function RichTextEditor({ value, onChange, folder }: RichTextEditorProps) {
  const { token } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageMenuRef = useRef<HTMLDivElement>(null);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

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
      TiptapImage,
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

  // Dismiss the image popover on an outside click or Escape, so it doesn't
  // float indefinitely once opened.
  useEffect(() => {
    if (!imageMenuOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target as Node)) {
        setImageMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImageMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageMenuOpen]);

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

  const insertImageFromUrl = () => {
    setImageMenuOpen(false);
    setUploadError("");
    if (!editor) return;
    const url = window.prompt("Image URL (http:// or https://)", "https://");
    if (!url || url.trim() === "") return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const openFilePicker = () => {
    setImageMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file || !editor) return;
    setUploadError("");
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, folder, token);
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
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
          <div ref={imageMenuRef} className="relative">
            <button
              type="button"
              disabled={!editor || uploading}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setImageMenuOpen((open) => !open)}
              className={toolbarButtonClass}
            >
              {uploading ? "Uploading…" : "Image"}
            </button>
            {imageMenuOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 flex flex-col border-[3px] border-[#111] bg-white shadow-[4px_4px_0_#111]">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={openFilePicker}
                  className="cursor-pointer border-b-[2px] border-[#111] px-3 py-2 text-left text-[13px] font-bold whitespace-nowrap text-[#111] hover:bg-[#f5f2e8]"
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={insertImageFromUrl}
                  className="cursor-pointer px-3 py-2 text-left text-[13px] font-bold whitespace-nowrap text-[#111] hover:bg-[#f5f2e8]"
                >
                  Attach URL
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
            />
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>
      {uploadError && <p className="mt-1.5 text-[13px] font-bold text-[#dc2626]">{uploadError}</p>}
    </div>
  );
}
