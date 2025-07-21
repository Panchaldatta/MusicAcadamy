import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Mic, Play, Pause, Square, RotateCcw, Volume2, Settings, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

const PracticeRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [sessionProgress, setSessionProgress] = useState(35);
  const [completedTasks, setCompletedTasks] = useState(2);
  const [totalTasks] = useState(5);

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Playback timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && totalDuration > 0) {
      interval = setInterval(() => {
        setPlaybackTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setTotalDuration(recordingTime);
      setPlaybackTime(0);
      // Simulate completing a task
      if (recordingTime > 10) {
        setCompletedTasks(prev => Math.min(prev + 1, totalTasks));
        setSessionProgress(prev => Math.min(prev + 15, 100));
      }
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (totalDuration === 0) return;
    
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (playbackTime >= totalDuration) {
        setPlaybackTime(0);
      }
    }
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsPlaying(false);
    setRecordingTime(0);
    setPlaybackTime(0);
    setTotalDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playbackProgress = totalDuration > 0 ? (playbackTime / totalDuration) * 100 : 0;

  return (
    <>
      <Navigation />
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Practice Room</h1>
            <p className="text-gray-300">Record, analyze, and improve your performance with AI feedback</p>
          </div>

          {/* Session Progress */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Session Progress
                </CardTitle>
                <Badge className="bg-purple-600">
                  {completedTasks}/{totalTasks} Tasks
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Overall Progress</span>
                  <span className="text-white">{sessionProgress}%</span>
                </div>
                <Progress value={sessionProgress} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-400">{formatTime(recordingTime + (totalDuration || 0))}</div>
                  <div className="text-xs text-gray-400">Practice Time</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-pink-400">{completedTasks}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-400">92%</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
              </div>
            </CardContent>
          </Card>

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
              <div className="h-32 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center border border-white/10 relative">
                <div className="flex items-end gap-1 h-16">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-200 ${
                        isRecording ? 'animate-pulse' : isPlaying ? 'animate-bounce' : ''
                      }`}
                      style={{ 
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                {/* Timer Display */}
                <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-white text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {isRecording ? formatTime(recordingTime) : formatTime(playbackTime)}
                    {totalDuration > 0 && !isRecording && ` / ${formatTime(totalDuration)}`}
                  </span>
                </div>
              </div>

              {/* Playback Progress */}
              {totalDuration > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Playback Progress</span>
                    <span>{Math.round(playbackProgress)}%</span>
                  </div>
                  <Progress value={playbackProgress} className="h-2" />
                </div>
              )}

              {/* Volume Control */}
              <div className="flex items-center gap-4">
                <Volume2 className="h-4 w-4 text-gray-300" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-300 w-12">{volume[0]}%</span>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleRecord}
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
                  onClick={handlePlay}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-2 rounded-xl"
                  disabled={isRecording || totalDuration === 0}
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                
                <Button
                  onClick={handleReset}
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
                  <Progress value={92} className="h-2" />
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
                  <Progress value={85} className="h-2" />
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
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">Breath Control Exercise</p>
                        <p className="text-gray-300 text-sm">Practice sustained notes to improve your breath support and pitch stability.</p>
                      </div>
                      <CheckCircle className={`h-4 w-4 ${completedTasks > 0 ? 'text-green-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">Metronome Practice</p>
                        <p className="text-gray-300 text-sm">Use a metronome at 80 BPM to improve your rhythmic accuracy.</p>
                      </div>
                      <CheckCircle className={`h-4 w-4 ${completedTasks > 1 ? 'text-green-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">Scale Practice</p>
                        <p className="text-gray-300 text-sm">Work on C major scale transitions to improve pitch accuracy in higher registers.</p>
                      </div>
                      <CheckCircle className={`h-4 w-4 ${completedTasks > 2 ? 'text-green-400' : 'text-gray-500'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PracticeRoom;
