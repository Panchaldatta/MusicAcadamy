import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, Eye, EyeOff, Shield, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const AdminAuth = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'signin';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUpAdmin, user } = useAuth();
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
    confirmPassword: "",
    adminCode: ""
  });

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/teacher-dashboard-admin";
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

    if (signUpData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long for admin accounts",
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

    if (!signUpData.adminCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Admin invitation code is required",
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
        const from = location.state?.from?.pathname || "/teacher-dashboard-admin";
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
      const { error } = await signUpAdmin(
        signUpData.email,
        signUpData.password,
        signUpData.firstName,
        signUpData.lastName,
        signUpData.adminCode
      );
      
      if (!error) {
        setActiveTab("signin");
        setSignUpData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          adminCode: ""
        });
      }
    } catch (err) {
      console.error('❌ Unexpected error during sign up:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
              <p className="text-muted-foreground">Administrative access only</p>
            </div>

            <Card className="border border-red-200 bg-card/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Admin Access</CardTitle>
                <CardDescription>
                  Sign in to your admin account or register with invitation code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin">
                    <div className="space-y-4">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                          <Label htmlFor="signin-email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Admin Email
                          </Label>
                          <Input
                            id="signin-email"
                            type="email"
                            value={signInData.email}
                            onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                            placeholder="admin@soundsync.com"
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
                              placeholder="Enter your admin password"
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
                          className="w-full bg-red-600 hover:bg-red-700" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing In..." : "Sign In as Admin"}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-yellow-600" />
                          <p className="text-sm text-yellow-800">
                            Admin registration requires a valid invitation code. Contact your system administrator.
                          </p>
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
                            placeholder="admin@soundsync.com"
                            required
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="admin-code" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Admin Invitation Code
                          </Label>
                          <Input
                            id="admin-code"
                            type="password"
                            value={signUpData.adminCode}
                            onChange={(e) => setSignUpData({...signUpData, adminCode: e.target.value})}
                            placeholder="Enter invitation code"
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
                              placeholder="Create a strong password"
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
                          className="w-full bg-red-600 hover:bg-red-700" 
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating Admin Account..." : "Create Admin Account"}
                        </Button>
                      </form>
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

export default AdminAuth;