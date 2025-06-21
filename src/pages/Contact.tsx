
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, HelpCircle } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: "General Inquiry",
      description: "Ask us anything about MuseSync",
      action: () => setFormData(prev => ({ ...prev, subject: "General Inquiry" }))
    },
    {
      icon: HelpCircle,
      title: "Technical Support",
      description: "Need help with the platform?",
      action: () => setFormData(prev => ({ ...prev, subject: "Technical Support" }))
    },
    {
      icon: Phone,
      title: "Partnership",
      description: "Interested in collaborating?",
      action: () => setFormData(prev => ({ ...prev, subject: "Partnership Opportunity" }))
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
      <div className="container mx-auto px-6 py-16">
        {/* Simplified Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Talk
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Music</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            We're here to help you make the most of your musical journey. Drop us a line!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Contact Form - Simplified */}
            <div className="lg:col-span-2">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Send className="h-5 w-5 text-purple-400" />
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Fill out the form below and we'll respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={action.action}
                        className="h-auto p-3 border-white/20 text-white hover:bg-white/10 flex flex-col items-center gap-1"
                      >
                        <action.icon className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-medium">{action.title}</span>
                      </Button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={4}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Simplified */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Email</p>
                      <p className="text-white text-sm">support@musesync.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Response Time</p>
                      <p className="text-white text-sm">Within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-200 text-sm">Location</p>
                      <p className="text-white text-sm">San Francisco, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Help */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">New to MuseSync?</h4>
                    <p className="text-gray-300 text-sm">Check out our getting started guide</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Technical Issues?</h4>
                    <p className="text-gray-300 text-sm">Try refreshing or clearing cache</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Account Problems?</h4>
                    <p className="text-gray-300 text-sm">We offer 24/7 account support</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
