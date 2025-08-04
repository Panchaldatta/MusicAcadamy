
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Story", path: "/about" },
      { name: "Careers", path: "/contact" },
      { name: "Press", path: "/contact" }
    ],
    learning: [
      { name: "Browse Teachers", path: "/browse-classrooms" },
      { name: "Course Catalog", path: "/courses" },
      { name: "Practice Room", path: "/practice" },
      { name: "Teaching Resources", path: "/teacher-dashboard" }
    ],
    support: [
      { name: "Help Center", path: "/contact" },
      { name: "Contact Us", path: "/contact" },
      { name: "Community", path: "/contact" },
      { name: "Safety", path: "/contact" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Music className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Soundsync
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connect with master gurus and learn authentic Indian classical music. Your journey to musical excellence starts here.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-orange-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-orange-400" />
                <span>support@Soundsync.studio</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span>Pune, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Learning</h3>
            <ul className="space-y-3">
              {footerLinks.learning.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white">Stay Connected</h3>
              <p className="text-gray-300">
                Get the latest updates on new teachers, courses, and musical insights delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3">
              <Input 
                placeholder="Enter your email" 
                className="bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-orange-400"
              />
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Follow us:</span>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 rounded-lg flex items-center justify-center transition-all duration-200 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>for music lovers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-800 border-t border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              © {currentYear} Soundsync. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/contact" className="hover:text-orange-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="hover:text-orange-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
