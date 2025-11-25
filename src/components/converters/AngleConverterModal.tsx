import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AngleConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AngleConverterModal({ open, onOpenChange }: AngleConverterModalProps) {
  const [degrees, setDegrees] = useState<string>("");
  const [radians, setRadians] = useState<string>("");
  const [slopePercent, setSlopePercent] = useState<string>("");

  const handleDegreesChange = (value: string) => {
    setDegrees(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setRadians((num * Math.PI / 180).toFixed(6));
      setSlopePercent((Math.tan(num * Math.PI / 180) * 100).toFixed(4));
    } else {
      setRadians("");
      setSlopePercent("");
    }
  };

  const handleRadiansChange = (value: string) => {
    setRadians(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setDegrees((num * 180 / Math.PI).toFixed(4));
      setSlopePercent((Math.tan(num) * 100).toFixed(4));
    } else {
      setDegrees("");
      setSlopePercent("");
    }
  };

  const handleSlopePercentChange = (value: string) => {
    setSlopePercent(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      const angleRad = Math.atan(num / 100);
      setRadians(angleRad.toFixed(6));
      setDegrees((angleRad * 180 / Math.PI).toFixed(4));
    } else {
      setDegrees("");
      setRadians("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Angle Converter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="degrees">Degrees (°)</Label>
              <Input
                id="degrees"
                type="number"
                placeholder="Enter degrees"
                value={degrees}
                onChange={(e) => handleDegreesChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="radians">Radians</Label>
              <Input
                id="radians"
                type="number"
                placeholder="Enter radians"
                value={radians}
                onChange={(e) => handleRadiansChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="slope">Slope (%)</Label>
              <Input
                id="slope"
                type="number"
                placeholder="Enter slope %"
                value={slopePercent}
                onChange={(e) => handleSlopePercentChange(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Conversion Formulas:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Radians = Degrees × π / 180</li>
              <li>• Degrees = Radians × 180 / π</li>
              <li>• Slope % = tan(angle) × 100</li>
            </ul>
            <h3 className="font-semibold mt-4">Common Applications:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Roof pitch calculations</li>
              <li>• Ramp slope verification</li>
              <li>• Trigonometric calculations in structural design</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
