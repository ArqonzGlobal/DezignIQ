import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoordinateUnitConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoordinateUnitConverterModal({ open, onOpenChange }: CoordinateUnitConverterModalProps) {
  const [inches, setInches] = useState<string>("");
  const [millimeters, setMillimeters] = useState<string>("");

  const inchToMm = 25.4;

  const handleInchesChange = (value: string) => {
    setInches(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setMillimeters((num * inchToMm).toFixed(4));
    } else {
      setMillimeters("");
    }
  };

  const handleMillimetersChange = (value: string) => {
    setMillimeters(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setInches((num / inchToMm).toFixed(4));
    } else {
      setInches("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Coordinate Unit Converter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inches">Inches</Label>
              <Input
                id="inches"
                type="number"
                placeholder="Enter inches"
                value={inches}
                onChange={(e) => handleInchesChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="millimeters">Millimeters</Label>
              <Input
                id="millimeters"
                type="number"
                placeholder="Enter millimeters"
                value={millimeters}
                onChange={(e) => handleMillimetersChange(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Conversion Formula:</h3>
            <p className="text-sm text-muted-foreground">1 inch = 25.4 millimeters</p>
            <h3 className="font-semibold mt-4">Common Use Cases:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• CAD file imports/exports between imperial and metric systems</li>
              <li>• Coordinate transformations for international projects</li>
              <li>• Converting drawing units for fabrication</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
