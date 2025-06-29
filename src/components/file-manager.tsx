"use client";

import Image from "next/image";
import { Search, Grid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Capture } from "./visionary-capture-client";
import { Badge } from "./ui/badge";

interface FileManagerProps {
  captures: Capture[];
  onSelectCapture: (capture: Capture) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function FileManager({ captures, onSelectCapture, searchQuery, setSearchQuery }: FileManagerProps) {
  const filteredCaptures = captures.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex h-16 items-center justify-between border-b bg-card px-6">
        <h1 className="text-2xl font-bold font-headline">All Captures</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search captures..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Grid className="h-5 w-5 text-primary" />
            <List className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {filteredCaptures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredCaptures.map((capture) => (
              <Card 
                key={capture.id} 
                className="overflow-hidden cursor-pointer group transition-all hover:shadow-lg hover:scale-105"
                onClick={() => onSelectCapture(capture)}
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <Image
                      src={capture.src}
                      alt={capture.name}
                      width={320}
                      height={180}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      data-ai-hint={capture.tags.join(' ')}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{capture.name}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {capture.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <h3 className="text-xl font-semibold">No Captures Found</h3>
            <p className="mt-2 text-sm">Try adjusting your search or add a new capture.</p>
          </div>
        )}
      </main>
    </div>
  );
}
