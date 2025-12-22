import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Wand2, Zap, Clock, X, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest, saveImageHistory, updateCredits } from "@/utils/steroid";

interface ImagineAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (item: { imageUrl: string; toolName: string; prompt?: string }) => void;
}

export const ImagineAIModal = ({ isOpen, onClose, onImageGenerated }: ImagineAIModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [renderType, setRenderType] = useState('exterior');
  const [aspectRatio, setAspectRatio] = useState('square');
  const [styleStrength, setStyleStrength] = useState([40]);
  const [seed, setSeed] = useState('');
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);

const handleSubmit = async () => {
  if (!prompt.trim()) {
    toast({
      title: "Missing prompt",
      description: "Please provide a description for the architectural design.",
      variant: "destructive",
    });
    return;
  }

  if (prompt.length > 2000) {
    toast({
      title: "Prompt too long",
      description: "Please keep your prompt under 2000 characters.",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  const startTime = Date.now();

  try {
    // Build payload for Imagine AI
    const payload: any = {
      prompt: prompt.trim(),
      render_type: renderType,
      aspect_ratio: aspectRatio,
      style_strength: styleStrength[0],
    };

    if (seed.trim()) {
      payload.seed = parseInt(seed);
    }

    // Dynamic MNML request
    const formData = new FormData();
    formData.append("tool", "imagine-ai"); // 🔑 dynamic tool
    formData.append("payload", JSON.stringify(payload));

    const res = await apiRequest("/mnml/run", "POST", formData, true);

    if (!res.success) {
      throw res.error || "Failed to submit Imagine AI job";
    }

    const jobId = res.data.job_id;

    toast({
      title: "Generation Started",
      description: "Your visualization is being generated. Please wait...",
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
          setResultImageUrl(res.data.message[0]);
          updateCredits();
          const userStr = localStorage.getItem("user");
          const user = userStr ? JSON.parse(userStr) : null;
          const savedHistory = saveImageHistory({
            userEmail: user.email,
            imageUrl: res.data.message[0],
            toolName: "Imagine AI",
            prompt: prompt.trim(),
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

    setTimeout(pollStatus, 2000);

  } catch (error) {
    setIsLoading(false);
    toast({
      title: "Generation Failed",
      description:
        error instanceof Error
          ? error.message
          : "There was an error generating your design.",
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
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Imagine AI</h2>
              <p className="text-sm text-muted-foreground">
                Generate stunning architectural visualizations from text descriptions
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
              {/* Prompt Input */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Lightbulb className="h-4 w-4" />
                    Design Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="prompt">Architectural Design Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the architectural design you want to generate... (e.g., 'Modern glass office building with minimalist design and green rooftop')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-1 min-h-[120px]"
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-muted-foreground">
                        Be specific about style, materials, and setting for best results
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {prompt.length}/2000
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generation Parameters */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Generation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="render-type">Render Type</Label>
                    <Select value={renderType} onValueChange={setRenderType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exterior">Exterior</SelectItem>
                        <SelectItem value="interior">Interior</SelectItem>
                        <SelectItem value="layout">Layout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square (1:1)</SelectItem>
                        <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                        <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="style-strength">
                      Style Strength: {styleStrength[0]}
                    </Label>
                    <Slider
                      id="style-strength"
                      min={0}
                      max={100}
                      step={5}
                      value={styleStrength}
                      onValueChange={setStyleStrength}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Subtle</span>
                      <span>Strong</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seed">Seed (Optional)</Label>
                    <Input
                      id="seed"
                      type="number"
                      placeholder="Random seed for reproducible results"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={handleSubmit} 
                disabled={!prompt.trim() || isLoading}
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
                    <Lightbulb className="h-4 w-4" />
                    Generate Design
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Generated Design</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-sm text-muted-foreground">Generating your architectural design...</p>
                      </div>
                    </div>
                  ) : resultImageUrl ? (
                    <div className="space-y-4">
                      <img
                        src={resultImageUrl}
                        alt="Generated architectural design"
                        className="w-full rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resultImageUrl, '_blank')}
                        className="w-full"
                      >
                        Download Design
                      </Button>
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground text-center">
                        Enter a design description to generate your architectural visualization
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