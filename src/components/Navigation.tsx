
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Menu, Music, Heart, User, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut, isTeacher, isStudent } = useAuth();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Browse Classrooms", href: "/browse-classrooms" },
    { name: "Browse Teachers", href: "/browse-teachers" },
    { name: "Classroom History", href: "/classroom-swipe-history" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleProfileClick = () => {
    if (isStudent) {
      navigate('/student-dashboard');
    } else if (isTeacher) {
      navigate('/teacher-dashboard');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SoundSync</span>
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
                        className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
                      >
                        {item.name === "Classroom History" && <Heart className="h-4 w-4" />}
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
            {user ? (
              <>
                {isTeacher && (
                  <Button variant="ghost" onClick={() => navigate('/teacher-dashboard')}>
                    Dashboard
                  </Button>
                )}
                {isStudent && (
                  <Button variant="ghost" onClick={() => navigate('/student-dashboard')}>
                    Dashboard
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || ""} />
                        <AvatarFallback>
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </>
            )}
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
                      className="px-4 py-2 text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
                    >
                      {item.name === "Classroom History" && <Heart className="h-4 w-4" />}
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4" />
                  <div className="space-y-2 px-4">
                    {user ? (
                      <>
                        {isTeacher && (
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                              navigate('/teacher-dashboard');
                              setIsOpen(false);
                            }}
                          >
                            Teacher Dashboard
                          </Button>
                        )}
                        {isStudent && (
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                              navigate('/student-dashboard');
                              setIsOpen(false);
                            }}
                          >
                            Student Dashboard
                          </Button>
                        )}
                        <div className="flex items-center gap-3 mb-3 p-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.first_name || ""} />
                            <AvatarFallback>
                              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {profile?.first_name} {profile?.last_name}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => {
                            handleProfileClick();
                            setIsOpen(false);
                          }}
                        >
                          <User className="mr-2 h-4 w-4" />
                          Profile & Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => {
                            navigate('/auth');
                            setIsOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => {
                            navigate('/auth');
                            setIsOpen(false);
                          }}
                        >
                          Get Started
                        </Button>
                      </>
                    )}
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
