import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, Zap, Clock, X, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { updateCredits } from "@/utils/steroid";

interface InpaintingAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const InpaintingAIModal = ({ isOpen, onClose, onImageGenerated }: InpaintingAIModalProps) => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [maskImage, setMaskImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [seed, setSeed] = useState('');
  const [maskType, setMaskType] = useState('manual');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  const handleSourceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSourceImage(file);
      setResultImageUrl(null);
    }
  };

  const handleMaskImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMaskImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!sourceImage || !maskImage) {
      toast({
        title: "Missing images",
        description: "Please upload both source image and mask image.",
        variant: "destructive",
      });
      return;
    }

    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not properly configured. Please check your project settings.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', sourceImage);
      formData.append('mask', maskImage);
      if (prompt) formData.append('prompt', prompt);
      if (negativePrompt) formData.append('negative_prompt', negativePrompt);
      if (seed) formData.append('seed', seed);
      formData.append('mask_type', maskType);

      // Call the inpainting-ai Edge Function
      console.log('Calling inpainting-ai edge function...');
      const { data: submitData, error: submitError } = await supabase.functions.invoke('inpainting-ai', {
        body: formData,
      });

      console.log('Edge function response:', { data: submitData, error: submitError });

      if (submitError) {
        console.error('Submit error details:', submitError);
        throw new Error(`Failed to send a request to the Edge Function: ${submitError.message || 'Unknown error'}`);
      }

      if (submitData.error) {
        throw new Error(submitData.error);
      }

      const { id } = submitData;

      toast({
        title: "Processing Started",
        description: "Your image is being processed. Please wait...",
      });

      // Poll for status
      const pollStatus = async () => {
        const { data: statusData, error: statusError } = await supabase.functions.invoke('check-status', {
          body: { id },
        });

        if (statusError) {
          throw new Error(statusError.message);
        }

        if (statusData.error) {
          throw new Error(statusData.error);
        }

        if (statusData.status === 'success' && statusData.message && statusData.message.length > 0) {
          const endTime = Date.now();
          setProcessingTime((endTime - startTime) / 1000);
          const imageUrl = statusData.message[0];
          setResultImageUrl(imageUrl);
          setIsLoading(false);
          
          onImageGenerated?.({
            imageUrl,
            toolName: 'Inpainting AI',
            prompt,
          });

          updateCredits(); 
          
          toast({
            title: "Processing Complete!",
            description: `Generated in ${Math.round((endTime - startTime) / 1000)}s`,
          });
        } else if (statusData.status === 'failed') {
          throw new Error('Processing failed');
        } else {
          // Still processing, poll again
          setTimeout(pollStatus, 2000);
        }
      };

      // Start polling
      setTimeout(pollStatus, 2000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error processing your image. Please try again.",
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
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Inpainting AI</h2>
              <p className="text-sm text-muted-foreground">
                Edit specific areas of your images with AI-powered inpainting
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {processingTime && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Last: {processingTime.toFixed(1)}s
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              12 Credits
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
              {/* Image Upload */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Upload className="h-4 w-4" />
                    Upload Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="source-image">Source Image</Label>
                    <Input
                      id="source-image"
                      type="file"
                      accept="image/*"
                      onChange={handleSourceImageUpload}
                      className="mt-1"
                    />
                    {sourceImage && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {sourceImage.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="mask-image">Mask Image</Label>
                    <Input
                      id="mask-image"
                      type="file"
                      accept="image/*"
                      onChange={handleMaskImageUpload}
                      className="mt-1"
                    />
                    {maskImage && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {maskImage.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Use black background with white areas to mark what should be inpainted
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Parameters */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Inpainting Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Prompt (Optional)</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe what you want to add or change in the selected area..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                    <Textarea
                      id="negative-prompt"
                      placeholder="What to avoid in the generated result..."
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seed">Seed (Optional)</Label>
                      <Input
                        id="seed"
                        type="number"
                        placeholder="Random seed"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mask-type">Mask Type</Label>
                      <Select value={maskType} onValueChange={setMaskType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="automatic">Automatic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleSubmit} 
                disabled={!sourceImage || !maskImage || isLoading}
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
                    <Wand2 className="h-4 w-4" />
                    Start Inpainting
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Result Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Processing your image...</p>
                      </div>
                    </div>
                  ) : resultImageUrl ? (
                    <div className="space-y-4">
                      <img
                        src={resultImageUrl}
                        alt="Inpainted result"
                        className="w-full rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resultImageUrl, '_blank')}
                        className="w-full"
                      >
                        Download Result
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        Upload source and mask images to start inpainting
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};