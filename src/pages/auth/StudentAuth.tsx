import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Mail, Lock, User, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const StudentAuth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'signin';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUpStudent, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();

  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    confirmPassword: ""

  });

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/student-dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const validateSignUpData = () => {
    if (!signUpData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!signUpData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive"
      });
      return false;
    }

    if (!signUpData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (signUpData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return false;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.email.trim() || !signInData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (!error) {
        const from = location.state?.from?.pathname || "/student-dashboard";
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('❌ Unexpected error during sign in:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpData()) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUpStudent(
        signUpData.email,
        signUpData.password,
        signUpData.firstName,
        signUpData.lastName
      );
      
      if (!error) {
        setActiveTab("signin");
        setSignUpData({
          firstName: "",
          lastName: "",
          email: "",
          age: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      console.error('❌ Unexpected error during sign up:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle('student');
    } catch (err) {
      console.error('❌ Unexpected error during Google sign in:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Student Portal</h1>
              <p className="text-muted-foreground">Access your learning dashboard</p>
            </div>

            <Card className="border bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Student Access</CardTitle>
                <CardDescription>
                  Sign in to your student account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <div className="space-y-4">
                      <Button 
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {isGoogleLoading ? (
                          "Signing in with Google..."
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>

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
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing In..." : "Sign In as Student"}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <Button 
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        variant="outline"
                        className="w-full"
                      >
                        {isGoogleLoading ? (
                          "Signing up with Google..."
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Sign up with Google
                          </>
                        )}
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>

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
                          <Label htmlFor="course" className="flex items-center gap-2">
                            Age
                          </Label>
                          <Input
                            id="age"
                            value={signUpData.age}
                            onChange={(e) => setSignUpData({...signUpData, age: e.target.value})}
                            placeholder="Enter your age"
                            required
                            className="mt-1"
                          />
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
                          <Label htmlFor="confirm-password" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Confirm Password
                          </Label>
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
                          className="w-full bg-blue-600 hover:bg-blue-700" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Account..." : "Create Student Account"}
                        </Button>
                      </form>

                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Want to teach? <a href="/auth/teacher" className="text-green-600 hover:underline">Apply as Teacher</a>
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAuth;