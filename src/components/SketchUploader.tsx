import { useState, useRef } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SketchUploaderProps {
  onImageUpload: (file: File) => void;
  uploadedImage: File | null;
  onRemoveImage: () => void;
}

export const SketchUploader = ({ onImageUpload, uploadedImage, onRemoveImage }: SketchUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  if (uploadedImage) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="relative group">
          <img
            src={URL.createObjectURL(uploadedImage)}
            alt="Uploaded sketch"
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium">
            {uploadedImage.name}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${dragActive ? 'border-primary bg-accent/50' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <ImageIcon className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload Your Sketch</h3>
            <p className="text-muted-foreground">
              Drag and drop your image here, or click to browse
            </p>
          </div>
          
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Choose File
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG files up to 20MB
          </p>
        </div>
      </div>
    </Card>
  );
};