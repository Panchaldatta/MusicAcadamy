
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Music, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Browse Classrooms", href: "/browse-classrooms" },
    { name: "Browse Teachers", href: "/browse-teachers" },
    { name: "Swipe History", href: "/swipe-history" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-gray-900">MuseSync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link 
                        to={item.href}
                        className="px-3 py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium flex items-center gap-2"
                      >
                        {item.name === "Swipe History" && <Heart className="h-4 w-4" />}
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-orange-600 hover:bg-orange-700 text-white">
              Sign Up
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors font-medium flex items-center gap-2"
                    >
                      {item.name === "Swipe History" && <Heart className="h-4 w-4" />}
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <div className="space-y-2 px-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/login');
                        setIsOpen(false);
                      }}
                    >
                      Log In
                    </Button>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => {
                        navigate('/signup');
                        setIsOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
