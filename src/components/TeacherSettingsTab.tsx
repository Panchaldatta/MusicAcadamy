
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Bell, CreditCard, Shield, Save, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const TeacherSettingsTab = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  // Local state for form data
  const [profileData, setProfileData] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || ""
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailMarketing: false,
    pushNotifications: true
  });

  const handleProfileUpdate = () => {
    // This would typically make an API call to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully!",
    });
  };

  const handleNotificationUpdate = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved!",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password Reset Email Sent",
      description: "Check your email for instructions to reset your password.",
    });
  };

  const handleEnableTwoFactor = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "Two-factor authentication setup will be available soon!",
    });
  };

  const handleUploadPhoto = () => {
    toast({
      title: "Upload Photo",
      description: "Photo upload functionality will be available soon!",
    });
  };

  const handleManagePayments = () => {
    toast({
      title: "Payment Settings",
      description: "Payment management will be available soon!",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-card/50 backdrop-blur-md border-border hover:bg-accent/30 hover:border-accent hover:shadow-xl transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="text-white flex items-center group-hover:text-purple-200 transition-colors">
              <User className="h-5 w-5 mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors">
              Update your personal information and teaching profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-muted/20 border-border hover:border-accent focus:border-primary transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-muted/20 border-border hover:border-accent focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-muted/20 border-border hover:border-accent focus:border-primary transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-muted/20 border-border hover:border-accent focus:border-primary transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-gray-300">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-muted/20 border-border min-h-[80px] hover:border-accent focus:border-primary transition-colors"
                placeholder="Tell students about yourself and your teaching style..."
              />
            </div>

            <Button 
              onClick={handleProfileUpdate}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card/50 backdrop-blur-md border-border hover:bg-accent/30 hover:border-accent hover:shadow-xl transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="text-white flex items-center group-hover:text-purple-200 transition-colors">
              <Bell className="h-5 w-5 mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
              Notification Settings
            </CardTitle>
            <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors">
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between hover:bg-accent/20 p-2 rounded-lg transition-colors">
              <div>
                <Label className="text-white">Email Notifications for Bookings</Label>
                <p className="text-sm text-gray-400">Get notified when students book your classes</p>
              </div>
              <Switch
                checked={notifications.emailBookings}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailBookings: checked }))}
              />
            </div>

            <div className="flex items-center justify-between hover:bg-accent/20 p-2 rounded-lg transition-colors">
              <div>
                <Label className="text-white">Email Notifications for Messages</Label>
                <p className="text-sm text-gray-400">Receive messages from students via email</p>
              </div>
              <Switch
                checked={notifications.emailMessages}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailMessages: checked }))}
              />
            </div>

            <div className="flex items-center justify-between hover:bg-accent/20 p-2 rounded-lg transition-colors">
              <div>
                <Label className="text-white">Marketing Emails</Label>
                <p className="text-sm text-gray-400">Updates about new features and tips</p>
              </div>
              <Switch
                checked={notifications.emailMarketing}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailMarketing: checked }))}
              />
            </div>

            <div className="flex items-center justify-between hover:bg-accent/20 p-2 rounded-lg transition-colors">
              <div>
                <Label className="text-white">Push Notifications</Label>
                <p className="text-sm text-gray-400">Real-time notifications on your device</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>

            <Button 
              onClick={handleNotificationUpdate}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        {/* <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:shadow-white/10 transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="text-white flex items-center group-hover:text-purple-200 transition-colors">
              <Shield className="h-5 w-5 mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors">
              Manage your account security and password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <Label className="text-white">Account Status</Label>
                <p className="text-sm text-gray-400">Your account is active and verified</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                Active
              </Badge>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Change Password</Label>
              <Button 
                onClick={handlePasswordChange}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 w-full hover:shadow-lg hover:shadow-white/10 transition-all duration-200"
              >
                Send Reset Email
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Two-Factor Authentication</Label>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <span className="text-gray-300 text-sm">Not enabled</span>
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/10 transition-all duration-200"
                  onClick={handleEnableTwoFactor}
                >
                  Enable 2FA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Account Settings */}
        {/* <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:shadow-white/10 transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="text-white flex items-center group-hover:text-purple-200 transition-colors">
              <CreditCard className="h-5 w-5 mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-gray-300 group-hover:text-gray-200 transition-colors">
              Manage your account preferences and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div>
                <Label className="text-white">Account Type</Label>
                <p className="text-sm text-gray-400">Teacher Account</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors">
                Premium
              </Badge>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Profile Picture</Label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <User className="h-6 w-6 text-white" />
                </div>
                <Button 
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 hover:shadow-lg hover:shadow-white/10 transition-all duration-200"
                  onClick={handleUploadPhoto}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Payment Settings</Label>
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 w-full hover:shadow-lg hover:shadow-white/10 transition-all duration-200"
                onClick={handleManagePayments}
              >
                Manage Payment Methods
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default TeacherSettingsTab;
