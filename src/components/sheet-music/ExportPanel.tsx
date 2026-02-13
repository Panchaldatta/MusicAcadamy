import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Music2, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import abcjs from "abcjs";
import { useRef, useEffect } from "react";

interface ExportPanelProps {
  abcNotation: string;
  fileName: string;
}

const ExportPanel = ({ abcNotation, fileName }: ExportPanelProps) => {
  const { toast } = useToast();
  const hiddenNotationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hiddenNotationRef.current && abcNotation) {
      abcjs.renderAbc(hiddenNotationRef.current, abcNotation, {
        staffwidth: 800,
        paddingtop: 20,
        paddingbottom: 20,
      });
    }
  }, [abcNotation]);

  const exportABC = () => {
    const blob = new Blob([abcNotation], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "sheet-music"}.abc`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "ABC notation file downloaded." });
  };

  const exportSVG = () => {
    if (!hiddenNotationRef.current) return;
    const svg = hiddenNotationRef.current.querySelector("svg");
    if (!svg) {
      toast({ title: "Export failed", description: "No notation to export", variant: "destructive" });
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "sheet-music"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "SVG sheet music file downloaded." });
  };

  const exportMIDI = async () => {
    try {
      if (!abcjs.synth.supportsAudio()) {
        toast({ title: "Not supported", description: "Audio synthesis is not supported in your browser", variant: "destructive" });
        return;
      }

      // Generate MIDI using abcjs
      const midiBuffer = new abcjs.synth.CreateSynth();
      const visualObj = abcjs.renderAbc("*", abcNotation);
      await midiBuffer.init({ visualObj: visualObj[0] });
      await midiBuffer.prime();

      // abcjs doesn't directly export MIDI files, so we export ABC which can be converted
      const blob = new Blob([abcNotation], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName || "sheet-music"}.abc`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "ABC file exported",
        description: "Use a tool like abc2midi to convert this ABC file to MIDI format.",
      });
    } catch (err) {
      console.error("MIDI export error:", err);
      toast({ title: "Export failed", description: "Could not generate MIDI export", variant: "destructive" });
    }
  };

  if (!abcNotation) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Download className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Generate sheet music first to export.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export Options
        </CardTitle>
        <CardDescription>Download your sheet music in various formats</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* SVG / PDF */}
          <button
            onClick={exportSVG}
            className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">SVG Sheet Music</p>
              <p className="text-xs text-muted-foreground mt-1">Vector graphic for printing</p>
            </div>
          </button>

          {/* ABC Notation */}
          <button
            onClick={exportABC}
            className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileDown className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">ABC Notation</p>
              <p className="text-xs text-muted-foreground mt-1">Standard notation text format</p>
            </div>
          </button>

          {/* MIDI */}
          <button
            onClick={exportMIDI}
            className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Music2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">MIDI Export</p>
              <p className="text-xs text-muted-foreground mt-1">Playable backing track</p>
            </div>
          </button>
        </div>

        {/* Hidden notation for SVG export */}
        <div ref={hiddenNotationRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
