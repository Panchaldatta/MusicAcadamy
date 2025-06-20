
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Pause, Square, RotateCcw, Volume2, Settings } from "lucide-react";
import { useState } from "react";

const PracticeRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Practice Room</h1>
        <p className="text-gray-300">Record, analyze, and improve your performance with AI feedback</p>
      </div>

      {/* Recording Interface */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice & Instrument Recorder
          </CardTitle>
          <CardDescription className="text-gray-300">
            Record your practice session and get instant AI feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Waveform Visualization */}
          <div className="h-32 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center border border-white/10">
            <div className="flex items-end gap-1 h-16">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-200 ${
                    isRecording ? 'animate-pulse' : ''
                  }`}
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setIsRecording(!isRecording)}
              className={`${
                isRecording 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              } text-white px-6 py-2 rounded-xl transition-all duration-300`}
            >
              {isRecording ? <Square className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-xl"
              disabled={isRecording}
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-xl"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Pitch Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Accuracy</span>
                <Badge className="bg-green-600">92%</Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-sm text-gray-300">Great pitch control! Try to maintain consistency in the higher notes.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Rhythm Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Timing</span>
                <Badge className="bg-yellow-600">85%</Badge>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gray-300">Good rhythm foundation. Focus on maintaining steady tempo during transitions.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Suggestions */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">AI Recommendations</CardTitle>
          <CardDescription className="text-gray-300">
            Personalized suggestions to improve your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Breath Control Exercise</p>
                <p className="text-gray-300 text-sm">Practice sustained notes to improve your breath support and pitch stability.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Metronome Practice</p>
                <p className="text-gray-300 text-sm">Use a metronome at 80 BPM to improve your rhythmic accuracy.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-medium">Scale Practice</p>
                <p className="text-gray-300 text-sm">Work on C major scale transitions to improve pitch accuracy in higher registers.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeRoom;
