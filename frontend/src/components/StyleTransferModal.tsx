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
import { apiRequest } from "@/utils/steroid";
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
  setRenderedImageUrl(null);

  const startTime = Date.now();
  const timer = setInterval(() => {
    setProcessingTime((Date.now() - startTime) / 1000);
  }, 100);

  try {
    // ✅ Build MNML payload
    const payload = {
      prompt,
      strength: strength[0],
      preserve_structure: preserveStructure,
      color_preservation: colorPreservation[0],
    };

    // ✅ Build dynamic form data
    const formData = new FormData();
    formData.append("tool", "style-transfer");
    formData.append("image", sourceImage);              // required
    formData.append("reference_image", referenceImage); // required
    formData.append(
      "payload",
      JSON.stringify({
        prompt,
        strength: strength[0],
        preserve_structure: preserveStructure,
        color_preservation: colorPreservation[0],
      })
    );


    console.log("Calling MNML dynamic API → Style Transfer");

    const res = await apiRequest("/mnml/run", "POST", formData, true);

    if (!res.success) {
      throw res.error || "Failed to start style transfer";
    }

    const jobId = res.data.job_id;

    toast.success("Style transfer started");

    const POLL_INTERVAL = 4000;
    const MAX_DURATION = 60 * 2000;
    const startPollingTime = Date.now();


    // 🔹 Polling function
    const pollStatus = async () => {
      try {
        const elapsedTime = Date.now() - startPollingTime;

        if (elapsedTime >= MAX_DURATION) {
          setIsLoading(false);

          toast.success("Generation time out. Please try again later!");

          return;
        }
        const res = await apiRequest(`/get-result/${jobId}`, "GET");

        console.log("status:", res);

        if (res.data.status === "success" && res.data.message && res.data.message.length > 0) {
          clearInterval(timer);
          const endTime = Date.now();
          setProcessingTime((endTime - startTime) / 1000);
          setRenderedImageUrl(res.data.message[0]);
          setIsLoading(false);

          toast.success("Generated succesfully!");
          return;

          
        } else {
          setTimeout(pollStatus, POLL_INTERVAL);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        clearInterval(timer);
        toast.success("Generation failed. Please try again later!");
      }
    };

    setTimeout(pollStatus, 3000);

  } catch (error) {
    clearInterval(timer);
    setIsLoading(false);
    console.error("Style transfer error:", error);
    toast.error(
      error instanceof Error
        ? error.message
        : "An error occurred during style transfer"
    );
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