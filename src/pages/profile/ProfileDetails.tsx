import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Upload, Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileDetails() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    company_name: "",
    gst_no: "",
    linkedin_url: "",
    instagram_url: "",
    youtube_url: "",
    facebook_url: "",
    twitter_url: "",
    profile_image_url: ""
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        website: profile.website || "",
        address: profile.address || "",
        company_name: profile.company_name || "",
        gst_no: profile.gst_no || "",
        linkedin_url: profile.linkedin_url || "",
        instagram_url: profile.instagram_url || "",
        youtube_url: profile.youtube_url || "",
        facebook_url: profile.facebook_url || "",
        twitter_url: profile.twitter_url || "",
        profile_image_url: profile.profile_image_url || ""
      });
    }
  }, [profile]);

  const calculateProfileCompletion = () => {
    const fields = [
      formData.full_name,
      formData.email,
      formData.phone,
      formData.website,
      formData.address,
      formData.company_name,
      formData.gst_no,
      formData.linkedin_url,
      formData.instagram_url,
      formData.youtube_url,
      formData.facebook_url,
      formData.twitter_url,
      formData.profile_image_url
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Details</h1>
        <p className="text-muted-foreground">Manage your personal and business information</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Complete your profile to get better visibility</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.profile_image_url} />
            <AvatarFallback>{formData.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <Input
              type="url"
              placeholder="Image URL"
              value={formData.profile_image_url}
              onChange={(e) => handleChange("profile_image_url", e.target.value)}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">Enter image URL</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your address"
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Company Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="Your company name"
              />
            </div>
            <div>
              <Label htmlFor="gstNo">GST Number</Label>
              <Input
                id="gstNo"
                value={formData.gst_no}
                onChange={(e) => handleChange("gst_no", e.target.value)}
                placeholder="GST Number"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => handleChange("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                value={formData.instagram_url}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input
                id="youtube"
                type="url"
                value={formData.youtube_url}
                onChange={(e) => handleChange("youtube_url", e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                value={formData.facebook_url}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
                placeholder="https://facebook.com/yourprofile"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              type="url"
              value={formData.twitter_url}
              onChange={(e) => handleChange("twitter_url", e.target.value)}
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateProfileMutation.isPending} className="gap-2">
          {updateProfileMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
