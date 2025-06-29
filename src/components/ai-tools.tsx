"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Loader2, ShieldOff, ScanText, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { redactSensitiveInfo } from "@/ai/flows/redact-sensitive-info";
import { extractTextFromScreenshot } from "@/ai/flows/extract-text-from-screenshot";
import type { Capture } from "./visionary-capture-client";
import { fileToDataUri, urlToDataUri } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

interface AiToolsProps {
  capture: Capture;
  onApplyRedaction: (redactedDataUri: string) => void;
}

export default function AiTools({ capture, onApplyRedaction }: AiToolsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("redact");

  const [isLoadingRedaction, setIsLoadingRedaction] = useState(false);
  const [redactedImageUri, setRedactedImageUri] = useState<string | null>(null);

  const [isLoadingExtraction, setIsLoadingExtraction] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const getCaptureDataUri = async (): Promise<string | null> => {
    try {
      if (capture.file) {
        return await fileToDataUri(capture.file);
      }
      if (capture.src.startsWith("http")) {
        return await urlToDataUri(capture.src);
      }
      return capture.src;
    } catch (error) {
      console.error("Error converting image to data URI:", error);
      toast({
        variant: "destructive",
        title: "Error preparing image",
        description: "Could not process the image file for AI actions.",
      });
      return null;
    }
  };

  const handleRedact = async () => {
    setIsLoadingRedaction(true);
    setRedactedImageUri(null);
    const dataUri = await getCaptureDataUri();
    if (!dataUri) {
      setIsLoadingRedaction(false);
      return;
    }

    try {
      const result = await redactSensitiveInfo({ photoDataUri: dataUri });
      setRedactedImageUri(result.redactedPhotoDataUri);
    } catch (error) {
      console.error("Redaction failed:", error);
      toast({
        variant: "destructive",
        title: "Redaction Failed",
        description: "Could not redact sensitive information from the image.",
      });
    } finally {
      setIsLoadingRedaction(false);
    }
  };

  const handleExtractText = async () => {
    setIsLoadingExtraction(true);
    setExtractedText(null);
    const dataUri = await getCaptureDataUri();
    if (!dataUri) {
      setIsLoadingExtraction(false);
      return;
    }

    try {
      const result = await extractTextFromScreenshot({ photoDataUri: dataUri });
      setExtractedText(result.extractedText);
    } catch (error) {
      console.error("Text extraction failed:", error);
      toast({
        variant: "destructive",
        title: "Text Extraction Failed",
        description: "Could not extract text from the image.",
      });
    } finally {
      setIsLoadingExtraction(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      toast({
        title: "Copied to clipboard!",
        description: "The extracted text has been copied.",
      });
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-sm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="redact">
          <ShieldOff className="mr-2" />
          Redact
        </TabsTrigger>
        <TabsTrigger value="extract">
          <ScanText className="mr-2" />
          Extract Text
        </TabsTrigger>
      </TabsList>
      <TabsContent value="redact">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Smart Redaction</h3>
              <p className="text-sm text-muted-foreground">
                Automatically detect and blur sensitive information like emails, phone numbers, and credit cards.
              </p>
              <Button onClick={handleRedact} disabled={isLoadingRedaction} className="w-full">
                {isLoadingRedaction ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Redact Information
                  </>
                )}
              </Button>
              {redactedImageUri && (
                <div className="space-y-2">
                  <h4 className="font-medium">Redacted Image</h4>
                  <div className="rounded-md border overflow-hidden">
                    <Image src={redactedImageUri} width={400} height={250} alt="Redacted" className="w-full h-auto" />
                  </div>
                  <Button onClick={() => onApplyRedaction(redactedImageUri)} className="w-full" variant="secondary">
                    Apply Redaction
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="extract">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium font-headline">Text Extraction</h3>
              <p className="text-sm text-muted-foreground">
                Use OCR to extract all text from the screenshot, making it selectable and searchable.
              </p>
              <Button onClick={handleExtractText} disabled={isLoadingExtraction} className="w-full">
                {isLoadingExtraction ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Wand2 className="mr-2" />
                    Extract Text
                  </>
                )}
              </Button>
              {extractedText !== null && (
                <div className="space-y-2">
                  <div className="relative">
                    <Textarea
                      readOnly
                      value={extractedText}
                      placeholder="No text extracted."
                      className="h-48 resize-none"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopyToClipboard}
                      className="absolute top-2 right-2 h-7 w-7"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
