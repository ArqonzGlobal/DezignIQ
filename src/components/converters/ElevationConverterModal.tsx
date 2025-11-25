import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ElevationConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ElevationUnit = "meters" | "feet" | "msl" | "datum";

const elevationUnits: { value: ElevationUnit; label: string }[] = [
  { value: "meters", label: "Meters (m)" },
  { value: "feet", label: "Feet (ft)" },
  { value: "msl", label: "Mean Sea Level (MSL)" },
  { value: "datum", label: "Local Datum" },
];

export const ElevationConverterModal = ({ open, onOpenChange }: ElevationConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<ElevationUnit>("meters");
  const [toUnit, setToUnit] = useState<ElevationUnit>("feet");
  const [datumOffset, setDatumOffset] = useState<string>("0");

  const convertElevation = (value: number, from: ElevationUnit, to: ElevationUnit): number => {
    if (from === to) return value;
    
    let meters = value;
    const offset = parseFloat(datumOffset) || 0;
    
    // Convert input to meters first
    if (from === "feet") {
      meters = value * 0.3048;
    } else if (from === "datum") {
      meters = value + offset;
    } else if (from === "msl") {
      meters = value;
    }
    
    // Convert meters to target unit
    if (to === "meters") return meters;
    if (to === "feet") return meters / 0.3048;
    if (to === "msl") return meters;
    if (to === "datum") return meters - offset;
    
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.00";
    return convertElevation(value, fromUnit, toUnit).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Elevation Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Datum Offset (m)</Label>
            <Input
              type="number"
              value={datumOffset}
              onChange={(e) => setDatumOffset(e.target.value)}
              placeholder="Enter datum offset in meters"
            />
            <p className="text-xs text-muted-foreground">Offset between local datum and MSL</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as ElevationUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {elevationUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter elevation"
              />
            </div>

            <div className="space-y-2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as ElevationUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {elevationUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={handleConvert()}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-semibold">Elevation Reference Info:</p>
            <p>• MSL (Mean Sea Level) is the global reference</p>
            <p>• Local Datum varies by project/region</p>
            <p>• Always verify datum used in project documents</p>
            <p>• 1 meter = 3.28084 feet</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
