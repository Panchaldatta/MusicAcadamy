import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link2, Loader2, Music2, FileAudio, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AudioUploaderProps {
  onTranscriptionComplete: (abcNotation: string, fileName: string) => void;
  isTranscribing: boolean;
  setIsTranscribing: (v: boolean) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav", "audio/ogg", "audio/flac", "audio/m4a", "audio/mp4", "audio/aac"];

const AudioUploader = ({ onTranscriptionComplete, isTranscribing, setIsTranscribing }: AudioUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 20MB", variant: "destructive" });
      return;
    }
    if (!ACCEPTED_TYPES.some(t => file.type.includes(t.split("/")[1]))) {
      toast({ title: "Unsupported format", description: "Please upload MP3, WAV, OGG, FLAC, M4A, or AAC files", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to use the sheet music generator", variant: "destructive" });
      return;
    }

    setIsTranscribing(true);
    try {
      const base64 = await fileToBase64(selectedFile);

      const { data, error } = await supabase.functions.invoke("transcribe-audio", {
        body: {
          audioBase64: base64,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.abcNotation) {
        onTranscriptionComplete(data.abcNotation, selectedFile.name.replace(/\.[^/.]+$/, ""));
        toast({ title: "Transcription complete!", description: "Your sheet music is ready. Switch to the Notation tab to view it." });
      } else {
        throw new Error("No notation data returned");
      }
    } catch (err: unknown) {
      console.error("Transcription error:", err);
      const msg = err instanceof Error ? err.message : "Failed to transcribe audio";
      toast({ title: "Transcription failed", description: msg, variant: "destructive" });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleUrlTranscribe = async () => {
    if (!urlInput.trim()) return;
    toast({ title: "Coming soon", description: "URL-based transcription will be available soon. Please upload a file for now." });
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music2 className="h-5 w-5 text-primary" />
          Upload Audio
        </CardTitle>
        <CardDescription>Upload an audio file or paste a URL to generate sheet music</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="file" className="text-xs sm:text-sm">
              <Upload className="h-3.5 w-3.5 mr-1.5" /> File Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs sm:text-sm">
              <Link2 className="h-3.5 w-3.5 mr-1.5" /> URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-colors cursor-pointer ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : selectedFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              {selectedFile ? (
                <div className="space-y-3">
                  <FileAudio className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium text-foreground">Drop your audio file here</p>
                    <p className="text-sm text-muted-foreground">or click to browse · MP3, WAV, OGG, FLAC, M4A · Max 20MB</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleTranscribe}
              disabled={!selectedFile || isTranscribing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Transcribing... This may take a minute
                </>
              ) : (
                <>
                  <Music2 className="h-4 w-4 mr-2" />
                  Generate Sheet Music
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-url">Audio / YouTube URL</Label>
              <Input
                id="audio-url"
                placeholder="https://youtube.com/watch?v=... or direct audio link"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Paste a YouTube URL or direct link to an audio file</p>
            </div>
            <Button
              onClick={handleUrlTranscribe}
              disabled={!urlInput.trim() || isTranscribing}
              className="w-full"
              size="lg"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Transcribe from URL
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AudioUploader;
