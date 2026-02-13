import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioUploader from "@/components/sheet-music/AudioUploader";
import NotationViewer from "@/components/sheet-music/NotationViewer";
import ExportPanel from "@/components/sheet-music/ExportPanel";
import { useState } from "react";
import { Music, Upload, FileText, Download } from "lucide-react";

const SheetMusic = () => {
  const [abcNotation, setAbcNotation] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-20 pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Music className="h-4 w-4" />
              AI-Powered Transcription
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Sheet Music <span className="text-primary">Generator</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Upload audio or paste a URL — our AI transcribes it into standard notation with playable backing tracks.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="upload" className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Upload className="h-3.5 w-3.5" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="notation" className="flex items-center gap-1.5 text-xs sm:text-sm" disabled={!abcNotation}>
                  <FileText className="h-3.5 w-3.5" />
                  Notation
                </TabsTrigger>
                <TabsTrigger value="export" className="flex items-center gap-1.5 text-xs sm:text-sm" disabled={!abcNotation}>
                  <Download className="h-3.5 w-3.5" />
                  Export
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <AudioUploader
                  onTranscriptionComplete={(abc, name) => {
                    setAbcNotation(abc);
                    setFileName(name);
                  }}
                  isTranscribing={isTranscribing}
                  setIsTranscribing={setIsTranscribing}
                />
              </TabsContent>

              <TabsContent value="notation">
                <NotationViewer abcNotation={abcNotation} />
              </TabsContent>

              <TabsContent value="export">
                <ExportPanel abcNotation={abcNotation} fileName={fileName} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SheetMusic;
