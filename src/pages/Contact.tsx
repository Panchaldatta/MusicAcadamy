
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";

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
    // Here you would typically send the data to your backend
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 98765 43210",
      description: "Mon-Fri 9AM-7PM IST"
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@musesync.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Mumbai, Maharashtra",
      description: "Serving students worldwide"
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: "24/7 Online Support",
      description: "Always here to help"
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about learning Indian classical music? We're here to help you start your musical journey.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center border-orange-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-orange-600 font-medium mb-1">{info.details}</p>
                  <p className="text-gray-500 text-sm">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Form */}
              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="space-y-6">
                <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">How do I get started?</h4>
                      <p className="text-gray-600 text-sm">Simply browse our teachers, book a trial lesson, and begin your musical journey!</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">What instruments do you teach?</h4>
                      <p className="text-gray-600 text-sm">We offer lessons for sitar, tabla, harmonium, flute, violin, and classical vocals.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Are lessons available online?</h4>
                      <p className="text-gray-600 text-sm">Yes! Most of our gurus offer both online and in-person lessons.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      We typically respond to all inquiries within 24 hours. For urgent matters, 
                      please call us directly at +91 98765 43210.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
