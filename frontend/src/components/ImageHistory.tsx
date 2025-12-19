import { Download, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

import {
  fetchImageHistory,
  deleteImageHistory,
} from "@/utils/steroid";

interface HistoryItem {
  id: string;
  toolName: string;
  prompt?: string;
  image: string;
  createdAt: string;
}

export const ImageHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch from DB
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const data = await fetchImageHistory();
      setHistory(data);
      setLoading(false);
    };

    loadHistory();
  }, []);

  const handleDownload = (item: HistoryItem) => {
    try {
      const a = document.createElement("a");
      a.href = item.image;
      a.download = `${item.toolName}-${item.id}.png`;
      a.click();

      toast({
        title: "Download started",
      });
    } catch {
      toast({
        title: "Download failed",
        variant: "destructive",
      });
    }
  };

  // 🔹 Delete from DB
  const handleDelete = async (id: string) => {
    const success = await deleteImageHistory(id);

    if (success) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast({ title: "Image deleted" });
    } else {
      toast({
        title: "Delete failed",
        variant: "destructive",
      });
    }
  };

  if (loading || history.length === 0) return null;

  return (
    <>
      <div className="w-full border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h3 className="text-lg font-semibold mb-4">
            Generation History
          </h3>

          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4 min-w-max">
              {history.map((item) => (
                <Card
                  key={item.id}
                  className="relative w-48 h-48 cursor-pointer overflow-hidden group flex-shrink-0"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.image}
                    alt={item.toolName}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-black/50 text-white opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>

            {/* 🔑 THIS IS MANDATORY */}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">
                    {selectedImage.toolName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedImage.createdAt).toLocaleString()}
                  </p>
                  {selectedImage.prompt && (
                    <p className="text-sm mt-1">
                      Prompt: {selectedImage.prompt}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleDownload(selectedImage)}
                  className="gap-3 mt-4"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>

              <img
                src={selectedImage.image}
                alt={selectedImage.toolName}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
