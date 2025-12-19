import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComparisonViewer } from "./ComparisonViewer";
import { apiRequest, saveImageHistory } from "@/utils/steroid";
import { updateCredits } from "@/utils/steroid";
import { toast } from "sonner";
import { Upload, Loader2, Download, X, Home, Zap, Clock } from "lucide-react";

// Fixed: Removed Dialog dependencies to use custom modal structure

interface VirtualStagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const VirtualStagingModal = ({ isOpen, onClose, onImageGenerated }: VirtualStagingModalProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("Modern living room with contemporary furniture");
  const [seed, setSeed] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please provide a staging description");
      return;
    }

    setIsLoading(true);
    setRenderedImageUrl(null);
    setProcessingTime(0);

    const startTime = Date.now();
    const timer = setInterval(() => {
      setProcessingTime((Date.now() - startTime) / 1000);
    }, 100);

    try {
      const payload: any = {
        prompt: prompt.trim(),
      };

      if (seed) payload.seed = seed;

      // 🔹 Build dynamic FormData
      const formData = new FormData();
      formData.append("tool", "virtual-staging");
      formData.append("image", image);
      formData.append("payload", JSON.stringify(payload));

      console.log("Calling MNML dynamic API → Virtual Staging");

      const res = await apiRequest("/mnml/run", "POST", formData, true);

      clearInterval(timer);

      if (!res.success) {
        throw res.error || "Virtual staging failed";
      }

      const result = res.data.result;

      if (!result?.message) {
        throw new Error("MNML did not return image");
      }

      const endTime = Date.now();
      setProcessingTime((endTime - startTime) / 1000);

      setRenderedImageUrl(result.message);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const savedHistory = saveImageHistory({
        userEmail: user.email,
        imageUrl: result.message,
        toolName: "Virtual Staging",
        imageType: "base64",
        prompt,
      });
      console.log("Image history saved:", savedHistory);
      setIsLoading(false);

      onImageGenerated?.({
        imageUrl: result.message,
        toolName: "Virtual Staging",
        prompt,
      });

      // updateCredits();

      toast.success(
        `Virtual staging completed in ${Math.round(
          (endTime - startTime) / 1000
        )}s`
      );

    } catch (error) {
      clearInterval(timer);
      setIsLoading(false);
      console.error(error);
      toast.error("An error occurred during virtual staging");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Virtual Staging</h2>
              <p className="text-sm text-muted-foreground">
                Transform empty spaces into beautifully staged rooms
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {processingTime > 0 && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Last: {processingTime.toFixed(1)}s
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              1 Credits
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Controls */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image">Room Image *</Label>
                    <div className="mt-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      {image && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {image.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prompt">Staging Description *</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe how you want to stage this room..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seed">Seed (optional)</Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder="Random seed for reproducible results"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card shadow-card">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !image || !prompt.trim()}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Staging...
                    </>
                  ) : (
                    <>
                      <Home className="h-4 w-4" />
                      Stage Room
                    </>
                  )}
                </Button>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div>
              <ComparisonViewer
                originalImage={image}
                renderedImageUrl={renderedImageUrl}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};