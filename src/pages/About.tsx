
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Users, Award, Target, Heart, Lightbulb, Star, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Indian Music",
      description: "We believe Indian classical music is a sacred art form that connects souls and preserves our rich cultural heritage."
    },
    {
      icon: Lightbulb,
      title: "Traditional & Modern",
      description: "Blending centuries-old teaching traditions with modern technology to make learning accessible worldwide."
    },
    {
      icon: Users,
      title: "Guru-Shishya Parampara",
      description: "Honoring the sacred teacher-student relationship that has preserved Indian music for generations."
    },
    {
      icon: Target,
      title: "Excellence in Teaching",
      description: "Committed to maintaining the highest standards of musical education and authentic Indian classical training."
    }
  ];

  const stats = [
    { number: "15K+", label: "Active Students" },
    { number: "500+", label: "Expert Gurus" },
    { number: "25+", label: "Musical Instruments" },
    { number: "98%", label: "Success Rate" }
  ];

  const features = [
    "Live one-on-one sessions with certified gurus",
    "Traditional ragas and talas instruction",
    "Personalized curriculum based on your goals",
    "Practice sessions with tanpura and tabla",
    "Performance opportunities and competitions",
    "Certificate programs available"
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 rounded-full px-6 py-3 mb-8">
              <Music className="h-5 w-5 text-orange-600" />
              <span className="text-orange-700 font-medium">About Soundsync</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Preserving India's
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block">
                Musical Heritage
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Soundsync connects passionate students with master musicians and acclaimed gurus, 
              making authentic Indian classical music education accessible to learners worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                Find a Guru
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-orange-200 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission Statement */}
          <Card className="mb-16 border-orange-200 bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900 mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                To preserve and propagate the timeless tradition of Indian classical music by connecting 
                dedicated students with authentic gurus. We strive to make this sacred knowledge accessible 
                to everyone, regardless of their geographical location, while maintaining the sanctity of 
                the guru-shishya parampara.
              </p>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="border-orange-200 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-gray-900 text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 mb-4">What We Offer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 mb-4">Why Choose Soundsync?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Authentic Teaching</h4>
                    <p className="text-gray-600 text-sm">Learn from certified gurus with decades of experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Flexible Schedule</h4>
                    <p className="text-gray-600 text-sm">Book lessons that fit your lifestyle and timezone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                    <p className="text-gray-600 text-sm">Monitor your musical journey with detailed analytics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-0 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Begin Your Musical Journey?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students learning authentic Indian classical music with expert gurus
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Find Your Guru
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Start Free Trial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default About;
