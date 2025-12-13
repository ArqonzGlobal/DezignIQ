import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";

interface ComparisonViewerProps {
  originalImage: File | null;
  renderedImageUrl: string | null;
  isLoading?: boolean;
}

export const ComparisonViewer = ({ originalImage, renderedImageUrl, isLoading }: ComparisonViewerProps) => {
  const [sliderPosition, setSliderPosition] = useState([50]);

  const handleDownload = async () => {
    if (renderedImageUrl) {
      try {
        // Fetch the image to handle CORS properly
        const response = await fetch(renderedImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rendered-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        window.URL.revokeObjectURL(url);
        toast.success("Image downloaded successfully!");
      } catch (error) {
        console.error('Download failed:', error);
        toast.error("Failed to download image. Please try again.");
      }
    }
  };

  if (!originalImage && !renderedImageUrl && !isLoading) {
    return (
      <Card className="p-8 bg-gradient-card shadow-card">
        <div className="text-center text-muted-foreground">
          <div className="p-4 rounded-full bg-muted inline-block mb-4">
            <Maximize2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Results will appear here</h3>
          <p>Upload a sketch and generate to see the comparison</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generating Your Render...</h3>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
          <p className="text-sm text-muted-foreground text-center">
            This may take a few moments to complete
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Before vs After</h3>
          {renderedImageUrl && (
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        <div className="relative aspect-video rounded-lg overflow-hidden">
          {/* Original Image */}
          {originalImage && (
            <div className="absolute inset-0">
              <img
                src={URL.createObjectURL(originalImage)}
                alt="Original sketch"
                className="w-full h-full object-cover transition-all duration-200"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Original
              </div>
            </div>
          )}

          {/* Rendered Image */}
          {renderedImageUrl && (
            <div 
              className="absolute inset-0 overflow-hidden transition-all duration-200 ease-out"
              style={{ clipPath: `inset(0 ${100 - sliderPosition[0]}% 0 0)` }}
            >
              <img
                src={renderedImageUrl}
                alt="Rendered result"
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.error('Failed to load rendered image:', renderedImageUrl);
                  // Try to reload without CORS if first attempt fails
                  const target = e.target as HTMLImageElement;
                  if (target.crossOrigin) {
                    target.crossOrigin = '';
                    target.src = renderedImageUrl;
                  }
                }}
                onLoad={() => {
                  console.log('Rendered image loaded successfully:', renderedImageUrl);
                }}
              />
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Rendered
              </div>
            </div>
          )}

          {/* Slider Line */}
          {originalImage && renderedImageUrl && (
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 transition-all duration-200 ease-out"
              style={{ left: `${sliderPosition[0]}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-primary flex items-center justify-center transition-transform hover:scale-110 duration-200">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Smooth Slider Control */}
        {originalImage && renderedImageUrl && (
          <div className="space-y-2">
            <Slider
              value={sliderPosition}
              onValueChange={setSliderPosition}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Drag slider to compare</span>
              <span>{Math.round(sliderPosition[0])}% rendered visible</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};