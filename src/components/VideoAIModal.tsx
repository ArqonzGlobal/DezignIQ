import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SketchUploader } from "./SketchUploader";
import { Video, Zap, Clock, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { updateCredits } from "@/utils/steroid";

interface VideoAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoAIModal = ({ isOpen, onClose }: VideoAIModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(5);
  const [cfgScale, setCfgScale] = useState<number>(0.5);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [movementType, setMovementType] = useState('horizontal');
  const [direction, setDirection] = useState('left');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload a reference image first.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "No prompt provided",
        description: "Please enter a description for your video.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      formData.append('prompt', prompt);
      formData.append('duration', duration.toString());
      formData.append('cfg_scale', cfgScale.toString());
      formData.append('aspect_ratio', aspectRatio);
      formData.append('movement_type', movementType);
      formData.append('direction', direction);
      if (negativePrompt.trim()) {
        formData.append('negative_prompt', negativePrompt);
      }

      console.log('Calling video-ai edge function...');
      const { data: submitData, error: submitError } = await supabase.functions.invoke('video-ai', {
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
      setVideoId(id);

      toast({
        title: "Processing Started",
        description: "Your video is being generated. This may take a few minutes...",
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
          setVideoUrl(statusData.message[0]);
          setIsLoading(false);
          updateCredits(); 
          
          toast({
            title: "Video Generation Complete!",
            description: `Generated in ${Math.round((endTime - startTime) / 1000)}s`,
          });
        } else if (statusData.status === 'failed') {
          throw new Error('Video generation failed');
        } else {
          setTimeout(pollStatus, 3000);
        }
      };

      setTimeout(pollStatus, 3000);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setVideoUrl(null);
    setVideoId(null);
    setProcessingTime(null);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setVideoUrl(null);
    setVideoId(null);
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
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Video AI</h2>
              <p className="text-sm text-muted-foreground">
                Transform images into dynamic video animations
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
              <SketchUploader
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                onRemoveImage={handleRemoveImage}
              />
              
              <Card className="p-6 bg-gradient-card shadow-card">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Video Description *</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the video content and style you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="negativePrompt">Negative Prompt (Optional)</Label>
                    <Textarea
                      id="negativePrompt"
                      placeholder="Elements to exclude from the video..."
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="mt-2 min-h-[60px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Aspect Ratio</Label>
                      <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16:9">16:9</SelectItem>
                          <SelectItem value="4:3">4:3</SelectItem>
                          <SelectItem value="1:1">1:1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>CFG Scale: {cfgScale}</Label>
                    <Slider
                      value={[cfgScale]}
                      onValueChange={(v) => setCfgScale(v[0])}
                      min={0}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher values = more adherence to prompt
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Movement Type</Label>
                      <Select value={movementType} onValueChange={setMovementType}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                          <SelectItem value="vertical">Vertical</SelectItem>
                          <SelectItem value="zoom_in">Zoom In</SelectItem>
                          <SelectItem value="zoom_out">Zoom Out</SelectItem>
                          <SelectItem value="pan">Pan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Direction</Label>
                      <Select value={direction} onValueChange={setDirection}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="up">Up</SelectItem>
                          <SelectItem value="down">Down</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!uploadedImage || !prompt.trim() || isLoading}
                    variant="hero"
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Video Preview */}
            <div>
              <Card className="p-6 bg-gradient-card shadow-card h-full">
                <h3 className="font-semibold mb-4">Video Preview</h3>
                
                {videoUrl ? (
                  <div className="space-y-4">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full rounded-lg"
                      autoPlay
                      loop
                    />
                    <Button
                      onClick={() => window.open(videoUrl, '_blank')}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Download Video
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-center">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                          Generating video...
                        </>
                      ) : (
                        "Your generated video will appear here"
                      )}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* API Integration Status */}
          <Card className="mt-8 p-6 border-success/20 bg-success/5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-success/20">
                <Zap className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Video AI Integration Active</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connected to mnml Video AI API through secure Supabase Edge Functions. 
                  Upload an image and describe your desired video animation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};