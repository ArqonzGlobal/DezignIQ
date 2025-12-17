import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SketchUploader } from "./SketchUploader";
import { LightingSettings } from "./LightingSettings";
import { ComparisonViewer } from "./ComparisonViewer";
import { Wand2, Zap, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const ExteriorAI = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [lightingMode, setLightingMode] = useState<'morning' | 'night'>('morning');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

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

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      toast({
        title: "API Integration Required",
        description: "To use this feature, you'll need to set up backend integration with the mnml API.",
      });
      
      // Simulate processing time for demo
      setTimeout(() => {
        const endTime = Date.now();
        setProcessingTime((endTime - startTime) / 1000);
        
        // For demo purposes, we'll show a placeholder result
        setRenderedImageUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop");
        setIsLoading(false);
        
        toast({
          title: "Rendering Complete!",
          description: `Generated in ${Math.round((endTime - startTime) / 1000)}s`,
        });
      }, 3000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your image. Please try again.",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Wand2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Exterior AI</h1>
              <p className="text-muted-foreground">
                Render or redesign your exterior design in seconds. 
                Just upload a photo or sketch and see the magic in action.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Zap className="h-3 w-3" />
              1 Credits / Generation
            </Badge>
            {processingTime && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Last render: {processingTime.toFixed(1)}s
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
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

        {/* API Integration Note */}
        <Card className="mt-8 p-6 border-warning/20 bg-warning/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-warning/20">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Backend Integration Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                To connect this interface with the mnml API, you'll need to set up backend functionality. 
                We recommend using Supabase Edge Functions for secure API key handling.
              </p>
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                <strong>API Endpoint:</strong> POST https://api.mnmlai.dev/v1/sketch-to-img<br/>
                <strong>Required:</strong> Authorization header with your mnml API key
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};