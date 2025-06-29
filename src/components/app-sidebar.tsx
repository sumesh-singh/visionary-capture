"use client";

import { Camera, FileImage, Folder, Settings, Star, Video, Zap } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import React from 'react';

interface AppSidebarProps {
    onFileSelect: (file: File, type: 'image' | 'video') => void;
}

export default function AppSidebar({ onFileSelect }: AppSidebarProps) {
    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const videoInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file, type);
        }
        // Reset file input to allow selecting the same file again
        event.target.value = '';
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <div className="bg-primary rounded-lg p-2 text-primary-foreground">
                        <Zap className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-headline font-semibold">Visionary Capture</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="p-2 space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => imageInputRef.current?.click()}>
                        <Camera /> Capture Image
                    </Button>
                     <input
                        type="file"
                        ref={imageInputRef}
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => videoInputRef.current?.click()}>
                        <Video /> Record Screen
                    </Button>
                    <input
                        type="file"
                        ref={videoInputRef}
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="hidden"
                        accept="video/*"
                    />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive>
                            <FileImage />
                            All Captures
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Star />
                            Favorites
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Folder />
                            Collections
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Settings />
                            Settings
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' }
>(({ className, variant, ...props }, ref) => (
  <button
    ref={ref}
    className={`flex items-center text-sm px-4 py-2 rounded-md w-full transition-colors
      ${variant === 'outline'
        ? 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground'
        : 'bg-primary text-primary-foreground hover:bg-primary/90'
      } ${className}`}
    {...props}
  />
));
Button.displayName = 'Button';
