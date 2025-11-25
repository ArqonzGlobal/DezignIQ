import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoordinateConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CoordinateSystem = "gps-lat" | "gps-lon" | "utm-northing" | "utm-easting" | "local-x" | "local-y";

const coordinateSystems: { value: CoordinateSystem; label: string }[] = [
  { value: "gps-lat", label: "GPS Latitude (°)" },
  { value: "gps-lon", label: "GPS Longitude (°)" },
  { value: "utm-northing", label: "UTM Northing (m)" },
  { value: "utm-easting", label: "UTM Easting (m)" },
  { value: "local-x", label: "Local Grid X (m)" },
  { value: "local-y", label: "Local Grid Y (m)" },
];

export const CoordinateConverterModal = ({ open, onOpenChange }: CoordinateConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromSystem, setFromSystem] = useState<CoordinateSystem>("gps-lat");
  const [toSystem, setToSystem] = useState<CoordinateSystem>("utm-northing");

  const convertCoordinate = (value: number, from: CoordinateSystem, to: CoordinateSystem): number => {
    // Simplified conversion logic - in real application, use proper coordinate transformation library
    if (from === to) return value;
    
    // GPS to UTM (approximate)
    if (from === "gps-lat" && to === "utm-northing") return value * 111000;
    if (from === "gps-lon" && to === "utm-easting") return value * 111000;
    
    // UTM to GPS (approximate)
    if (from === "utm-northing" && to === "gps-lat") return value / 111000;
    if (from === "utm-easting" && to === "gps-lon") return value / 111000;
    
    // Default 1:1 for unsupported conversions
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.0000";
    return convertCoordinate(value, fromSystem, toSystem).toFixed(4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Coordinate Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From System</Label>
              <Select value={fromSystem} onValueChange={(v) => setFromSystem(v as CoordinateSystem)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coordinateSystems.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      {system.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>

            <div className="space-y-2">
              <Label>To System</Label>
              <Select value={toSystem} onValueChange={(v) => setToSystem(v as CoordinateSystem)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {coordinateSystems.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      {system.label}
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
            <p className="font-semibold">Conversion Info:</p>
            <p>• GPS coordinates use decimal degrees</p>
            <p>• UTM uses meters in northing/easting</p>
            <p>• Local grid coordinates are project-specific</p>
            <p className="text-muted-foreground italic">Note: This is a simplified converter. For accurate conversions, use professional surveying software.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
