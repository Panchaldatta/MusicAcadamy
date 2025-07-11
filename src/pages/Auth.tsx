import { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Music, Users, BookOpen, Star } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp, user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'signin';

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form State
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'student' as 'student' | 'teacher'
  });

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInData.email, signInData.password);
      if (!error) {
        // Navigation will happen automatically via auth context
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        signUpData.email,
        signUpData.password,
        {
          first_name: signUpData.firstName,
          last_name: signUpData.lastName,
          role: signUpData.role
        }
      );
      
      if (!error) {
        // Reset form on success
        setSignUpData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          role: 'student'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Content */}
        <div className="text-white space-y-8 lg:pr-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MusicEd
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-gray-300">
              Learn music from the world's best instructors
            </p>
            <p className="text-lg text-gray-400">
              Join thousands of students and teachers in our vibrant music learning community
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold">Expert Instructors</h3>
                <p className="text-gray-400">Learn from professional musicians and teachers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <h3 className="font-semibold">Structured Learning</h3>
                <p className="text-gray-400">Progressive lessons designed for all skill levels</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Star className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Proven Results</h3>
                <p className="text-gray-400">Join thousands of successful students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">
                Welcome to MusicEd
              </CardTitle>
              <CardDescription className="text-gray-300">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white/20 text-white">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white/20 text-white">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email" className="text-white">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={isPasswordVisible ? "text" : "password"}
                          value={signInData.password}
                          onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                          placeholder="Enter your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-white"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                          {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="signup-firstname" className="text-white">First Name</Label>
                        <Input
                          id="signup-firstname"
                          value={signUpData.firstName}
                          onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="signup-lastname" className="text-white">Last Name</Label>
                        <Input
                          id="signup-lastname"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-role" className="text-white">I am a</Label>
                      <Select
                        value={signUpData.role}
                        onValueChange={(value: 'student' | 'teacher') => setSignUpData({ ...signUpData, role: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-white/20">
                          <SelectItem value="student" className="text-white hover:bg-white/10">
                            Student - I want to learn music
                          </SelectItem>
                          <SelectItem value="teacher" className="text-white hover:bg-white/10">
                            Teacher - I want to teach music
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={isPasswordVisible ? "text" : "password"}
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                          placeholder="Create a password"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-white"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                          {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-confirm-password" className="text-white">Confirm Password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                          signUpData.password && signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      {signUpData.password && signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword && (
                        <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      disabled={isLoading || (signUpData.password !== signUpData.confirmPassword)}
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
  );
};

export default Auth;