import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SketchUploader } from "./SketchUploader";
import { LightingSettings } from "./LightingSettings";
import { ComparisonViewer } from "./ComparisonViewer";
import { SketchRenderingOptions } from "./SketchRenderingOptions";
import { Wand2, Zap, Clock, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { updateCredits } from "@/utils/steroid";
interface SketchToImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const SketchToImageModal = ({ isOpen, onClose, onImageGenerated }: SketchToImageModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [lightingMode, setLightingMode] = useState<'morning' | 'night'>('morning');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  // Sketch rendering options state
  const [style, setStyle] = useState('photorealistic');
  const [detailLevel, setDetailLevel] = useState('high');
  const [colorMode, setColorMode] = useState('full_color');
  const [lighting, setLighting] = useState('natural');

  const generatePrompt = () => {
    const basePrompt = lightingMode === 'morning' 
      ? "Render this architectural sketch in bright morning light with natural daylight"
      : "Render this architectural sketch in night setting with evening atmosphere and artificial lighting";
    
    return additionalPrompt 
      ? `${basePrompt}. ${additionalPrompt}`
      : basePrompt;
  };

  const handleSubmit = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload a sketch image first.",
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
      formData.append('image', uploadedImage);
      formData.append('prompt', generatePrompt());
      formData.append('style', style);
      formData.append('detail_level', detailLevel);
      formData.append('color_mode', colorMode);
      formData.append('lighting', lighting);

      // Call the sketch-to-img Edge Function
      console.log('Calling sketch-to-img edge function...');
      const { data: submitData, error: submitError } = await supabase.functions.invoke('sketch-to-img', {
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
        description: "Your sketch is being rendered. Please wait...",
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
          setRenderedImageUrl(imageUrl);
          setIsLoading(false);
          
          onImageGenerated?.({
            imageUrl,
            toolName: 'Sketch to Image',
            prompt: generatePrompt(),
          });

          updateCredits();
          
          toast({
            title: "Rendering Complete!",
            description: `Generated in ${Math.round((endTime - startTime) / 1000)}s`,
          });
        } else if (statusData.status === 'failed') {
          throw new Error('Rendering failed');
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
        description: error instanceof Error ? error.message : "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setRenderedImageUrl(null);
    setProcessingTime(null);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setRenderedImageUrl(null);
    setProcessingTime(null);
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
              <h2 className="text-xl font-bold">Sketch to Image</h2>
              <p className="text-sm text-muted-foreground">
                Transform your architectural sketches into photorealistic renders
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
              <SketchUploader
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                onRemoveImage={handleRemoveImage}
              />
              
              <LightingSettings
                lightingMode={lightingMode}
                onLightingModeChange={setLightingMode}
                additionalPrompt={additionalPrompt}
                onAdditionalPromptChange={setAdditionalPrompt}
              />
              
              <SketchRenderingOptions
                style={style}
                detailLevel={detailLevel}
                colorMode={colorMode}
                lighting={lighting}
                onStyleChange={setStyle}
                onDetailLevelChange={setDetailLevel}
                onColorModeChange={setColorMode}
                onLightingChange={setLighting}
              />
              
              <Card className="p-6 bg-gradient-card shadow-card">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Generated Prompt Preview</h3>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded border-l-4 border-primary">
                      {generatePrompt()}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!uploadedImage || isLoading}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Generate Render
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div>
              <ComparisonViewer
                originalImage={uploadedImage}
                renderedImageUrl={renderedImageUrl}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* API Integration Status */}
          <Card className="mt-8 p-6 border-success/20 bg-success/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-success/20">
                <Zap className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">API Integration Active</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your application is now connected to the mnml API through Supabase Edge Functions. 
                  Upload a sketch and select your lighting preferences to generate stunning renders.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};