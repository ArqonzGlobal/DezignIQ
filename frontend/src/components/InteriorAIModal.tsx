import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SketchUploader } from "./SketchUploader";
import { LightingSettings } from "./LightingSettings";
import { ComparisonViewer } from "./ComparisonViewer";
import { RenderingOptions } from "./RenderingOptions";
import { Wand2, Zap, Clock, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {  apiRequest, saveImageHistory, updateCredits } from "@/utils/steroid";
interface InteriorAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const InteriorAIModal = ({ isOpen, onClose, onImageGenerated }: InteriorAIModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [lightingMode, setLightingMode] = useState<'morning' | 'night'>('morning');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  
  // Rendering options state
  const [imageType, setImageType] = useState('3dmass');
  const [scenario, setScenario] = useState('creative');
  const [geometryInput, setGeometryInput] = useState(75);
  const [styles, setStyles] = useState('realistic');
  const [renderSpeed, setRenderSpeed] = useState('best');

  const generatePrompt = () => {
    const basePrompt = lightingMode === 'morning' 
      ? "Transform this interior space with bright natural lighting and contemporary design elements"
      : "Create a cozy interior atmosphere with warm evening lighting and modern furnishing";
    
    return additionalPrompt 
      ? `${basePrompt}. ${additionalPrompt}`
      : basePrompt;
  };

  const handleSubmit = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRenderedImageUrl(null);
    const startTime = Date.now();

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("prompt", generatePrompt());

      formData.append("expert_name", "interior");
      formData.append("imagetype", "photo");

      formData.append(
        "scene_mood",
        lightingMode === "morning" ? "auto_daylight" : "evening_lighting"
      );

      formData.append("camera_angle", "same_as_input");
      formData.append("render_style", "realistic");
      formData.append("render_scenario", scenario); 
      formData.append("context", JSON.stringify(["interior"]));

      // 🔹 Submit job
      const submitRes = await apiRequest("/generate-image", "POST", formData, true);

      if (!submitRes.success) {
        throw submitRes.error;
      }

      const jobId = submitRes.data.job_id;

      toast({
        title: "Processing Started",
        description: "AI generation is in progress. Please wait...",
      });

      const POLL_INTERVAL = 4000;
      const MAX_DURATION = 60 * 2000;
      const startPollingTime = Date.now();


      // 🔹 Polling function
      const pollStatus = async () => {
        try {
          const elapsedTime = Date.now() - startPollingTime;

          if (elapsedTime >= MAX_DURATION) {
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
            const endTime = Date.now();
            setProcessingTime((endTime - startTime) / 1000);
            setRenderedImageUrl(res.data.message[0]);
            updateCredits()
            const userStr = localStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            const savedHistory = saveImageHistory({
              userEmail: user.email,
              imageUrl: res.data.message[0],
              toolName: "Interior AI",
              prompt: generatePrompt(),
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
      console.error("Error:", error);
      setIsLoading(false);

      toast({
        title: "Generation Failed",
        description:"There was an error generating your image.",
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
              <h2 className="text-xl font-bold">Interior AI</h2>
              <p className="text-sm text-muted-foreground">
                Transform interior spaces with AI-powered design
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
              
              <RenderingOptions
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
                        Generate Interior Design
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
                <h3 className="font-semibold mb-2">Interior AI Integration Active</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connected to Interior AI API through secure Edge Functions. 
                  Upload an interior image and customize your design preferences.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};