
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Users, Award, Target, Heart, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const About = () => {
  const values = [
    {
      icon: Music,
      title: "Preserving Tradition",
      description: "We're committed to preserving and sharing the rich heritage of Indian classical music with the world."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Building a vibrant community of music lovers, students, and master teachers from across India."
    },
    {
      icon: Award,
      title: "Excellence in Teaching",
      description: "Our gurus are carefully selected masters who bring decades of experience and authentic knowledge."
    },
    {
      icon: Heart,
      title: "Passion for Music",
      description: "Every lesson is infused with genuine love for the art form and dedication to student success."
    }
  ];

  const stats = [
    { number: "15,000+", label: "Expert Gurus" },
    { number: "50,000+", label: "Happy Students" },
    { number: "100+", label: "Cities Covered" },
    { number: "25+", label: "Instruments Taught" }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-orange-600">MuseSync</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                We're on a mission to connect students worldwide with India's finest classical music teachers, 
                preserving ancient traditions while embracing modern learning methods.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 text-lg">How we started our journey to preserve Indian classical music</p>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    MuseSync was born from a deep love for Indian classical music and a vision to make authentic 
                    learning accessible to everyone, everywhere. Our founders, themselves students of classical music, 
                    recognized the challenge of finding qualified gurus in today's digital age.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    We started with a simple idea: what if we could connect passionate students with master musicians 
                    who have dedicated their lives to preserving these ancient art forms? Today, we're proud to be 
                    India's largest platform for classical music education.
                  </p>
                  <Link to="/browse-classrooms">
                    <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                      Find Your Guru
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 border border-orange-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To preserve, promote, and share the timeless beauty of Indian classical music by connecting 
                    dedicated students with master teachers, ensuring these precious traditions continue to 
                    flourish for generations to come.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 text-lg">What drives us every day</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center border-orange-200 bg-white hover:bg-orange-50/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-red-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
              <p className="text-gray-600 text-lg">Meet the people behind MuseSync</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Ravi Sharma", role: "Founder & CEO", instrument: "Sitar Maestro" },
                { name: "Priya Nair", role: "Head of Education", instrument: "Classical Vocalist" },
                { name: "Amit Patel", role: "Technology Director", instrument: "Tabla Player" }
              ].map((member, index) => (
                <Card key={index} className="text-center border-orange-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-orange-600 font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.instrument}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Begin Your Musical Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students learning Indian classical music with expert gurus on MuseSync
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/browse-classrooms">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
                  Find a Guru
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/teacher-dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                  Become a Teacher
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
