
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Music, Menu, X, User, Settings, LogOut, BookOpen, Users, History, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut, isTeacher, isStudent } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Teachers", href: "/browse-teachers", icon: Users, protected: true },
    { name: "Browse Classrooms", href: "/browse-classrooms", icon: BookOpen, protected: true },
    { name: "Swipe History", href: "/swipe-history", icon: History, protected: true },
  ];

  const teacherItems = [
    { name: "Teacher Dashboard", href: "/teacher-dashboard", icon: Settings },
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white">MusicEd</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              // Skip protected routes if user is not authenticated
              if (item.protected && !user) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-white hover:text-purple-300 transition-colors flex items-center gap-2 ${
                    location.pathname === item.href ? "text-purple-300 font-medium" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* Teacher Dashboard Link */}
            {isTeacher && (
              <Link
                to="/teacher-dashboard"
                className={`text-white hover:text-purple-300 transition-colors flex items-center gap-2 ${
                  location.pathname === "/teacher-dashboard" ? "text-purple-300 font-medium" : ""
                }`}
              >
                <Settings className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* User Menu or Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || "User"} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {getInitials(profile?.first_name, profile?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-white/20" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none text-white">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs leading-none text-gray-400">
                      {profile?.email}
                    </p>
                    <p className="text-xs leading-none text-purple-400 capitalize">
                      {profile?.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-white/10"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" className="text-white border-white/30 hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=signup">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 border-white/20 text-white">
                <div className="flex flex-col space-y-4 mt-6">
                  {/* User info if logged in */}
                  {user && profile && (
                    <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url || undefined} alt={profile.first_name || "User"} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {getInitials(profile.first_name, profile.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{profile.first_name} {profile.last_name}</p>
                        <p className="text-xs text-gray-400 capitalize">{profile.role}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  {navigationItems.map((item) => {
                    if (item.protected && !user) return null;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-3 text-white hover:text-purple-300 p-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Teacher Dashboard */}
                  {isTeacher && (
                    <Link
                      to="/teacher-dashboard"
                      className="flex items-center space-x-3 text-white hover:text-purple-300 p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Auth buttons or Sign out */}
                  {user ? (
                    <div className="pt-4 border-t border-white/20">
                      <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-white/20 space-y-2">
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full text-white border-white/30 hover:bg-white/10">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth?tab=signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
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
