import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SketchUploader } from "./SketchUploader";
import { Sparkles, Zap, X, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/utils/steroid";
import { updateCredits } from "@/utils/steroid";

interface PromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptGeneratorModal = ({ isOpen, onClose }: PromptGeneratorModalProps) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an architectural image first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 🔹 Build payload
      const payload: any = {};
      if (keywords.trim()) {
        payload.prompt = keywords.trim();
      }

      // 🔹 Build FormData for dynamic API
      const formData = new FormData();
      formData.append("tool", "prompt-generator");
      formData.append("image", uploadedImage);
      formData.append("payload", JSON.stringify(payload));

      const res = await apiRequest("/mnml/run", "POST", formData, true);

      if (!res.success) {
        throw res.error || "Failed to generate prompt";
      }

      // 🔹 MNML instant tool result
      const generatedPrompt = res.data.result?.message;

      if (!generatedPrompt) {
        throw new Error("No prompt returned from MNML");
      }

      setGeneratedPrompt(generatedPrompt);

      updateCredits();

      toast({
        title: "Prompt Generated!",
        description: "Your architectural prompt is ready.",
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error generating your prompt.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setGeneratedPrompt(null);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setGeneratedPrompt(null);
  };

  const handleCopyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Prompt Generator</h2>
              <p className="text-sm text-muted-foreground">
                Analyze images and generate detailed AI prompts
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
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
              
              <Card className="p-6 bg-gradient-card shadow-card">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keywords">Keywords (Optional)</Label>
                    <Textarea
                      id="keywords"
                      placeholder="Enter keywords or phrases to emphasize in the generated prompt..."
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Add specific architectural terms or styles to focus the prompt generation.
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
                        Generating Prompt...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Generated Prompt */}
            <div>
              <Card className="p-6 bg-gradient-card shadow-card h-full">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generated Prompt
                </h3>
                
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                      <p className="text-sm whitespace-pre-wrap">{generatedPrompt}</p>
                    </div>
                    <Button
                      onClick={handleCopyPrompt}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <p className="text-center">
                      {isLoading ? "Analyzing image and generating prompt..." : "Upload an image and click Generate Prompt to get started"}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};