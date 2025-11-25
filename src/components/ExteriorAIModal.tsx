import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SketchUploader } from "./SketchUploader";
import { LightingSettings } from "./LightingSettings";
import { ComparisonViewer } from "./ComparisonViewer";
import { ExteriorRenderingOptions } from "./ExteriorRenderingOptions";
import { Wand2, Zap, Clock, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ExteriorAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const ExteriorAIModal = ({ isOpen, onClose, onImageGenerated }: ExteriorAIModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [lightingMode, setLightingMode] = useState<'morning' | 'night'>('morning');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  // Rendering options state
  const [imageType, setImageType] = useState('3dmass');
  const [scenario, setScenario] = useState('precise');
  const [geometryInput, setGeometryInput] = useState(75);
  const [styles, setStyles] = useState('realistic');
  const [renderSpeed, setRenderSpeed] = useState('best');

  const generatePrompt = () => {
    const basePrompt = lightingMode === 'morning' 
      ? "Render this exterior architectural design with bright natural daylight and professional presentation"
      : "Create a stunning exterior view with evening ambiance and architectural lighting";
    
    return additionalPrompt 
      ? `${basePrompt}. ${additionalPrompt}`
      : basePrompt;
  };

  const handleSubmit = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an exterior image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      formData.append('prompt', generatePrompt());
      formData.append('imageType', imageType);
      formData.append('scenario', scenario);
      formData.append('geometry_input', geometryInput.toString());
      formData.append('styles', styles);
      formData.append('renderspeed', renderSpeed);

      console.log('Calling exterior-ai edge function...');
      const { data: submitData, error: submitError } = await supabase.functions.invoke('exterior-ai', {
        body: formData,
      });

      console.log('Edge function response:', { data: submitData, error: submitError });

      if (submitError) {
        console.error('Submit error details:', submitError);
        throw new Error(`Failed to send request: ${submitError.message || 'Unknown error'}`);
      }

      if (submitData.error) {
        throw new Error(submitData.error);
      }

      const { id } = submitData;

      toast({
        title: "Processing Started",
        description: "Your exterior design is being generated. Please wait...",
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
            toolName: 'Exterior AI',
            prompt: generatePrompt(),
          });
          
          toast({
            title: "Exterior Design Complete!",
            description: `Generated in ${Math.round((endTime - startTime) / 1000)}s`,
          });
        } else if (statusData.status === 'failed') {
          throw new Error('Exterior design generation failed');
        } else {
          setTimeout(pollStatus, 2000);
        }
      };

      setTimeout(pollStatus, 2000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your exterior design. Please try again.",
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
              <h2 className="text-xl font-bold">Exterior AI</h2>
              <p className="text-sm text-muted-foreground">
                Transform exterior architectural designs with AI
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
              10 Credits
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
              
              <ExteriorRenderingOptions
                imageType={imageType}
                scenario={scenario}
                geometryInput={geometryInput}
                styles={styles}
                renderSpeed={renderSpeed}
                onImageTypeChange={setImageType}
                onScenarioChange={setScenario}
                onGeometryInputChange={(value) => setGeometryInput(value[0])}
                onStylesChange={setStyles}
                onRenderSpeedChange={setRenderSpeed}
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
                        Generate Exterior Design
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
                <h3 className="font-semibold mb-2">Exterior AI Integration Active</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connected to mnml Exterior AI API through secure Supabase Edge Functions. 
                  Upload an exterior image and customize your design preferences.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};