import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FuelConsumptionConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FuelConsumptionConverterModal({ open, onOpenChange }: FuelConsumptionConverterModalProps) {
  const [litersPer100km, setLitersPer100km] = useState<string>("");
  const [mpgUS, setMpgUS] = useState<string>("");
  const [mpgUK, setMpgUK] = useState<string>("");

  const handleLitersPer100kmChange = (value: string) => {
    setLitersPer100km(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setMpgUS((235.214583 / num).toFixed(2));
      setMpgUK((282.481053 / num).toFixed(2));
    } else {
      setMpgUS("");
      setMpgUK("");
    }
  };

  const handleMpgUSChange = (value: string) => {
    setMpgUS(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setLitersPer100km((235.214583 / num).toFixed(2));
      setMpgUK((num * 1.20095).toFixed(2));
    } else {
      setLitersPer100km("");
      setMpgUK("");
    }
  };

  const handleMpgUKChange = (value: string) => {
    setMpgUK(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setLitersPer100km((282.481053 / num).toFixed(2));
      setMpgUS((num / 1.20095).toFixed(2));
    } else {
      setLitersPer100km("");
      setMpgUS("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Fuel Consumption Converter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="liters">L/100km</Label>
              <Input
                id="liters"
                type="number"
                placeholder="Enter L/100km"
                value={litersPer100km}
                onChange={(e) => handleLitersPer100kmChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="mpgUS">MPG (US)</Label>
              <Input
                id="mpgUS"
                type="number"
                placeholder="Enter MPG (US)"
                value={mpgUS}
                onChange={(e) => handleMpgUSChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="mpgUK">MPG (UK)</Label>
              <Input
                id="mpgUK"
                type="number"
                placeholder="Enter MPG (UK)"
                value={mpgUK}
                onChange={(e) => handleMpgUKChange(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Understanding Fuel Consumption:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• L/100km: Lower is better (common in metric countries)</li>
              <li>• MPG: Higher is better (miles per gallon)</li>
              <li>• US gallon = 3.785 liters, UK gallon = 4.546 liters</li>
            </ul>
            <h3 className="font-semibold mt-4">Construction Site Applications:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Heavy equipment fuel planning</li>
              <li>• Fleet management and cost estimation</li>
              <li>• Environmental impact calculations</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
