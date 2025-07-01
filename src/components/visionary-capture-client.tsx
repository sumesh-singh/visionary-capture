
"use client";

import { useState, useRef, useCallback, useMemo, forwardRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

// PrismJS language dependencies. Order matters.
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';

import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Brush, Download, Image as ImageIcon, Loader2, Settings, Menu } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Type definitions
type WindowTheme = 'dark' | 'light' | 'midnight' | 'sunrise';
type Language = 'jsx' | 'tsx' | 'javascript' | 'typescript' | 'css' | 'json' | 'bash' | 'markdown' | 'python' | 'java' | 'csharp' | 'go' | 'rust' | 'php' | 'sql' | 'yaml';
const initialCode = `import React from "react";

function HelloWorld() {
  return <h1>Hello, World!</h1>;
}`;

// Data for controls
const backgrounds = [
  { value: "bg-gradient-to-br from-purple-500 to-indigo-600", name: "Purple Dream" },
  { value: "bg-gradient-to-br from-pink-500 to-rose-500", name: "Sunset" },
  { value: "bg-gradient-to-br from-green-400 to-blue-500", name: "Ocean" },
  { value: "bg-gradient-to-br from-yellow-400 to-orange-500", name: "Citrus" },
  { value: "bg-gradient-to-br from-teal-400 to-cyan-600", name: "Aqua" },
  { value: "bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500", name: "Aurora" },
  { value: "bg-slate-800", name: "Slate" },
  { value: "bg-zinc-900", name: "Zinc" },
  { value: "bg-neutral-50", name: "White" },
];

const themes: {value: WindowTheme, label: string}[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'midnight', label: 'Midnight' },
    { value: 'sunrise', label: 'Sunrise' },
];

const languagesList: {value: Language, label: string}[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'jsx', label: 'JSX' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'tsx', label: 'TSX' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'bash', label: 'Bash' },
    { value: 'markdown', label: 'Markdown' },
];

// ControlPanel Component
interface ControlPanelProps {
  state: any;
  setters: any;
  handlers: any;
}

function ControlPanel({ state, setters, handlers }: ControlPanelProps) {
  const handleCustomBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setters.setCustomBackground(e.target.value);
    setters.setActiveBg(e.target.value);
  }
  
  return (
    <aside className="w-full h-full bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold font-headline">Visionary Capture</h1>
        <p className="text-sm text-muted-foreground">
          Create beautiful code screenshots.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={["style", "settings"]} className="w-full">
          <AccordionItem value="style">
            <AccordionTrigger className="px-4 text-base">
              <div className="flex items-center gap-2">
                <Brush className="h-4 w-4" /> Style
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 space-y-4">
              <div>
                <Label className="mb-2 block text-xs">Background Gradients</Label>
                <div className="grid grid-cols-5 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.value}
                      title={bg.name}
                      onClick={() => setters.setActiveBg(bg.value)}
                      className={cn(
                        "h-8 w-full rounded-md transition-all duration-200 border-2",
                        bg.value,
                        state.activeBg === bg.value
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary"
                          : "border-transparent hover:scale-105"
                      )}
                    />
                  ))}
                </div>
              </div>
               <div>
                <Label htmlFor="custom-bg-color" className="mb-2 block text-xs">Custom Color</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="custom-bg-color"
                    type="color" 
                    value={state.customBackground} 
                    onChange={handleCustomBgChange}
                    className="w-10 h-10 p-1" 
                  />
                  <Input 
                    type="text"
                    value={state.customBackground}
                    onChange={handleCustomBgChange}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label className="mb-2 block text-xs">Window Theme</Label>
                 <Select value={state.windowTheme} onValueChange={setters.setWindowTheme}>
                    <SelectTrigger>
                        <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                        {themes.map((theme) => (
                            <SelectItem key={theme.value} value={theme.value}>
                                {theme.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2 block text-xs">
                  Padding ({state.padding}px)
                </Label>
                <Slider
                  value={[state.padding]}
                  onValueChange={(value) => setters.setPadding(value[0])}
                  min={16}
                  max={128}
                  step={8}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="effects">
            <AccordionTrigger className="px-4 text-base">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Effects
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 space-y-4">
              <div>
                <Label className="mb-2 block text-xs">Brightness ({state.brightness}%)</Label>
                <Slider
                  value={[state.brightness]}
                  onValueChange={(v) => setters.setBrightness(v[0])}
                  min={50} max={150} step={1}
                />
              </div>
              <div>
                <Label className="mb-2 block text-xs">Contrast ({state.contrast}%)</Label>
                <Slider
                  value={[state.contrast]}
                  onValueChange={(v) => setters.setContrast(v[0])}
                  min={50} max={150} step={1}
                />
              </div>
              <div>
                <Label className="mb-2 block text-xs">Saturation ({state.saturation}%)</Label>
                <Slider
                  value={[state.saturation]}
                  onValueChange={(v) => setters.setSaturation(v[0])}
                  min={0} max={200} step={1}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="settings">
            <AccordionTrigger className="px-4 text-base">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 space-y-4">
                <div>
                    <Label className="mb-2 block text-xs">Language</Label>
                    <Select value={state.language} onValueChange={(val: Language) => setters.setLanguage(val)}>
                        <SelectTrigger>
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
                <div className="flex items-center space-x-2 pt-2">
                    <Switch
                        id="line-numbers"
                        checked={state.showLineNumbers}
                        onCheckedChange={setters.setShowLineNumbers}
                    />
                    <Label htmlFor="line-numbers">Show Line Numbers</Label>
                </div>
                <div>
                    <Label className="mb-2 block text-xs">Watermark</Label>
                    <Input
                        value={state.watermark}
                        onChange={(e) => setters.setWatermark(e.target.value)}
                        placeholder="Your watermark"
                    />
                </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="p-4 border-t mt-auto">
        {state.installPrompt && (
          <Button
            onClick={handlers.handleInstallClick}
            className="w-full mb-2 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            variant="outline"
          >
            <Download className="mr-2" />
            Install App
          </Button>
        )}
        <Button
          onClick={handlers.handleDownload}
          className="w-full rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          disabled={state.isDownloading}
        >
          {state.isDownloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Download className="mr-2" />
              Download PNG
            </>
          )}
        </Button>
         <p className="text-xs text-muted-foreground text-center mt-2">HD rendering enabled for best quality.</p>
      </div>
    </aside>
  );
}

// CodePreview Component
interface CodePreviewProps {
    code: string;
    language: Language;
    padding: number;
    windowTheme: WindowTheme;
    activeBg: string;
    showLineNumbers: boolean;
    watermark: string;
    brightness: number;
    contrast: number;
    saturation: number;
    setCode: (code: string) => void;
  }
  
const CodePreview = forwardRef<HTMLDivElement, CodePreviewProps>(
({ code, language, padding, windowTheme, activeBg, showLineNumbers, watermark, brightness, contrast, saturation, setCode }, ref) => {
    
    const lineCount = useMemo(() => code.split('\n').length, [code]);
    const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);
    
    const themeClass = {
        dark: 'bg-black/75 dark',
        light: 'bg-white/75 light',
        midnight: 'bg-[#0d1117]/80 dark',
        sunrise: 'bg-[#fafafa]/80 light'
    }[windowTheme];

    const windowChromeClass = {
        dark: 'bg-black/20',
        light: 'bg-gray-200/80',
        midnight: 'bg-black/30',
        sunrise: 'bg-gray-100/90'
    }[windowTheme];

    const isGradient = activeBg.startsWith('bg-');
    const backgroundClass = isGradient ? activeBg : '';
    const backgroundStyle = !isGradient ? { backgroundColor: activeBg } : {};
    
    const previewStyles = {
      padding: `${padding}px`,
      ...backgroundStyle,
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    };

    return (
        <div ref={ref} className={cn('transition-all duration-300 rounded-xl relative', backgroundClass)} style={previewStyles}>
            <div
                className={cn(
                'rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm',
                themeClass
                )}
            >
                <div className={cn("flex items-center gap-1.5 px-4 py-3", windowChromeClass)}>
                    <span className="h-3.5 w-3.5 rounded-full bg-red-500"></span>
                    <span className="h-3.5 w-3.5 rounded-full bg-yellow-500"></span>
                    <span className="h-3.5 w-3.5 rounded-full bg-green-500"></span>
                </div>
                <div className="flex items-start">
                    {showLineNumbers && (
                        <div
                            className="flex-shrink-0 select-none py-4 pl-4 pr-3 text-muted-foreground"
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
                    <div className={cn('code-editor-container py-4 pr-4 w-full overflow-x-auto', windowTheme === 'light' || windowTheme === 'sunrise' ? 'light' : 'dark', !showLineNumbers && "pl-4")}>
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
                            }}
                        />
                    </div>
                </div>
            </div>
            {watermark && (
                <div className="absolute bottom-6 right-8 text-white/50 text-sm font-sans pointer-events-none">
                    {watermark}
                </div>
            )}
        </div>
    );
});
CodePreview.displayName = 'CodePreview';

