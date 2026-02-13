import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, RotateCcw, Eye, Code2, Music } from "lucide-react";
import abcjs from "abcjs";

interface NotationViewerProps {
  abcNotation: string;
}

const NotationViewer = ({ abcNotation }: NotationViewerProps) => {
  const notationRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const synthRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (notationRef.current && abcNotation) {
      const visualObj = abcjs.renderAbc(notationRef.current, abcNotation, {
        responsive: "resize",
        staffwidth: 800,
        paddingtop: 20,
        paddingbottom: 20,
        add_classes: true,
      });

      // Set up synth for playback
      if (abcjs.synth.supportsAudio()) {
        const synth = new abcjs.synth.CreateSynth();
        synthRef.current = { synth, visualObj: visualObj[0] };
      }
    }

    return () => {
      stopPlayback();
    };
  }, [abcNotation]);

  const handlePlay = async () => {
    if (!synthRef.current) return;

    try {
      const { synth, visualObj } = synthRef.current;

      if (isPlaying) {
        stopPlayback();
        return;
      }

      await synth.init({ visualObj });
      await synth.prime();

      const timer = new abcjs.TimingCallbacks(visualObj, {
        eventCallback: () => { return undefined as any; },
      });

      timerRef.current = timer;
      synth.start();
      timer.start();
      setIsPlaying(true);

      // Auto-stop when done
      const duration = synth.totalDuration || 30;
      setTimeout(() => stopPlayback(), duration * 1000 + 500);
    } catch (err) {
      console.error("Playback error:", err);
      setIsPlaying(false);
    }
  };

  const stopPlayback = () => {
    if (synthRef.current?.synth) {
      try { synthRef.current.synth.stop(); } catch {}
    }
    if (timerRef.current) {
      try { timerRef.current.stop(); } catch {}
    }
    setIsPlaying(false);
  };

  if (!abcNotation) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Music className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Upload and transcribe an audio file to see the notation here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Sheet Music
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePlay}>
              {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isPlaying ? "Stop" : "Play"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => stopPlayback()}>
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowRaw(!showRaw)}>
              {showRaw ? <Eye className="h-4 w-4 mr-1" /> : <Code2 className="h-4 w-4 mr-1" />}
              {showRaw ? "Visual" : "ABC"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showRaw ? (
          <Textarea
            value={abcNotation}
            readOnly
            className="font-mono text-sm min-h-[300px] bg-muted/30"
          />
        ) : (
          <div
            ref={notationRef}
            className="bg-white rounded-lg p-4 overflow-x-auto min-h-[300px]"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default NotationViewer;
