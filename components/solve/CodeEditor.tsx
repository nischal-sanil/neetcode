"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

import { saveDraft } from "@/lib/actions/drafts";
import type { Language } from "@/lib/workers/types";

// Monaco is browser-only — never import it during SSR.
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center text-sm text-muted-foreground">
      Loading editor…
    </div>
  ),
});

const AUTOSAVE_MS = 800;

interface CodeEditorProps {
  slug: string;
  language: Language;
  value: string;
  onChange: (code: string) => void;
  /** Cmd/Ctrl+Enter inside the editor triggers a run. */
  onRun: () => void;
}

export function CodeEditor({
  slug,
  language,
  value,
  onChange,
  onRun,
}: CodeEditorProps) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep latest values for the editor's keybinding closure.
  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  // Flush any pending draft when language/problem changes or on unmount.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [slug, language]);

  const scheduleSave = (code: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveDraft({ slug, language, code });
    }, AUTOSAVE_MS);
  };

  return (
    <MonacoEditor
      // Remount on language change so the model/language is clean.
      key={language}
      height="100%"
      language={language === "javascript" ? "javascript" : "python"}
      theme="vs-dark"
      value={value}
      onChange={(next) => {
        const code = next ?? "";
        onChange(code);
        scheduleSave(code);
      }}
      onMount={(editor, monaco) => {
        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          () => onRunRef.current(),
        );
      }}
      options={{
        fontSize: 13,
        fontFamily: "var(--font-mono), monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "all",
        lineNumbersMinChars: 3,
        tabSize: language === "python" ? 4 : 2,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      }}
    />
  );
}
