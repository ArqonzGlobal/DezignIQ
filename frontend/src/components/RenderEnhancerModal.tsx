import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComparisonViewer } from "./ComparisonViewer";
import { supabase } from "@/integrations/supabase/client";
import { updateCredits } from "@/utils/steroid";
import { toast } from "sonner";
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
      toast.error("Please upload an image and provide enhancement description");
      return;
    }

    setIsLoading(true);
    setProcessingTime(0);
    setRenderedImageUrl(null);
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      setProcessingTime((Date.now() - startTime) / 1000);
    }, 100);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt);
      formData.append('geometry', geometry[0].toString());
      formData.append('creativity', creativity[0].toString());
      formData.append('dynamic', dynamic[0].toString());
      formData.append('sharpen', sharpen[0].toString());
      if (seed) formData.append('seed', seed);

      const { data, error } = await supabase.functions.invoke('render-enhancer', {
        body: formData,
      });

      clearInterval(timer);

      if (error) {
        console.error('Render enhancer error:', error);
        toast.error("Render enhancement failed. Please try again.");
        return;
      }

      if (data?.status === 'success' && data?.id) {
        // Poll for results using the check-status function
        const pollForResult = async () => {
          let attempts = 0;
          const maxAttempts = 60;
          
          while (attempts < maxAttempts) {
            try {
              const { data: statusData, error: statusError } = await supabase.functions.invoke('check-status', {
                body: { id: data.id },
              });

              if (statusError) {
                console.error('Status check error:', statusError);
                break;
              }

              if (statusData?.status === 'success' && statusData?.message && statusData?.message.length > 0) {
                const endTime = Date.now();
                setProcessingTime((endTime - startTime) / 1000);
                const imageUrl = statusData.message[0];
                setRenderedImageUrl(imageUrl);
                setIsLoading(false);
                
                onImageGenerated?.({
                  imageUrl,
                  toolName: 'Render Enhancer',
                  prompt,
                });
                
                updateCredits();

                toast.success("Render enhancement completed successfully!");
                return;
              } else if (statusData?.status === 'failed') {
                toast.error("Render enhancement failed. Please try again.");
                return;
              }

              await new Promise(resolve => setTimeout(resolve, 5000));
              attempts++;
            } catch (pollError) {
              console.error('Polling error:', pollError);
              break;
            }
          }
          
          toast.error("Render enhancement timed out. Please try again.");
        };

        pollForResult();
      } else {
        toast.error("Failed to start render enhancement process");
      }
    } catch (error) {
      clearInterval(timer);
      console.error('Render enhancer error:', error);
      toast.error("An error occurred during render enhancement");
    } finally {
      setIsLoading(false);
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
              20 Credits
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