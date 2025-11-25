import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import concreteTypesImage from "@/assets/calculators/concrete-types-dimensions.jpg";

interface ConcreteTypeWeightCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConcreteType = "asphalt" | "gravel" | "portland" | "portland-limestone" | "reinforced";
type VolumeUnit = "m3" | "ft3" | "yd3";
type UnitSystem = "metric" | "imperial";

interface ConcreteTypeData {
  name: string;
  densityMetric: number; // kg/m³
  densityImperial: number; // lb/ft³
}

const concreteTypes: Record<ConcreteType, ConcreteTypeData> = {
  asphalt: { name: "Asphalt", densityMetric: 2243, densityImperial: 140.03 },
  gravel: { name: "Gravel", densityMetric: 2404, densityImperial: 150.01 },
  portland: { name: "Portland", densityMetric: 2300, densityImperial: 143.58 },
  "portland-limestone": { name: "Portland-Limestone", densityMetric: 2371, densityImperial: 148.02 },
  reinforced: { name: "Reinforced (RCC)", densityMetric: 2500, densityImperial: 156.07 },
};

export const ConcreteTypeWeightCalculatorModal = ({ isOpen, onClose }: ConcreteTypeWeightCalculatorModalProps) => {
  const [concreteType, setConcreteType] = useState<ConcreteType>("portland");
  const [volume, setVolume] = useState("1");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("m3");
  const [customDensity, setCustomDensity] = useState("");
  const [useCustomDensity, setUseCustomDensity] = useState(false);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");

  // Get density based on concrete type and unit system
  const getDefaultDensity = (): number => {
    const typeData = concreteTypes[concreteType];
    return unitSystem === "metric" ? typeData.densityMetric : typeData.densityImperial;
  };

  const getCurrentDensity = (): number => {
    if (useCustomDensity && customDensity) {
      return parseFloat(customDensity);
    }
    return getDefaultDensity();
  };

  // Convert volume to cubic meters for calculation
  const volumeToM3 = (vol: number, unit: VolumeUnit): number => {
    switch (unit) {
      case "m3":
        return vol;
      case "ft3":
        return vol * 0.0283168;
      case "yd3":
        return vol * 0.764555;
      default:
        return vol;
    }
  };

  // Calculate weight
  const calculate = () => {
    const vol = parseFloat(volume) || 0;
    const density = getCurrentDensity();
    
    let volumeInM3 = volumeToM3(vol, volumeUnit);
    
    // If using imperial system, convert differently
    if (unitSystem === "imperial") {
      // For imperial, we need volume in ft³
      let volumeInFt3 = vol;
      if (volumeUnit === "m3") {
        volumeInFt3 = vol * 35.3147;
      } else if (volumeUnit === "yd3") {
        volumeInFt3 = vol * 27;
      }
      
      const weightLb = volumeInFt3 * density;
      const weightTon = weightLb / 2000;
      const weightKg = weightLb * 0.453592;
      const weightMetricTon = weightKg / 1000;
      
      return {
        weightPrimary: weightLb,
        weightSecondary: weightTon,
        weightKg,
        weightMetricTon,
        volumeInM3,
        volumeInYd3: volumeInM3 / 0.764555,
        density
      };
    } else {
      // Metric calculation
      const weightKg = volumeInM3 * density;
      const weightMetricTon = weightKg / 1000;
      const weightLb = weightKg * 2.20462;
      const weightTon = weightLb / 2000;
      
      return {
        weightPrimary: weightKg,
        weightSecondary: weightMetricTon,
        weightLb,
        weightTon,
        volumeInM3,
        volumeInYd3: volumeInM3 / 0.764555,
        density
      };
    }
  };

  const results = calculate();

  // Update custom density when type changes
  const handleTypeChange = (value: string) => {
    setConcreteType(value as ConcreteType);
    if (!useCustomDensity) {
      setCustomDensity("");
    }
  };

  const handleUnitSystemChange = (checked: boolean) => {
    setUnitSystem(checked ? "imperial" : "metric");
    setUseCustomDensity(false);
    setCustomDensity("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Concrete Weight Calculator by Type</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Unit System Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Unit System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="units" className="text-sm">Metric (kg/m³)</Label>
                  <Switch
                    id="units"
                    checked={unitSystem === "imperial"}
                    onCheckedChange={handleUnitSystemChange}
                  />
                  <Label htmlFor="units" className="text-sm">Imperial (lb/ft³)</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {unitSystem === "metric" ? "Kilograms and cubic meters" : "Pounds and cubic feet"}
                </p>
              </CardContent>
            </Card>

            {/* Concrete Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Concrete Type</CardTitle>
                <CardDescription>Select the type of concrete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="concreteType">Concrete Type</Label>
                  <Select value={concreteType} onValueChange={handleTypeChange}>
                    <SelectTrigger id="concreteType" className="bg-background">
                      <SelectValue placeholder="Select concrete type" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      {Object.entries(concreteTypes).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-3 rounded-md text-sm">
                  <p className="font-medium mb-1">Default Density:</p>
                  <p className="text-muted-foreground">
                    {getDefaultDensity().toFixed(2)} {unitSystem === "metric" ? "kg/m³" : "lb/ft³"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Volume Input */}
            <Card>
              <CardHeader>
                <CardTitle>Volume</CardTitle>
                <CardDescription>Enter the volume of concrete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volumeUnit">Unit</Label>
                    <Select value={volumeUnit} onValueChange={(value) => setVolumeUnit(value as VolumeUnit)}>
                      <SelectTrigger id="volumeUnit" className="bg-background">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="m3">Cubic Meters (m³)</SelectItem>
                        <SelectItem value="ft3">Cubic Feet (ft³)</SelectItem>
                        <SelectItem value="yd3">Cubic Yards (yd³)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Density */}
            <Card>
              <CardHeader>
                <CardTitle>Density (Optional)</CardTitle>
                <CardDescription>Override default density if needed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="customDensity"
                    checked={useCustomDensity}
                    onCheckedChange={setUseCustomDensity}
                  />
                  <Label htmlFor="customDensity" className="text-sm">Use Custom Density</Label>
                </div>

                {useCustomDensity && (
                  <div className="space-y-2">
                    <Label htmlFor="densityInput">
                      Custom Density ({unitSystem === "metric" ? "kg/m³" : "lb/ft³"})
                    </Label>
                    <Input
                      id="densityInput"
                      type="number"
                      value={customDensity}
                      onChange={(e) => setCustomDensity(e.target.value)}
                      placeholder={getDefaultDensity().toString()}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>Weight calculations based on your inputs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Concrete Type</p>
                      <p className="text-xl font-bold">{concreteTypes[concreteType].name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Density Used</p>
                      <p className="text-xl font-bold">
                        {results.density.toFixed(2)} {unitSystem === "metric" ? "kg/m³" : "lb/ft³"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold">Total Weight</h4>
                    {unitSystem === "metric" ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Weight (Kilograms):</span>
                          <span className="text-2xl font-bold text-primary">
                            {results.weightPrimary.toFixed(2)} kg
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Weight (Metric Tons):</span>
                          <span className="text-xl font-semibold">
                            {results.weightSecondary.toFixed(3)} t
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t pt-2">
                          <span className="text-muted-foreground">Weight (Pounds):</span>
                          <span className="font-medium">{results.weightLb.toFixed(2)} lb</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Weight (US Tons):</span>
                          <span className="font-medium">{results.weightTon.toFixed(3)} ton</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Weight (Pounds):</span>
                          <span className="text-2xl font-bold text-primary">
                            {results.weightPrimary.toFixed(2)} lb
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Weight (US Tons):</span>
                          <span className="text-xl font-semibold">
                            {results.weightSecondary.toFixed(3)} ton
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t pt-2">
                          <span className="text-muted-foreground">Weight (Kilograms):</span>
                          <span className="font-medium">{results.weightKg.toFixed(2)} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Weight (Metric Tons):</span>
                          <span className="font-medium">{results.weightMetricTon.toFixed(3)} t</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t pt-4 bg-muted/30 p-3 rounded-md">
                    <h4 className="font-semibold mb-2 text-sm">Conversion Example</h4>
                    <p className="text-sm text-muted-foreground">
                      1 cubic yard of {concreteTypes[concreteType].name} weighs approximately{" "}
                      <span className="font-semibold text-foreground">
                        {(0.764555 * concreteTypes[concreteType].densityMetric).toFixed(0)} kg
                      </span>{" "}
                      ({(0.764555 * concreteTypes[concreteType].densityMetric * 2.20462).toFixed(0)} lb)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Use This Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Getting Started</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Select your preferred unit system (Metric or Imperial)</li>
                    <li>Choose the concrete type from the dropdown menu</li>
                    <li>Enter the volume of concrete</li>
                    <li>Select the volume unit (m³, ft³, or yd³)</li>
                    <li>Optionally, override the default density</li>
                    <li>View the calculated weight in multiple units</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-1 gap-4 my-4">
                  <img 
                    src={concreteTypesImage} 
                    alt="Different types of concrete" 
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Calculation Formula</h4>
                  <div className="bg-muted/50 p-4 rounded-md">
                    <code className="text-sm font-mono">Weight = Volume × Density</code>
                    <p className="text-xs text-muted-foreground mt-2">
                      The calculator automatically converts between units and provides results in multiple formats.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Concrete Types & Default Densities</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Concrete Type</th>
                          <th className="text-right p-2 font-semibold">Density (kg/m³)</th>
                          <th className="text-right p-2 font-semibold">Density (lb/ft³)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(concreteTypes).map(([key, data]) => (
                          <tr key={key} className="border-b">
                            <td className="p-2">{data.name}</td>
                            <td className="text-right p-2">{data.densityMetric}</td>
                            <td className="text-right p-2">{data.densityImperial}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Important Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Default densities are industry-standard averages</li>
                    <li>Actual density may vary based on mix design and additives</li>
                    <li>Reinforced concrete (RCC) is heavier due to steel reinforcement</li>
                    <li>Always verify with your concrete supplier for exact specifications</li>
                    <li>Consider moisture content - wet concrete weighs more than dry</li>
                    <li>Use custom density override for specialized concrete mixes</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Common Applications</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Portland Cement</p>
                      <p className="text-xs text-muted-foreground">General construction, foundations, slabs</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Reinforced (RCC)</p>
                      <p className="text-xs text-muted-foreground">Structural elements, beams, columns</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Asphalt</p>
                      <p className="text-xs text-muted-foreground">Road paving, parking lots</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Gravel Concrete</p>
                      <p className="text-xs text-muted-foreground">Driveways, pathways, light-duty applications</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Volume Conversions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-muted/30 p-2 rounded">
                      <span>1 cubic meter (m³)</span>
                      <span className="font-medium">35.31 cubic feet (ft³)</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 p-2 rounded">
                      <span>1 cubic yard (yd³)</span>
                      <span className="font-medium">27 cubic feet (ft³)</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 p-2 rounded">
                      <span>1 cubic yard (yd³)</span>
                      <span className="font-medium">0.765 cubic meters (m³)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
