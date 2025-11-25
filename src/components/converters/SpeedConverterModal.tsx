import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SpeedConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpeedConverterModal({ open, onOpenChange }: SpeedConverterModalProps) {
  const [metersPerSecond, setMetersPerSecond] = useState<string>("");
  const [kilometersPerHour, setKilometersPerHour] = useState<string>("");
  const [feetPerSecond, setFeetPerSecond] = useState<string>("");

  const handleMetersPerSecondChange = (value: string) => {
    setMetersPerSecond(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setKilometersPerHour((num * 3.6).toFixed(4));
      setFeetPerSecond((num * 3.28084).toFixed(4));
    } else {
      setKilometersPerHour("");
      setFeetPerSecond("");
    }
  };

  const handleKilometersPerHourChange = (value: string) => {
    setKilometersPerHour(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setMetersPerSecond((num / 3.6).toFixed(4));
      setFeetPerSecond((num * 0.911344).toFixed(4));
    } else {
      setMetersPerSecond("");
      setFeetPerSecond("");
    }
  };

  const handleFeetPerSecondChange = (value: string) => {
    setFeetPerSecond(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setMetersPerSecond((num / 3.28084).toFixed(4));
      setKilometersPerHour((num * 1.09728).toFixed(4));
    } else {
      setMetersPerSecond("");
      setKilometersPerHour("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Speed Converter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ms">m/s</Label>
              <Input
                id="ms"
                type="number"
                placeholder="Enter m/s"
                value={metersPerSecond}
                onChange={(e) => handleMetersPerSecondChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="kmh">km/h</Label>
              <Input
                id="kmh"
                type="number"
                placeholder="Enter km/h"
                value={kilometersPerHour}
                onChange={(e) => handleKilometersPerHourChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fps">ft/s</Label>
              <Input
                id="fps"
                type="number"
                placeholder="Enter ft/s"
                value={feetPerSecond}
                onChange={(e) => handleFeetPerSecondChange(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Conversion Formulas:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 m/s = 3.6 km/h = 3.28084 ft/s</li>
              <li>• 1 km/h = 0.277778 m/s = 0.911344 ft/s</li>
              <li>• 1 ft/s = 0.3048 m/s = 1.09728 km/h</li>
            </ul>
            <h3 className="font-semibold mt-4">Engineering Applications:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Wind speed analysis for structural design</li>
              <li>• Fluid flow velocity calculations</li>
              <li>• Vehicle and equipment speed specifications</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
