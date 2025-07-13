import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user } = useAuth();

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(signInData.email, signInData.password);
    
    if (!error) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signUpData.password !== signUpData.confirmPassword) {
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.firstName,
      signUpData.lastName,
      signUpData.role
    );
    
    if (!error) {
      setActiveTab("signin");
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to MuseSync</h1>
              <p className="text-muted-foreground">Start your musical journey</p>
            </div>

            <Card className="border bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Get Started</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div>
                        <Label htmlFor="signin-email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={signInData.email}
                          onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                          placeholder="your@email.com"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="signin-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            value={signInData.password}
                            onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                            placeholder="Enter your password"
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first-name">First Name</Label>
                          <Input
                            id="first-name"
                            value={signUpData.firstName}
                            onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                            placeholder="John"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            value={signUpData.lastName}
                            onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                            placeholder="Doe"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="signup-email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                          placeholder="your@email.com"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="role">I am a</Label>
                        <Select value={signUpData.role} onValueChange={(value) => setSignUpData({...signUpData, role: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="signup-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Password
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                            placeholder="Create a password"
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                            placeholder="Confirm your password"
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading || signUpData.password !== signUpData.confirmPassword}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Auth;