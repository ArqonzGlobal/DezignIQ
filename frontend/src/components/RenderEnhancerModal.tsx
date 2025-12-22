import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComparisonViewer } from "./ComparisonViewer";
import { toast } from "@/hooks/use-toast"
import { apiRequest, saveImageHistory, updateCredits } from "@/utils/steroid";
import { Upload, Loader2, Download, X, Sparkles, Zap, Clock } from "lucide-react";

// Fixed: Removed Dialog dependencies to use custom modal structure

interface RenderEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const RenderEnhancerModal = ({ isOpen, onClose, onImageGenerated }: RenderEnhancerModalProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [geometry, setGeometry] = useState([1]);
  const [creativity, setCreativity] = useState([0.3]);
  const [dynamic, setDynamic] = useState([5]);
  const [seed, setSeed] = useState("");
  const [sharpen, setSharpen] = useState([0.5]);
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
    if (!image || !prompt.trim()) {
       toast({
          title: "Generation failed",
          description: "Please upload an image and provide enhancement description",
          variant: "destructive",
        });
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
      // 🔹 Build payload (JSON, not FormData)
      const payload: any = {
        prompt: prompt.trim(),
        geometry: geometry[0],
        creativity: creativity[0],
        dynamic: dynamic[0],
        sharpen: sharpen[0],
      };

      if (seed) payload.seed = seed;

      // 🔹 Build FormData for dynamic endpoint
      const formData = new FormData();
      formData.append("tool", "render-enhancer");
      formData.append("image", image);
      formData.append("payload", JSON.stringify(payload));

      const res = await apiRequest("/mnml/run", "POST", formData, true);

      if (!res.success) {
        throw res.error || "Failed to submit Render Enhancer job";
      }

      const jobId = res.data.job_id;

      toast({
        title: "Generation started",
        description: "Render enhancement started",
        variant: "default",
      });

      // 🔁 Poll for result
      const POLL_INTERVAL = 4000;
      const MAX_DURATION = 60 * 2000;
      const startPollingTime = Date.now();


      // 🔹 Polling function
      const pollStatus = async () => {
        try {
          const elapsedTime = Date.now() - startPollingTime;

          if (elapsedTime >= MAX_DURATION) {
            clearInterval(timer);
            setIsLoading(false);

            toast({
              title: "Generation Timeout",
              description: "Image generation is taking too long. Please try again.",
              variant: "destructive",
            });

            return;
          }
          const res = await apiRequest(`/get-result/${jobId}`, "GET");

          if (res.data.status === "success" && res.data.message && res.data.message.length > 0) {
            clearInterval(timer);
            const endTime = Date.now();
            setProcessingTime((endTime - startTime) / 1000);
            setRenderedImageUrl(res.data.message[0]);
            updateCredits();
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const savedHistory = saveImageHistory({
              userEmail: user.email,
              imageUrl: res.data.message[0],
              toolName: "Render Enhancer",
            });
            setIsLoading(false);

            toast({
              title: "Generation Complete!",
              description: `Image generated in ${Math.round(
                (endTime - startTime) / 1000
              )}s`,
            });
          } else {
            setTimeout(pollStatus, 4000);
          }
        } catch (error) {
          clearInterval(timer);
          console.log(error);
          setIsLoading(false);

          toast({
            title: "Generation Failed",
            description:"There was an error generating your image.",
            variant: "destructive",
          })
        }
      };

      setTimeout(pollStatus, POLL_INTERVAL);

    } catch (error) {
      clearInterval(timer);
      setIsLoading(false);
      console.error(error);
       toast({
          title: "Generation Failed",
          description: "An error occurred during render enhancement",
          variant: "destructive",
        });
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
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Render Enhancer</h2>
              <p className="text-sm text-muted-foreground">
                Enhance your renders and upscale quality up to 8K resolution
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
                    <Label htmlFor="image">Render Image *</Label>
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
                    <Label htmlFor="prompt">Enhancement Description *</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe how you want to enhance this render..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Geometry Preservation: {geometry[0]}</Label>
                    <Slider
                      value={geometry}
                      onValueChange={setGeometry}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Creativity Level: {creativity[0]}</Label>
                    <Slider
                      value={creativity}
                      onValueChange={setCreativity}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Dynamic Level: {dynamic[0]}</Label>
                    <Slider
                      value={dynamic}
                      onValueChange={setDynamic}
                      max={10}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Sharpening: {sharpen[0]}</Label>
                    <Slider
                      value={sharpen}
                      onValueChange={setSharpen}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
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
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Enhance Render
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