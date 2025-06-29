"use client";

import { useState, useRef, useCallback, useMemo } from 'react';
import { toPng } from 'html-to-image';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brush, Download, Loader2, Moon, Settings, Sun, Wand2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { explainCode } from '@/ai/flows/explain-code';

const initialCode = `import React from "react";

function HelloWorld() {
  return <h1>Hello, World!</h1>;
}`;

const gradients = [
  'bg-gradient-to-br from-purple-500 to-indigo-600',
  'bg-gradient-to-br from-pink-500 to-rose-500',
  'bg-gradient-to-br from-green-400 to-blue-500',
  'bg-gradient-to-br from-yellow-400 to-orange-500',
  'bg-slate-800'
];

const languagesList = [
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'bash', label: 'Bash' },
    { value: 'markdown', label: 'Markdown' },
];

export default function VisionaryCaptureClient() {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('jsx');
  const [padding, setPadding] = useState(64);
  const [windowTheme, setWindowTheme] = useState<'dark' | 'light'>('dark');
  const [background, setBackground] = useState(gradients[0]);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [watermark, setWatermark] = useState('Visionary Capture');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => code.split('\n').length, [code]);
  const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);

  const handleDownload = useCallback(() => {
    if (editorRef.current === null) {
      return;
    }
    toPng(editorRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'code-snippet.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
      });
  }, [editorRef]);

  const handleExplainCode = async () => {
    setIsExplaining(true);
    setExplanation('');
    try {
      const result = await explainCode({ code, language });
      setExplanation(result.explanation);
    } catch (error) {
      console.error("Code explanation failed:", error);
      toast({
        variant: "destructive",
        title: "Explanation Failed",
        description: "Could not generate an explanation for the code.",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4 md:p-8 font-code">
      <main className="flex flex-col items-center justify-center gap-8 w-full">
        <div ref={editorRef} className={cn('transition-all duration-300 rounded-xl relative', background)} style={{ padding: `${padding}px` }}>
          <div
            className={cn(
              'rounded-xl shadow-2xl overflow-hidden',
              windowTheme === 'dark' ? 'bg-black/75' : 'bg-gray-50/75',
              'backdrop-blur-sm'
            )}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 bg-black/20">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-yellow-500"></span>
                <span className="h-3.5 w-3.5 rounded-full bg-green-500"></span>
            </div>
            <div className="flex items-start">
                {showLineNumbers && (
                    <div
                        className="flex-shrink-0 select-none py-4 pl-4 pr-3 text-right text-muted-foreground"
                        style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 16,
                            lineHeight: 1.6,
                        }}
                    >
                    {lines.map((num) => (
                        <div key={num}>{num}</div>
                    ))}
                    </div>
                )}
                <div className={cn('code-editor-container py-4 pr-4 w-full', windowTheme, !showLineNumbers && "pl-4")}>
                    <Editor
                        value={code}
                        onValueChange={setCode}
                        highlight={(code) => highlight(code, languages[language] || languages.clike, language)}
                        padding={0}
                        className="editor"
                        style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: 16,
                            lineHeight: 1.6,
                            minWidth: '600px',
                        }}
                    />
                </div>
            </div>
          </div>
          {watermark && (
            <div className="absolute bottom-4 right-6 text-white/50 text-sm font-sans pointer-events-none">
                {watermark}
            </div>
          )}
        </div>

        <Card className="w-full max-w-4xl fixed bottom-4 md:bottom-8">
            <CardContent className="p-4">
                <Tabs defaultValue="style" className="w-full">
                    <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
                        <TabsList>
                            <TabsTrigger value="style"><Brush className="mr-2"/>Style</TabsTrigger>
                            <TabsTrigger value="settings"><Settings className="mr-2"/>Settings</TabsTrigger>
                            <TabsTrigger value="ai"><Wand2 className="mr-2"/>AI Tools</TabsTrigger>
                        </TabsList>
                        <Button onClick={handleDownload} className="w-full md:w-auto">
                            <Download className="mr-2" />
                            Export PNG
                        </Button>
                    </div>

                    <TabsContent value="style" className="mt-6 md:mt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                            <div>
                                <Label className="mb-2 block text-xs">Padding ({padding}px)</Label>
                                <Slider
                                    value={[padding]}
                                    onValueChange={(value) => setPadding(value[0])}
                                    min={16}
                                    max={128}
                                    step={8}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-xs">Background</Label>
                                <div className="flex items-center gap-2">
                                    {gradients.map((grad) => (
                                        <button
                                            key={grad}
                                            onClick={() => setBackground(grad)}
                                            className={cn(
                                                'h-7 w-7 rounded-full transition-all duration-200 border-2 border-transparent',
                                                grad,
                                                background === grad ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label className="mb-2 block text-xs">Theme</Label>
                                <Button onClick={() => setWindowTheme(windowTheme === 'dark' ? 'light' : 'dark')} variant="outline" className="w-full h-9">
                                    {windowTheme === 'dark' ? <Sun className="mr-2"/> : <Moon className="mr-2"/>}
                                    {windowTheme === 'dark' ? 'Light' : 'Dark'}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6 md:mt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                            <div>
                                <Label className="mb-2 block text-xs">Language</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languagesList.map((lang) => (
                                            <SelectItem key={lang.value} value={lang.value}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2 pt-5">
                                <Switch
                                    id="line-numbers"
                                    checked={showLineNumbers}
                                    onCheckedChange={setShowLineNumbers}
                                />
                                <Label htmlFor="line-numbers">Line Numbers</Label>
                            </div>
                            <div>
                                <Label className="mb-2 block text-xs">Watermark</Label>
                                <Input
                                    value={watermark}
                                    onChange={(e) => setWatermark(e.target.value)}
                                    placeholder="Your watermark"
                                    className="h-9"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ai" className="mt-6 md:mt-0">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-muted-foreground flex-1">Generate an explanation of your code to better understand its functionality.</p>
                                <Button onClick={handleExplainCode} variant="outline" disabled={isExplaining}>
                                    {isExplaining ? <Loader2 className="animate-spin" /> : <Wand2 className="mr-2" />}
                                    Explain Code
                                </Button>
                            </div>
                            {(isExplaining || explanation) && (
                                <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                                    {isExplaining && !explanation && <p className="text-sm text-muted-foreground">Generating explanation...</p>}
                                    {explanation && <div
                                        className="explanation-content max-w-none text-sm"
                                        dangerouslySetInnerHTML={{ __html: explanation }}
                                    />}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
