import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComparisonViewer } from "./ComparisonViewer";
import { supabase } from "@/integrations/supabase/client";
import { updateCredits } from "@/utils/steroid";
import { toast } from "sonner";
import { Upload, Loader2, Download, X, Eraser, Zap, Clock } from "lucide-react";

// Fixed: Removed Dialog dependencies to use custom modal structure

interface AIEraserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const AIEraserModal = ({ isOpen, onClose, onImageGenerated }: AIEraserModalProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [mask, setMask] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleMaskUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMask(file);
    }
  };

  const handleSubmit = async () => {
    if (!image || !mask) {
      toast.error("Please upload both image and mask");
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
      formData.append('mask', mask);
      formData.append('output_format', outputFormat);

      const { data, error } = await supabase.functions.invoke('ai-eraser', {
        body: formData,
      });

      clearInterval(timer);

      if (error) {
        console.error('AI eraser error:', error);
        toast.error("AI eraser failed. Please try again.");
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
                  toolName: 'AI Eraser',
                });

                updateCredits();
                
                toast.success("AI eraser completed successfully!");
                return;
              } else if (statusData?.status === 'failed') {
                toast.error("AI eraser failed. Please try again.");
                return;
              }

              await new Promise(resolve => setTimeout(resolve, 5000));
              attempts++;
            } catch (pollError) {
              console.error('Polling error:', pollError);
              break;
            }
          }
          
          toast.error("AI eraser timed out. Please try again.");
        };

        pollForResult();
      } else {
        toast.error("Failed to start AI eraser process");
      }
    } catch (error) {
      clearInterval(timer);
      console.error('AI eraser error:', error);
      toast.error("An error occurred during AI eraser");
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
              <Eraser className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Eraser</h2>
              <p className="text-sm text-muted-foreground">
                Remove unwanted objects from your images with AI precision
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
              15 Credits
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
                    <Label htmlFor="image">Source Image *</Label>
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
                    <Label htmlFor="mask">Mask Image *</Label>
                    <div className="mt-2">
                      <Input
                        id="mask"
                        type="file"
                        accept="image/*"
                        onChange={handleMaskUpload}
                        className="cursor-pointer"
                      />
                      {mask && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {mask.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Output Format</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card shadow-card">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !image || !mask}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Erasing...
                    </>
                  ) : (
                    <>
                      <Eraser className="h-4 w-4" />
                      Remove Objects
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