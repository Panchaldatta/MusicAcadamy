
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Mic, Users, Brain, Calendar, Award, Play, Star, ArrowRight, Check, Trophy, BookOpen, Target, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  // Animation effect for roadmap steps
  useEffect(() => {
    const timer = setTimeout(() => {
      roadmapSteps.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSteps(prev => [...prev, index]);
        }, index * 200);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic lessons access",
        "Practice room (5 sessions/month)",
        "Community access",
        "Basic progress tracking"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Pro",
      price: "$19",
      period: "month",
      features: [
        "Unlimited lessons & practice",
        "AI feedback & analysis",
        "Live class booking",
        "Personalized assignments",
        "Progress analytics",
        "Teacher messaging"
      ],
      popular: true,
      color: "border-purple-500 ring-2 ring-purple-200"
    },
    {
      name: "Premium",
      price: "$39",
      period: "month",
      features: [
        "Everything in Pro",
        "1:1 monthly sessions",
        "Custom learning paths",
        "Sheet music generator",
        "Priority support",
        "Certification access"
      ],
      popular: false,
      color: "border-gray-200"
    }
  ];

  const featuresForStudents = [
    { icon: Music, title: "Interactive Lessons", desc: "Gamified modules for all instruments and vocals" },
    { icon: Brain, title: "AI Feedback", desc: "Real-time pitch, rhythm, and tempo analysis" },
    { icon: Play, title: "Live Classes", desc: "Attend live sessions or access recordings" },
    { icon: Award, title: "Practice Challenges", desc: "Daily challenges to improve your skills" }
  ];

  const featuresForTeachers = [
    { icon: Users, title: "Student Dashboard", desc: "Track progress and provide feedback" },
    { icon: Calendar, title: "Smart Scheduling", desc: "Book 1:1 or group sessions easily" },
    { icon: Music, title: "Custom Assignments", desc: "Upload sheet music and set goals" }
  ];

  const roadmapSteps = [
    {
      level: "Beginner",
      title: "Foundation Certificate",
      duration: "3-6 months",
      icon: BookOpen,
      skills: ["Basic music theory", "Rhythm fundamentals", "Note reading", "Basic scales"],
      examType: "Online Assessment",
      badge: "Foundation"
    },
    {
      level: "Elementary",
      title: "Grade 1-3 Certification",
      duration: "6-12 months",
      icon: Target,
      skills: ["Intermediate theory", "Simple pieces", "Basic harmony", "Performance skills"],
      examType: "Practical + Theory",
      badge: "Elementary"
    },
    {
      level: "Intermediate",
      title: "Grade 4-6 Certification",
      duration: "12-18 months",
      icon: Star,
      skills: ["Advanced techniques", "Complex pieces", "Improvisation", "Music analysis"],
      examType: "Performance + Viva",
      badge: "Intermediate"
    },
    {
      level: "Advanced",
      title: "Grade 7-8 Certification",
      duration: "18-24 months",
      icon: Trophy,
      skills: ["Master techniques", "Concert pieces", "Teaching basics", "Composition"],
      examType: "Recital + Portfolio",
      badge: "Advanced"
    },
    {
      level: "Professional",
      title: "Diploma & Teaching",
      duration: "2+ years",
      icon: Award,
      skills: ["Professional performance", "Teaching methodology", "Music research", "Mentorship"],
      examType: "Thesis + Recital",
      badge: "Professional"
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-3xl"></div>
          <div className="relative container mx-auto px-6 py-20 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Music className="h-4 w-4 text-purple-300" />
              <span className="text-purple-100 text-sm">AI-Powered Music Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Learn Music with
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
                MuseSync
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Experience personalized music education with AI-powered feedback, live classes, 
              and practice sessions tailored for vocal and instrumental learners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl backdrop-blur-sm">
                Watch Demo
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
                Features for Everyone
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto animate-fade-in">
                Whether you're a student, teacher, or parent, MuseSync has the tools you need
              </p>
            </div>

            {/* Feature Tabs */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 animate-scale-in">
                <Button
                  variant={activeTab === "students" ? "default" : "ghost"}
                  onClick={() => setActiveTab("students")}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "students" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </Button>
                <Button
                  variant={activeTab === "teachers" ? "default" : "ghost"}
                  onClick={() => setActiveTab("teachers")}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "teachers" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Teachers
                </Button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(activeTab === "students" ? featuresForStudents : featuresForTeachers).map((feature, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in hover-scale" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-center">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
                Your Musical Journey Roadmap
              </h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto animate-fade-in">
                Follow our structured certification path from beginner to professional musician. 
                Each level builds upon the previous, ensuring comprehensive musical education.
              </p>
            </div>

            <div className="relative">
              {/* Animated Roadmap Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full hidden lg:block animate-fade-in" style={{ animationDelay: '300ms' }}></div>
              
              <div className="space-y-12">
                {roadmapSteps.map((step, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-8 transition-all duration-700 transform ${
                      visibleSteps.includes(index) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    } ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Content Card */}
                    <div className="flex-1 lg:max-w-md">
                      <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-4">
                            <Badge className={`${step.level === 'Beginner' ? 'bg-green-500' : 
                              step.level === 'Elementary' ? 'bg-blue-500' :
                              step.level === 'Intermediate' ? 'bg-yellow-500' :
                              step.level === 'Advanced' ? 'bg-orange-500' : 'bg-red-500'} text-white animate-pulse`}>
                              {step.badge}
                            </Badge>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{step.duration}</span>
                            </div>
                          </div>
                          <CardTitle className="text-white text-xl">{step.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {step.examType}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <h4 className="text-white font-medium">Key Skills:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {step.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${(index * 200) + (skillIndex * 100)}ms` }}>
                                  <Check className="h-3 w-3 text-green-400 flex-shrink-0" />
                                  <span className="text-gray-300 text-sm">{skill}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Animated Icon Circle */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white/20 transition-all duration-500 transform ${
                        visibleSteps.includes(index) ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                      }`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      {index < roadmapSteps.length - 1 && (
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-purple-400 to-pink-400 lg:hidden animate-fade-in" style={{ animationDelay: `${index * 200 + 300}ms` }}></div>
                      )}
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 lg:max-w-md hidden lg:block"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in">
                Start Your Certification Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Choose Your Learning Journey
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Start free and upgrade as you grow. All plans include our core learning features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative bg-white/10 backdrop-blur-md ${plan.color} hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-white text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="text-white">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-300">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                    <Button 
                      className={`w-full mt-8 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                          : "bg-white/20 hover:bg-white/30 border border-white/30"
                      } text-white rounded-xl py-3 transition-all duration-300`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Musical Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students and teachers already using MuseSync to achieve their musical goals.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Music className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-white">MuseSync</span>
              </div>
              <div className="flex gap-6 text-gray-300">
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Features</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
              <p>&copy; 2024 MuseSync. All rights reserved. Empowering musicians worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
