
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Users, Award, Target, Heart, Lightbulb } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Music",
      description: "We believe music is a universal language that connects people and enriches lives."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Using cutting-edge AI technology to make music learning more accessible and effective."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community where musicians of all levels can learn and grow together."
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Committed to providing the highest quality music education and learning experience."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Students" },
    { number: "500+", label: "Expert Teachers" },
    { number: "100+", label: "Courses Available" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
            <Music className="h-4 w-4 text-purple-300" />
            <span className="text-purple-100 text-sm">About MuseSync</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Revolutionizing Music
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Education
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            MuseSync combines the power of artificial intelligence with expert music instruction 
            to create personalized learning experiences that adapt to your unique musical journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Statement */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white mb-4">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize music education by making high-quality, personalized music learning 
              accessible to everyone, regardless of their location, schedule, or experience level. 
              We believe that everyone has the potential to create beautiful music, and our AI-powered 
              platform is designed to unlock that potential.
            </p>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white mb-4">Powered by AI Technology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300 text-center text-lg">
              Our proprietary AI algorithms analyze your playing in real-time, providing instant 
              feedback on pitch, rhythm, and technique. This allows for a truly personalized 
              learning experience that adapts to your progress.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge className="bg-purple-600 mb-2">Real-time Analysis</Badge>
                <p className="text-gray-300 text-sm">Instant feedback on your performance</p>
              </div>
              <div className="text-center">
                <Badge className="bg-pink-600 mb-2">Adaptive Learning</Badge>
                <p className="text-gray-300 text-sm">Curriculum adjusts to your pace</p>
              </div>
              <div className="text-center">
                <Badge className="bg-blue-600 mb-2">Progress Tracking</Badge>
                <p className="text-gray-300 text-sm">Detailed analytics and insights</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
