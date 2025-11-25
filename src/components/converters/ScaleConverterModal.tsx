import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScaleConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const scales = [
  { label: "1:1 (Full Scale)", value: 1 },
  { label: "1:5", value: 5 },
  { label: "1:10", value: 10 },
  { label: "1:20", value: 20 },
  { label: "1:25", value: 25 },
  { label: "1:50", value: 50 },
  { label: "1:75", value: 75 },
  { label: "1:100", value: 100 },
  { label: "1:125", value: 125 },
  { label: "1:200", value: 200 },
  { label: "1:250", value: 250 },
  { label: "1:500", value: 500 },
];

export function ScaleConverterModal({ open, onOpenChange }: ScaleConverterModalProps) {
  const [realDimension, setRealDimension] = useState<string>("");
  const [scale, setScale] = useState<number>(50);
  const [drawingDimension, setDrawingDimension] = useState<string>("");

  const handleRealDimensionChange = (value: string) => {
    setRealDimension(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setDrawingDimension((num / scale).toFixed(2));
    } else {
      setDrawingDimension("");
    }
  };

  const handleDrawingDimensionChange = (value: string) => {
    setDrawingDimension(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setRealDimension((num * scale).toFixed(2));
    } else {
      setRealDimension("");
    }
  };

  const handleScaleChange = (value: string) => {
    const newScale = parseFloat(value);
    setScale(newScale);
    if (realDimension) {
      const num = parseFloat(realDimension);
      if (!isNaN(num)) {
        setDrawingDimension((num / newScale).toFixed(2));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Scale Converter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="scale">Drawing Scale</Label>
              <Select value={scale.toString()} onValueChange={handleScaleChange}>
                <SelectTrigger id="scale">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scales.map((s) => (
                    <SelectItem key={s.value} value={s.value.toString()}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="real">Real Dimension (mm)</Label>
                <Input
                  id="real"
                  type="number"
                  placeholder="Enter real dimension"
                  value={realDimension}
                  onChange={(e) => handleRealDimensionChange(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="drawing">Drawing Dimension (mm)</Label>
                <Input
                  id="drawing"
                  type="number"
                  placeholder="Enter drawing dimension"
                  value={drawingDimension}
                  onChange={(e) => handleDrawingDimensionChange(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Common Architectural Scales:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1:1 to 1:20 - Detail drawings</li>
              <li>• 1:50 to 1:100 - Floor plans, sections</li>
              <li>• 1:200 to 1:500 - Site plans, location plans</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