// Main Client Component
export default function VisionaryCaptureClient() {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>('jsx');
  const [padding, setPadding] = useState(64);
  const [windowTheme, setWindowTheme] = useState<WindowTheme>('dark');
  const [activeBg, setActiveBg] = useState(backgrounds[0].value);
  const [customBackground, setCustomBackground] = useState('#2a2a2a');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [watermark, setWatermark] = useState('Visionary Capture');
  const [isDownloading, setIsDownloading] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        toast({ title: "App Installed!", description: "Visionary Capture is now available on your device." });
      }
      setInstallPrompt(null);
      setIsSheetOpen(false);
    });
  };

  const handleDownload = useCallback(() => {
    if (editorRef.current === null) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find the element to capture.",
      });
      return;
    }
    setIsDownloading(true);
    toPng(editorRef.current, { cacheBust: true, pixelRatio: 2.5 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'visionary-capture.png';
        link.href = dataUrl;
        link.click();
        setIsSheetOpen(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not generate the image.",
        });
      })
      .finally(() => setIsDownloading(false));
  }, [editorRef, toast]);

  const state = { 
    code, language, padding, windowTheme, activeBg, customBackground, 
    showLineNumbers, watermark, isDownloading,
    brightness, contrast, saturation, installPrompt
  };
  const setters = { 
    setCode, setLanguage, setPadding, setWindowTheme, setActiveBg, setCustomBackground,
    setShowLineNumbers, setWatermark, 
    setBrightness, setContrast, setSaturation
  };
  const handlers = { handleDownload, handleInstallClick };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-80 lg:w-96 md:flex-shrink-0">
        <ControlPanel state={state} setters={setters} handlers={handlers} />
      </aside>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-grid-pattern overflow-auto relative">
        <div className="md:hidden absolute top-4 left-4 z-10">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Controls</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[85vw] max-w-sm">
                <ControlPanel state={state} setters={setters} handlers={handlers} />
            </SheetContent>
          </Sheet>
        </div>
        
        <CodePreview ref={editorRef} {...state} setCode={setCode} />
      </main>
    </div>
  );
}
