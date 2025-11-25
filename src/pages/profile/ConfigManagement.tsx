import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Upload, Save } from "lucide-react";

export default function ConfigManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuration</h1>
        <p className="text-muted-foreground">Manage your public display settings</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Visibility Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose which sections are visible on your public profile
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="show-projects" className="text-base">Show Projects</Label>
              <p className="text-sm text-muted-foreground">Display your projects on public profile</p>
            </div>
            <Switch id="show-projects" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="show-properties" className="text-base">Show Properties</Label>
              <p className="text-sm text-muted-foreground">Display your property listings</p>
            </div>
            <Switch id="show-properties" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="show-professionals" className="text-base">Show Professional Profile</Label>
              <p className="text-sm text-muted-foreground">Display your professional portfolio</p>
            </div>
            <Switch id="show-professionals" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="show-products" className="text-base">Show Products</Label>
              <p className="text-sm text-muted-foreground">Display your product catalog</p>
            </div>
            <Switch id="show-products" defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Branding</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo">Brand Logo</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-xs text-muted-foreground">Logo</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Logo
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Recommended size: 200x200px, Max 2MB
            </p>
          </div>
          <div>
            <Label htmlFor="theme-color">Theme Color</Label>
            <div className="flex gap-4 mt-2">
              <Input id="theme-color" type="color" defaultValue="#1a7f7f" className="w-24 h-10" />
              <Input defaultValue="#1a7f7f" placeholder="#1a7f7f" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This color will be used for buttons and highlights on your public profile
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="email-enquiries" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email for new enquiries</p>
            </div>
            <Switch id="email-enquiries" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive SMS for urgent updates</p>
            </div>
            <Switch id="sms-notifications" />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
