import { Download, Trash2, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { HistoryItem } from "@/hooks/useImageHistory";
import { toast } from "@/hooks/use-toast";

interface ImageHistoryProps {
  history: HistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const ImageHistory = ({ history, onRemove, onClear }: ImageHistoryProps) => {
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);

  const handleDownload = async (item: HistoryItem) => {
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.toolName}-${new Date(item.timestamp).toISOString()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Download started",
        description: "Your image is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image.",
        variant: "destructive",
      });
    }
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <>
      <div className="w-full border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Generation History</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="relative flex-shrink-0 w-48 h-48 group cursor-pointer overflow-hidden transition-transform hover:scale-105"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.toolName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{item.toolName}</p>
                      <p className="text-white/70 text-xs">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedImage.toolName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedImage.timestamp).toLocaleString()}
                  </p>
                  {selectedImage.prompt && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Prompt: {selectedImage.prompt}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleDownload(selectedImage)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.toolName}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
