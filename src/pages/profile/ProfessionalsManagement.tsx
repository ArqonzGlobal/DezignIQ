import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Upload } from "lucide-react";

export default function ProfessionalsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Professional Profile</h1>
          <p className="text-muted-foreground">Manage your professional portfolio</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Professional Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="photo">Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full"></div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" placeholder="e.g., Interior Designer, Architect" />
              </div>
              <div>
                <Label htmlFor="skills">Skill Sets (comma separated)</Label>
                <Input id="skills" placeholder="AutoCAD, 3D Modeling, Project Management" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself" rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricingType">Pricing Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="package">Package</SelectItem>
                      <SelectItem value="project">Project Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rate">Rate</Label>
                  <Input id="rate" type="number" placeholder="0.00" />
                </div>
              </div>
              <div>
                <Label htmlFor="completed">Completed Projects</Label>
                <Input id="completed" type="number" placeholder="0" />
              </div>
              <Button className="w-full">Save Profile</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-muted rounded-full"></div>
              <div>
                <p className="font-semibold">Professional Name</p>
                <p className="text-sm text-muted-foreground">Interior Designer</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="font-medium">Residential & Commercial Design</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pricing</p>
              <p className="font-medium">₹5000 / Project</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Projects</p>
              <p className="font-medium">45 Projects</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {["AutoCAD", "3D Modeling", "SketchUp", "Project Management", "Interior Design", "Space Planning"].map(
              (skill) => (
                <span key={skill} className="px-3 py-1 bg-accent text-sm rounded-full">
                  {skill}
                </span>
              )
            )}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add More Skills
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Portfolio</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="aspect-video bg-muted rounded-lg"></div>
          <div className="aspect-video bg-muted rounded-lg"></div>
          <div className="aspect-video bg-muted rounded-lg"></div>
        </div>
      </Card>
    </div>
  );
}
