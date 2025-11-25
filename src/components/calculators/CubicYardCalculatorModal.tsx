import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Box, Circle, Cylinder as CylinderIcon, RotateCcw, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CubicYardCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Shape = "rectangular" | "cube" | "cylinder" | "hollow-cuboid" | "hollow-cylinder" | "hemisphere" | "cone" | "pyramid" | "other";
type VolumeUnit = "yd3" | "ft3" | "in3" | "m3" | "cm3";
type LengthUnit = "in" | "ft" | "yd" | "m" | "cm";

export const CubicYardCalculatorModal = ({ isOpen, onClose }: CubicYardCalculatorModalProps) => {
  const [shape, setShape] = useState<Shape>("rectangular");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("yd3");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("ft");
  
  // Rectangular/Cuboid inputs
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  
  // Cube input
  const [side, setSide] = useState("");
  
  // Cylinder inputs
  const [radius, setRadius] = useState("");
  const [diameter, setDiameter] = useState("");
  const [height, setHeight] = useState("");
  const [useRadius, setUseRadius] = useState(true);
  
  // Hollow cuboid inputs
  const [outerLength, setOuterLength] = useState("");
  const [outerWidth, setOuterWidth] = useState("");
  const [outerHeight, setOuterHeight] = useState("");
  const [innerLength, setInnerLength] = useState("");
  const [innerWidth, setInnerWidth] = useState("");
  const [innerHeight, setInnerHeight] = useState("");
  
  // Hollow cylinder inputs
  const [outerRadius, setOuterRadius] = useState("");
  const [innerRadius, setInnerRadius] = useState("");
  const [cylinderHeight, setCylinderHeight] = useState("");
  
  // Hemisphere inputs
  const [hemisphereRadius, setHemisphereRadius] = useState("");
  
  // Cone inputs
  const [coneRadius, setConeRadius] = useState("");
  const [coneHeight, setConeHeight] = useState("");
  
  // Pyramid inputs
  const [baseArea, setBaseArea] = useState("");
  const [pyramidHeight, setPyramidHeight] = useState("");
  
  // Other shape
  const [customVolume, setCustomVolume] = useState("");
  
  // Pricing
  const [pricePerUnit, setPricePerUnit] = useState("");

  // Convert length to feet (base unit for calculation)
  const toFeet = (value: number, unit: LengthUnit): number => {
    switch (unit) {
      case "in": return value / 12;
      case "ft": return value;
      case "yd": return value * 3;
      case "m": return value * 3.28084;
      case "cm": return value * 0.0328084;
      default: return value;
    }
  };

  // Convert cubic feet to selected volume unit
  const convertVolume = (ft3: number, toUnit: VolumeUnit): number => {
    switch (toUnit) {
      case "yd3": return ft3 / 27;
      case "ft3": return ft3;
      case "in3": return ft3 * 1728;
      case "m3": return ft3 * 0.0283168;
      case "cm3": return ft3 * 28316.8;
      default: return ft3;
    }
  };

  const calculateVolume = (): number => {
    let volumeFt3 = 0;

    switch (shape) {
      case "rectangular": {
        const l = toFeet(parseFloat(length) || 0, lengthUnit);
        const w = toFeet(parseFloat(width) || 0, lengthUnit);
        const d = toFeet(parseFloat(depth) || 0, lengthUnit);
        volumeFt3 = l * w * d;
        break;
      }
      case "cube": {
        const s = toFeet(parseFloat(side) || 0, lengthUnit);
        volumeFt3 = Math.pow(s, 3);
        break;
      }
      case "cylinder": {
        const r = useRadius 
          ? toFeet(parseFloat(radius) || 0, lengthUnit)
          : toFeet((parseFloat(diameter) || 0) / 2, lengthUnit);
        const h = toFeet(parseFloat(height) || 0, lengthUnit);
        volumeFt3 = Math.PI * Math.pow(r, 2) * h;
        break;
      }
      case "hollow-cuboid": {
        const outerVol = 
          toFeet(parseFloat(outerLength) || 0, lengthUnit) *
          toFeet(parseFloat(outerWidth) || 0, lengthUnit) *
          toFeet(parseFloat(outerHeight) || 0, lengthUnit);
        const innerVol = 
          toFeet(parseFloat(innerLength) || 0, lengthUnit) *
          toFeet(parseFloat(innerWidth) || 0, lengthUnit) *
          toFeet(parseFloat(innerHeight) || 0, lengthUnit);
        volumeFt3 = outerVol - innerVol;
        break;
      }
      case "hollow-cylinder": {
        const R = toFeet(parseFloat(outerRadius) || 0, lengthUnit);
        const r = toFeet(parseFloat(innerRadius) || 0, lengthUnit);
        const h = toFeet(parseFloat(cylinderHeight) || 0, lengthUnit);
        volumeFt3 = Math.PI * h * (Math.pow(R, 2) - Math.pow(r, 2));
        break;
      }
      case "hemisphere": {
        const r = toFeet(parseFloat(hemisphereRadius) || 0, lengthUnit);
        volumeFt3 = (2/3) * Math.PI * Math.pow(r, 3);
        break;
      }
      case "cone": {
        const r = toFeet(parseFloat(coneRadius) || 0, lengthUnit);
        const h = toFeet(parseFloat(coneHeight) || 0, lengthUnit);
        volumeFt3 = (1/3) * Math.PI * Math.pow(r, 2) * h;
        break;
      }
      case "pyramid": {
        const area = toFeet(parseFloat(baseArea) || 0, lengthUnit) * toFeet(parseFloat(baseArea) || 0, lengthUnit);
        const h = toFeet(parseFloat(pyramidHeight) || 0, lengthUnit);
        volumeFt3 = (1/3) * area * h;
        break;
      }
      case "other": {
        // If custom volume is entered, convert it to ft3 first
        const customVal = parseFloat(customVolume) || 0;
        // Assume custom volume is in the selected volume unit
        if (volumeUnit === "yd3") volumeFt3 = customVal * 27;
        else if (volumeUnit === "ft3") volumeFt3 = customVal;
        else if (volumeUnit === "in3") volumeFt3 = customVal / 1728;
        else if (volumeUnit === "m3") volumeFt3 = customVal / 0.0283168;
        else if (volumeUnit === "cm3") volumeFt3 = customVal / 28316.8;
        break;
      }
    }

    return convertVolume(volumeFt3, volumeUnit);
  };

  const volume = calculateVolume();
  const totalPrice = (parseFloat(pricePerUnit) || 0) * volume;

  const handleReset = () => {
    setLength(""); setWidth(""); setDepth("");
    setSide("");
    setRadius(""); setDiameter(""); setHeight("");
    setOuterLength(""); setOuterWidth(""); setOuterHeight("");
    setInnerLength(""); setInnerWidth(""); setInnerHeight("");
    setOuterRadius(""); setInnerRadius(""); setCylinderHeight("");
    setHemisphereRadius("");
    setConeRadius(""); setConeHeight("");
    setBaseArea(""); setPyramidHeight("");
    setCustomVolume("");
    setPricePerUnit("");
    toast({ title: "Calculator reset", description: "All values have been cleared." });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Volume: ${volume.toFixed(4)} ${volumeUnit}`);
    toast({ title: "Copied!", description: "Result copied to clipboard." });
  };

  const getUnitLabel = (unit: VolumeUnit) => {
    switch(unit) {
      case "yd3": return "yd³";
      case "ft3": return "ft³";
      case "in3": return "in³";
      case "m3": return "m³";
      case "cm3": return "cm³";
      default: return unit;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cubic Yard Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Educational Content */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-semibold text-blue-900 dark:text-blue-100">What is a Cubic Yard?</p>
                <p className="text-blue-800 dark:text-blue-200">A cubic yard is a volume measurement equal to a cube with sides of 1 yard (3 feet) each.</p>
                <p className="text-blue-700 dark:text-blue-300 text-xs">
                  <strong>Conversions:</strong> 1 yd³ = 27 ft³ = 46,656 in³ ≈ 0.765 m³
                </p>
              </div>
            </div>
          </div>

          {/* Shape Selection */}
          <div className="space-y-2">
            <Label>Select Shape</Label>
            <Tabs value={shape} onValueChange={(v) => setShape(v as Shape)} className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-2 h-auto">
                <TabsTrigger value="rectangular" className="flex flex-col items-center gap-1 py-3">
                  <Box className="h-5 w-5" />
                  <span className="text-xs">Rectangular</span>
                </TabsTrigger>
                <TabsTrigger value="cube" className="flex flex-col items-center gap-1 py-3">
                  <Box className="h-5 w-5" />
                  <span className="text-xs">Cube</span>
                </TabsTrigger>
                <TabsTrigger value="cylinder" className="flex flex-col items-center gap-1 py-3">
                  <CylinderIcon className="h-5 w-5" />
                  <span className="text-xs">Cylinder</span>
                </TabsTrigger>
                <TabsTrigger value="hollow-cuboid" className="flex flex-col items-center gap-1 py-3">
                  <Box className="h-5 w-5" />
                  <span className="text-xs">Hollow Box</span>
                </TabsTrigger>
                <TabsTrigger value="hollow-cylinder" className="flex flex-col items-center gap-1 py-3">
                  <CylinderIcon className="h-5 w-5" />
                  <span className="text-xs">Hollow Tube</span>
                </TabsTrigger>
                <TabsTrigger value="hemisphere" className="flex flex-col items-center gap-1 py-3">
                  <Circle className="h-5 w-5" />
                  <span className="text-xs">Hemisphere</span>
                </TabsTrigger>
                <TabsTrigger value="cone" className="flex flex-col items-center gap-1 py-3">
                  <Circle className="h-5 w-5" />
                  <span className="text-xs">Cone</span>
                </TabsTrigger>
                <TabsTrigger value="pyramid" className="flex flex-col items-center gap-1 py-3">
                  <Box className="h-5 w-5" />
                  <span className="text-xs">Pyramid</span>
                </TabsTrigger>
                <TabsTrigger value="other" className="flex flex-col items-center gap-1 py-3">
                  <Calculator className="h-5 w-5" />
                  <span className="text-xs">Other</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Unit Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Length Unit</Label>
              <Select value={lengthUnit} onValueChange={(v) => setLengthUnit(v as LengthUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Inches (in)</SelectItem>
                  <SelectItem value="ft">Feet (ft)</SelectItem>
                  <SelectItem value="yd">Yards (yd)</SelectItem>
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
                  <SelectItem value="yd3">Cubic Yards (yd³)</SelectItem>
                  <SelectItem value="ft3">Cubic Feet (ft³)</SelectItem>
                  <SelectItem value="in3">Cubic Inches (in³)</SelectItem>
                  <SelectItem value="m3">Cubic Meters (m³)</SelectItem>
                  <SelectItem value="cm3">Cubic Centimeters (cm³)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shape-specific inputs */}
          {shape === "rectangular" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Length ({lengthUnit})</Label>
                <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Width ({lengthUnit})</Label>
                <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Depth ({lengthUnit})</Label>
                <Input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          {shape === "cube" && (
            <div className="space-y-2">
              <Label>Side Length ({lengthUnit})</Label>
              <Input type="number" value={side} onChange={(e) => setSide(e.target.value)} placeholder="0" />
            </div>
          )}

          {shape === "cylinder" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useRadius}
                  onChange={(e) => setUseRadius(e.target.checked)}
                  id="useRadius"
                />
                <Label htmlFor="useRadius">Use Radius (uncheck for Diameter)</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {useRadius ? (
                  <div className="space-y-2">
                    <Label>Radius ({lengthUnit})</Label>
                    <Input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} placeholder="0" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Diameter ({lengthUnit})</Label>
                    <Input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} placeholder="0" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Height ({lengthUnit})</Label>
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>
          )}

          {shape === "hollow-cuboid" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Outer dimensions:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Length ({lengthUnit})</Label>
                  <Input type="number" value={outerLength} onChange={(e) => setOuterLength(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Width ({lengthUnit})</Label>
                  <Input type="number" value={outerWidth} onChange={(e) => setOuterWidth(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Height ({lengthUnit})</Label>
                  <Input type="number" value={outerHeight} onChange={(e) => setOuterHeight(e.target.value)} placeholder="0" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Inner dimensions:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Length ({lengthUnit})</Label>
                  <Input type="number" value={innerLength} onChange={(e) => setInnerLength(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Width ({lengthUnit})</Label>
                  <Input type="number" value={innerWidth} onChange={(e) => setInnerWidth(e.target.value)} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Height ({lengthUnit})</Label>
                  <Input type="number" value={innerHeight} onChange={(e) => setInnerHeight(e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>
          )}

          {shape === "hollow-cylinder" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Outer Radius ({lengthUnit})</Label>
                <Input type="number" value={outerRadius} onChange={(e) => setOuterRadius(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Inner Radius ({lengthUnit})</Label>
                <Input type="number" value={innerRadius} onChange={(e) => setInnerRadius(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Height ({lengthUnit})</Label>
                <Input type="number" value={cylinderHeight} onChange={(e) => setCylinderHeight(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          {shape === "hemisphere" && (
            <div className="space-y-2">
              <Label>Radius ({lengthUnit})</Label>
              <Input type="number" value={hemisphereRadius} onChange={(e) => setHemisphereRadius(e.target.value)} placeholder="0" />
            </div>
          )}

          {shape === "cone" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Radius ({lengthUnit})</Label>
                <Input type="number" value={coneRadius} onChange={(e) => setConeRadius(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Height ({lengthUnit})</Label>
                <Input type="number" value={coneHeight} onChange={(e) => setConeHeight(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          {shape === "pyramid" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Base Area ({lengthUnit}²)</Label>
                <Input type="number" value={baseArea} onChange={(e) => setBaseArea(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Height ({lengthUnit})</Label>
                <Input type="number" value={pyramidHeight} onChange={(e) => setPyramidHeight(e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          {shape === "other" && (
            <div className="space-y-2">
              <Label>Volume ({getUnitLabel(volumeUnit)})</Label>
              <Input type="number" value={customVolume} onChange={(e) => setCustomVolume(e.target.value)} placeholder="0" />
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-2">
            <Label>Price per {getUnitLabel(volumeUnit)} (optional)</Label>
            <Input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} placeholder="0.00" />
          </div>

          {/* Results */}
          <div className="bg-primary/5 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Volume:</span>
              <span className="text-2xl font-bold text-primary">{volume.toFixed(4)} {getUnitLabel(volumeUnit)}</span>
            </div>
            {pricePerUnit && (
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Price:</span>
                <span className="text-xl font-bold text-green-600">${totalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleCopy} variant="secondary" className="flex-1">
              Copy Result
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
