"use client";

import { useState } from 'react';
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import AppSidebar from './app-sidebar';
import FileManager from './file-manager';
import EditorPanel from './editor-panel';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface Capture {
  id: string;
  name: string;
  src: string;
  type: 'image' | 'video';
  tags: string[];
  file?: File; // Store the original file for later use
}

const initialCaptures: Capture[] = [
  { id: '1', name: 'Dashboard_Analytics.png', src: 'https://placehold.co/1280x720.png', type: 'image', tags: ['dashboard', 'analytics'] },
  { id: '2', name: 'User_Profile_UI.png', src: 'https://placehold.co/800x600.png', type: 'image', tags: ['ui', 'profile'] },
  { id: '3', name: 'Code_Snippet_React.png', src: 'https://placehold.co/1024x576.png', type: 'image', tags: ['code', 'react'] },
  { id: '4', name: 'Feature_Walkthrough.mp4', src: 'https://placehold.co/1920x1080.png', type: 'video', tags: ['tutorial', 'video'] },
  { id: '5', name: 'Mobile_App_Mockup.png', src: 'https://placehold.co/414x896.png', type: 'image', tags: ['mobile', 'mockup'] },
  { id: '6', name: 'Website_Homepage.png', src: 'https://placehold.co/1600x900.png', type: 'image', tags: ['web', 'design'] },
];

export default function VisionaryCaptureClient() {
  const [captures, setCaptures] = useState<Capture[]>(initialCaptures);
  const [selectedCapture, setSelectedCapture] = useState<Capture | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleFileSelect = async (file: File, type: 'image' | 'video') => {
    try {
        const dataUri = await fileToDataUri(file);
        const newCapture: Capture = {
            id: crypto.randomUUID(),
            name: file.name,
            src: dataUri,
            type: type,
            tags: ['new', 'capture'],
            file: file,
        };
        setCaptures(prev => [newCapture, ...prev]);
        setSelectedCapture(newCapture);
        toast({
            title: "Capture Added",
            description: `${file.name} has been added to your library.`,
        });
    } catch (error) {
        console.error("Error handling file select:", error);
        toast({
            variant: "destructive",
            title: "File Error",
            description: "There was an error processing your file.",
        });
    }
  };

  const handleSelectCapture = (capture: Capture) => {
    setSelectedCapture(capture);
  };

  const handleBackToFiles = () => {
    setSelectedCapture(null);
  };

  const handleDeleteCapture = (id: string) => {
    setCaptures(captures.filter(c => c.id !== id));
    setSelectedCapture(null);
    toast({
        title: "Capture Deleted",
        description: `The capture has been removed from your library.`,
    });
  };

  const handleUpdateCapture = (id: string, updates: Partial<Capture>) => {
    setCaptures(captures.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selectedCapture?.id === id) {
        setSelectedCapture(prev => prev ? { ...prev, ...updates } : null);
    }
    toast({
        title: "Capture Updated",
        description: `The capture has been successfully updated.`,
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar onFileSelect={handleFileSelect} />
      <SidebarInset className="p-0 m-0 h-screen overflow-hidden">
        {selectedCapture ? (
          <EditorPanel 
            capture={selectedCapture}
            onBack={handleBackToFiles}
            onDelete={handleDeleteCapture}
            onUpdate={handleUpdateCapture}
          />
        ) : (
          <FileManager 
            captures={captures} 
            onSelectCapture={handleSelectCapture}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
