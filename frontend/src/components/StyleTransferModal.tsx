import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComparisonViewer } from "./ComparisonViewer";
import { supabase } from "@/integrations/supabase/client";
import { updateCredits } from "@/utils/steroid";
import { toast } from "sonner";
import { Upload, Loader2, Download, X, Palette, Zap, Clock } from "lucide-react";

interface StyleTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const StyleTransferModal = ({ isOpen, onClose, onImageGenerated }: StyleTransferModalProps) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("Apply artistic watercolor style");
  const [strength, setStrength] = useState([0.7]);
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [colorPreservation, setColorPreservation] = useState([0.3]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);

  const handleSourceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSourceImage(file);
    }
  };

  const handleReferenceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!sourceImage || !referenceImage) {
      toast.error("Please upload both source and reference images");
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
      formData.append('image', sourceImage);
      formData.append('reference_image', referenceImage);
      formData.append('prompt', prompt);
      formData.append('strength', strength[0].toString());
      formData.append('preserve_structure', preserveStructure.toString());
      formData.append('color_preservation', colorPreservation[0].toString());

      const { data, error } = await supabase.functions.invoke('style-transfer', {
        body: formData,
      });

      clearInterval(timer);

      if (error) {
        console.error('Style transfer error:', error);
        toast.error("Style transfer failed. Please try again.");
        return;
      }

      if (data?.status === 'success' && data?.id) {
        // Poll for results using the check-status function
        const pollForResult = async () => {
          let attempts = 0;
          const maxAttempts = 60; // 5 minutes with 5-second intervals
          
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
                  toolName: 'Style Transfer',
                  prompt,
                });

                updateCredits();
                
                toast.success("Style transfer completed successfully!");
                return;
              } else if (statusData?.status === 'failed') {
                toast.error("Style transfer failed. Please try again.");
                return;
              }

              // Wait 5 seconds before next attempt
              await new Promise(resolve => setTimeout(resolve, 5000));
              attempts++;
            } catch (pollError) {
              console.error('Polling error:', pollError);
              break;
            }
          }
          
          toast.error("Style transfer timed out. Please try again.");
        };

        pollForResult();
      } else {
        toast.error("Failed to start style transfer process");
      }
    } catch (error) {
      clearInterval(timer);
      console.error('Style transfer error:', error);
      toast.error("An error occurred during style transfer");
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
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Style Transfer</h2>
              <p className="text-sm text-muted-foreground">
                Apply artistic styles to your images with AI precision
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
                    <Label htmlFor="source-image">Source Image *</Label>
                    <div className="mt-2">
                      <Input
                        id="source-image"
                        type="file"
                        accept="image/*"
                        onChange={handleSourceImageUpload}
                        className="cursor-pointer"
                      />
                      {sourceImage && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {sourceImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reference-image">Reference Style Image *</Label>
                    <div className="mt-2">
                      <Input
                        id="reference-image"
                        type="file"
                        accept="image/*"
                        onChange={handleReferenceImageUpload}
                        className="cursor-pointer"
                      />
                      {referenceImage && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {referenceImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prompt">Style Description</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the artistic style you want to apply..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Style Strength: {strength[0]}</Label>
                    <Slider
                      value={strength}
                      onValueChange={setStrength}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Color Preservation: {colorPreservation[0]}</Label>
                    <Slider
                      value={colorPreservation}
                      onValueChange={setColorPreservation}
                      max={1}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preserve-structure"
                      checked={preserveStructure}
                      onCheckedChange={setPreserveStructure}
                    />
                    <Label htmlFor="preserve-structure">Preserve Original Structure</Label>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-card shadow-card">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !sourceImage || !referenceImage}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Palette className="h-4 w-4" />
                      Transfer Style
                    </>
                  )}
                </Button>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div>
              <ComparisonViewer
                originalImage={sourceImage}
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