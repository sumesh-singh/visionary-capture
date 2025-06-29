"use client";

import Image from "next/image";
import { ArrowLeft, Tag, Trash2, Download } from "lucide-react";
import type { Capture } from "./visionary-capture-client";
import { Button } from "./ui/button";
import AiTools from "./ai-tools";

interface EditorPanelProps {
  capture: Capture;
  onBack: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Capture>) => void;
}

export default function EditorPanel({ capture, onBack, onDelete, onUpdate }: EditorPanelProps) {
  
  const handleApplyRedaction = (redactedDataUri: string) => {
    onUpdate(capture.id, { src: redactedDataUri, file: undefined });
  };
  
  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft />
            <span className="sr-only">Back to files</span>
          </Button>
          <div className="flex-1 mx-4">
            <h2 className="text-lg font-semibold truncate font-headline">{capture.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Tag className="h-4 w-4" />
              <span className="sr-only">Tags</span>
            </Button>
            <Button variant="outline" size="icon" asChild>
                <a href={capture.src} download={capture.name}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                </a>
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onDelete(capture.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-center">
            <div className="relative w-full h-full flex justify-center items-center">
                <Image
                    src={capture.src}
                    alt={capture.name}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
            </div>
        </main>
      </div>
      <aside className="w-full max-w-sm border-l bg-card p-4 overflow-y-auto">
        <AiTools capture={capture} onApplyRedaction={handleApplyRedaction} />
      </aside>
    </div>
  );
}
