
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service and Privacy Policy",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Signup attempt:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Account Created!",
        description: "Welcome to MuseSync! Please check your email to verify your account.",
      });
      
      // Navigate to login page
      navigate("/login");
      
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleSignup = async () => {
    toast({
      title: "Google Signup",
      description: "Google authentication will be implemented soon!",
    });
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 1, text: "Weak" };
    if (password.length < 8) return { strength: 2, text: "Fair" };
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: "Strong" };
    }
    return { strength: 3, text: "Good" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join MuseSync</h1>
              <p className="text-gray-600">Start your musical journey with expert gurus</p>
            </div>

            <Card className="border-orange-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Create Account</CardTitle>
                <CardDescription>
                  Sign up to access thousands of music lessons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-2" />
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                        className="h-12"
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                        className="h-12"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="h-12"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="inline h-4 w-4 mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        className="h-12 pr-12"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                                passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/4' :
                                passwordStrength.strength === 3 ? 'bg-blue-500 w-3/4' :
                                passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                              }`}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{passwordStrength.text}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        required
                        className="h-12 pr-12"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-500 focus:ring-orange-500 mt-1" 
                      required 
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{" "}
                      <button type="button" className="text-orange-600 hover:text-orange-700">Terms of Service</button>
                      {" "}and{" "}
                      <button type="button" className="text-orange-600 hover:text-orange-700">Privacy Policy</button>
                    </span>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                      Sign in here
                    </Link>
                  </p>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full h-12 border-gray-300 hover:bg-gray-50"
                      onClick={handleGoogleSignup}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
