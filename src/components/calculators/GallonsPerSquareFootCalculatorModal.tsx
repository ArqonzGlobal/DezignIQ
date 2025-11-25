import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, ArrowRightLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GallonsPerSquareFootCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CalculationMode = "area-to-gallons" | "gallons-to-area";
type AreaUnit = "sqft" | "sqm" | "sqin" | "sqyd";
type HeightUnit = "in" | "ft" | "m" | "cm";
type VolumeUnit = "usgal" | "ukgal" | "liter";

export const GallonsPerSquareFootCalculatorModal = ({ 
  isOpen, 
  onClose 
}: GallonsPerSquareFootCalculatorModalProps) => {
  const [mode, setMode] = useState<CalculationMode>("area-to-gallons");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("sqft");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("ft");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("usgal");
  
  // Inputs for Area → Gallons mode
  const [baseArea, setBaseArea] = useState("");
  const [height, setHeight] = useState("");
  
  // Inputs for Gallons → Area mode
  const [volume, setVolume] = useState("");
  const [heightForArea, setHeightForArea] = useState("");

  // Convert area to square feet
  const toSquareFeet = (value: number, unit: AreaUnit): number => {
    switch (unit) {
      case "sqft": return value;
      case "sqm": return value * 10.7639;
      case "sqin": return value / 144;
      case "sqyd": return value * 9;
      default: return value;
    }
  };

  // Convert height to feet
  const toFeet = (value: number, unit: HeightUnit): number => {
    switch (unit) {
      case "in": return value / 12;
      case "ft": return value;
      case "m": return value * 3.28084;
      case "cm": return value * 0.0328084;
      default: return value;
    }
  };

  // Convert cubic feet to volume unit
  const ft3ToVolume = (ft3: number, unit: VolumeUnit): number => {
    switch (unit) {
      case "usgal": return ft3 * 7.48052;
      case "ukgal": return ft3 * 6.22884;
      case "liter": return ft3 * 28.3168;
      default: return ft3;
    }
  };

  // Convert volume to cubic feet
  const volumeToFt3 = (vol: number, unit: VolumeUnit): number => {
    switch (unit) {
      case "usgal": return vol / 7.48052;
      case "ukgal": return vol / 6.22884;
      case "liter": return vol / 28.3168;
      default: return vol;
    }
  };

  // Calculate results based on mode
  const calculateResults = () => {
    if (mode === "area-to-gallons") {
      const areaFt2 = toSquareFeet(parseFloat(baseArea) || 0, areaUnit);
      const heightFt = toFeet(parseFloat(height) || 0, heightUnit);
      const volumeFt3 = areaFt2 * heightFt;
      const gallons = ft3ToVolume(volumeFt3, volumeUnit);
      const gallonsPerSqFt = areaFt2 > 0 ? gallons / areaFt2 : 0;
      
      return {
        volume: gallons,
        area: areaFt2,
        gallonsPerSqFt,
        heightInFt: heightFt
      };
    } else {
      const vol = parseFloat(volume) || 0;
      const heightFt = toFeet(parseFloat(heightForArea) || 0, heightUnit);
      const volumeFt3 = volumeToFt3(vol, volumeUnit);
      const areaFt2 = heightFt > 0 ? volumeFt3 / heightFt : 0;
      const gallonsPerSqFt = heightFt * 7.48052; // Direct calculation in US gallons
      
      return {
        volume: vol,
        area: areaFt2,
        gallonsPerSqFt,
        heightInFt: heightFt
      };
    }
  };

  const results = calculateResults();

  const handleReset = () => {
    setBaseArea("");
    setHeight("");
    setVolume("");
    setHeightForArea("");
    toast({ title: "Calculator reset", description: "All values have been cleared." });
  };

  const handleCopy = () => {
    const text = mode === "area-to-gallons"
      ? `Volume: ${results.volume.toFixed(2)} ${getVolumeLabel(volumeUnit)}\nGallons per sq ft: ${results.gallonsPerSqFt.toFixed(4)}`
      : `Area: ${results.area.toFixed(2)} sq ft\nGallons per sq ft: ${results.gallonsPerSqFt.toFixed(4)}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Results copied to clipboard." });
  };

  const switchMode = () => {
    setMode(mode === "area-to-gallons" ? "gallons-to-area" : "area-to-gallons");
    handleReset();
  };

  const getVolumeLabel = (unit: VolumeUnit) => {
    switch(unit) {
      case "usgal": return "US Gallons";
      case "ukgal": return "UK Gallons";
      case "liter": return "Liters";
      default: return unit;
    }
  };

  const getAreaLabel = (unit: AreaUnit) => {
    switch(unit) {
      case "sqft": return "sq ft";
      case "sqm": return "sq m";
      case "sqin": return "sq in";
      case "sqyd": return "sq yd";
      default: return unit;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Gallons per Square Foot Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Educational Content */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-blue-900 dark:text-blue-100">Understanding Gallons per Square Foot</p>
                <p className="text-blue-800 dark:text-blue-200">
                  This measurement helps calculate the volume of liquid (in gallons) spread over a given area 
                  (in square feet) at a specific depth/height.
                </p>
                <div className="text-blue-700 dark:text-blue-300 text-xs space-y-1">
                  <p><strong>Key Facts:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>1 US gallon = 0.133681 cubic feet (ft³)</li>
                    <li>1 cubic foot = 7.48052 US gallons</li>
                    <li>For 1 ft depth: 7.48052 gallons per square foot</li>
                    <li>1 UK gallon = 0.160544 ft³ (larger than US gallon)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div className="flex-1 text-center">
              <p className="font-semibold text-sm">
                {mode === "area-to-gallons" ? "Area + Height → Gallons" : "Gallons + Height → Area"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === "area-to-gallons" 
                  ? "Calculate volume from base area and height" 
                  : "Calculate base area from volume and height"}
              </p>
            </div>
            <Button onClick={switchMode} variant="outline" size="sm">
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Unit Selectors */}
          <div className="grid grid-cols-3 gap-4">
            {mode === "area-to-gallons" && (
              <div className="space-y-2">
                <Label>Area Unit</Label>
                <Select value={areaUnit} onValueChange={(v) => setAreaUnit(v as AreaUnit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Square Feet (ft²)</SelectItem>
                    <SelectItem value="sqm">Square Meters (m²)</SelectItem>
                    <SelectItem value="sqin">Square Inches (in²)</SelectItem>
                    <SelectItem value="sqyd">Square Yards (yd²)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Height/Depth Unit</Label>
              <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as HeightUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Inches (in)</SelectItem>
                  <SelectItem value="ft">Feet (ft)</SelectItem>
                  <SelectItem value="m">Meters (m)</SelectItem>
                  <SelectItem value="cm">Centimeters (cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Volume Unit</Label>
              <Select value={volumeUnit} onValueChange={(v) => setVolumeUnit(v as VolumeUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usgal">US Gallons</SelectItem>
                  <SelectItem value="ukgal">UK Gallons</SelectItem>
                  <SelectItem value="liter">Liters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Input Fields based on Mode */}
          {mode === "area-to-gallons" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Base Area ({getAreaLabel(areaUnit)})</Label>
                <Input 
                  type="number" 
                  value={baseArea} 
                  onChange={(e) => setBaseArea(e.target.value)} 
                  placeholder="Enter area"
                />
                <p className="text-xs text-muted-foreground">
                  The surface area to be covered
                </p>
              </div>
              <div className="space-y-2">
                <Label>Height/Depth ({heightUnit})</Label>
                <Input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                  placeholder="Enter height"
                />
                <p className="text-xs text-muted-foreground">
                  Depth or height of liquid
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Volume ({getVolumeLabel(volumeUnit)})</Label>
                <Input 
                  type="number" 
                  value={volume} 
                  onChange={(e) => setVolume(e.target.value)} 
                  placeholder="Enter volume"
                />
                <p className="text-xs text-muted-foreground">
                  Total volume of liquid
                </p>
              </div>
              <div className="space-y-2">
                <Label>Height/Depth ({heightUnit})</Label>
                <Input 
                  type="number" 
                  value={heightForArea} 
                  onChange={(e) => setHeightForArea(e.target.value)} 
                  placeholder="Enter height"
                />
                <p className="text-xs text-muted-foreground">
                  Depth or height of liquid
                </p>
              </div>
            </div>
          )}

          {/* Formula Display */}
          <div className="bg-secondary/10 p-3 rounded-md">
            <p className="text-xs font-mono text-muted-foreground">
              {mode === "area-to-gallons" 
                ? "Volume (gal) = Area (ft²) × Height (ft) × 7.48052"
                : "Area (ft²) = Volume (ft³) / Height (ft)"}
            </p>
          </div>

          {/* Results */}
          <div className="bg-primary/5 p-4 rounded-lg space-y-3">
            {mode === "area-to-gallons" ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Volume:</span>
                  <span className="text-2xl font-bold text-primary">
                    {results.volume.toFixed(2)} {getVolumeLabel(volumeUnit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Gallons per Square Foot:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {results.gallonsPerSqFt.toFixed(4)} gal/ft²
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This means each square foot of area contains {results.gallonsPerSqFt.toFixed(4)} gallons 
                  at {results.heightInFt.toFixed(2)} feet depth.
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Base Area:</span>
                  <span className="text-2xl font-bold text-primary">
                    {results.area.toFixed(2)} sq ft
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Gallons per Square Foot:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {results.gallonsPerSqFt.toFixed(4)} gal/ft²
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your {results.volume} {getVolumeLabel(volumeUnit)} will cover {results.area.toFixed(2)} square feet 
                  at {results.heightInFt.toFixed(2)} feet depth.
                </p>
              </>
            )}
          </div>

          {/* Conversion Quick Reference */}
          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
            <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Quick Reference:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-yellow-800 dark:text-yellow-200">
              <div>• 1" depth ≈ 0.623 gal/ft²</div>
              <div>• 6" depth ≈ 3.74 gal/ft²</div>
              <div>• 1 ft depth = 7.48 gal/ft²</div>
              <div>• 2 ft depth ≈ 14.96 gal/ft²</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleCopy} variant="secondary" className="flex-1">
              Copy Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
