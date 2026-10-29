"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { safeExternalUrl } from "@/lib/safe-url";
import { uploadImage } from "@/lib/admin-uploads";

const EMPTY_HTML = "<p></p>";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** R2 upload folder for images inserted via the toolbar (e.g. "work-history", "blog"). */
  folder: string;
}

const toolbarButtonClass =
  "cursor-pointer border-[3px] border-ink bg-white px-2.5 py-1.5 text-[13px] font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40";

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

const ToolbarButton = ({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    // Keep the editor selection while a toolbar button is pressed.
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={cn(toolbarButtonClass, active && "bg-lime")}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, folder }: RichTextEditorProps) => {
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
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      onChange(html === EMPTY_HTML ? "" : html);
    },
  });

  // Keeps the editor in sync when `value` is replaced from outside after mount
  // (the edit pages normally hydrate the form before this mounts).
  useEffect(
    function syncExternalValue() {
      if (!editor) return;
      const current = editor.getHTML();
      const normalizedCurrent = current === EMPTY_HTML ? "" : current;
      if (value !== normalizedCurrent) {
        editor.commands.setContent(value || EMPTY_HTML);
      }
    },
    [value, editor],
  );

  // Dismiss the image popover on outside click or Escape so it never floats.
  useEffect(
    function dismissImageMenu() {
      if (!imageMenuOpen) return;

      const handlePointerDown = (event: MouseEvent) => {
        if (imageMenuRef.current && !imageMenuRef.current.contains(event.target as Node)) {
          setImageMenuOpen(false);
        }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setImageMenuOpen(false);
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [imageMenuOpen],
  );

  const setLink = () => {
    if (!editor) return;
    const previousUrl = (editor.getAttributes("link").href as string | undefined) ?? "";
    const input = window.prompt("Link URL (http:// or https://)", previousUrl || "https://");
    if (input === null) return;

    if (input.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const href = safeExternalUrl(input);
    if (!href) {
      setUploadError("Links must be a valid http:// or https:// URL.");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const insertImageFromUrl = () => {
    setImageMenuOpen(false);
    setUploadError("");
    if (!editor) return;

    const input = window.prompt("Image URL (http:// or https://)", "https://");
    const src = safeExternalUrl(input);
    if (!src) return;

    editor.chain().focus().setImage({ src }).run();
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
      const publicUrl = await uploadImage(file, folder);
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
      <div className="border-ink border-[3px]">
        <div
          role="toolbar"
          aria-label="Text formatting"
          className="border-ink bg-paper-soft flex flex-wrap gap-1.5 border-b-[3px] p-1.5"
        >
          <ToolbarButton
            label="Bold"
            active={editor?.isActive("bold")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <span className="font-black">B</span>
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor?.isActive("italic")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            active={editor?.isActive("strike")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <span className="line-through">S</span>
          </ToolbarButton>
          <ToolbarButton
            label="Heading level 3"
            active={editor?.isActive("heading", { level: 3 })}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </ToolbarButton>
          <ToolbarButton
            label="Bullet list"
            active={editor?.isActive("bulletList")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor?.isActive("orderedList")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </ToolbarButton>
          <ToolbarButton
            label="Blockquote"
            active={editor?.isActive("blockquote")}
            disabled={!editor}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            “ Quote
          </ToolbarButton>
          <ToolbarButton
            label="Add link"
            active={editor?.isActive("link")}
            disabled={!editor}
            onClick={setLink}
          >
            Link
          </ToolbarButton>

          <div
            ref={imageMenuRef}
            className="relative"
          >
            <ToolbarButton
              label="Insert image"
              disabled={!editor || uploading}
              onClick={() => setImageMenuOpen((open) => !open)}
            >
              {uploading ? "Uploading…" : "Image"}
            </ToolbarButton>
            {imageMenuOpen && (
              <div className="border-ink absolute top-full left-0 z-10 mt-1 flex flex-col border-[3px] bg-white shadow-[4px_4px_0_#111]">
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={openFilePicker}
                  className="border-ink text-ink hover:bg-paper-soft cursor-pointer border-b-[2px] px-3 py-2 text-left text-[13px] font-bold whitespace-nowrap"
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={insertImageFromUrl}
                  className="text-ink hover:bg-paper-soft cursor-pointer px-3 py-2 text-left text-[13px] font-bold whitespace-nowrap"
                >
                  Attach URL
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Upload an image to insert"
              className="hidden"
              onChange={(event) => handleFileSelected(event.target.files?.[0])}
            />
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>
      {uploadError ? (
        <p
          role="alert"
          className="text-danger-text mt-1.5 text-[13px] font-bold"
        >
          {uploadError}
        </p>
      ) : null}
    </div>
  );
};

export default RichTextEditor;
