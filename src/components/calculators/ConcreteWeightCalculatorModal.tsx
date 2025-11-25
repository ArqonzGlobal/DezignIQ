import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import pavingImage from "@/assets/calculators/paving-driveway.jpg";

interface ConcreteWeightCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitSystem = "metric" | "imperial";
type Mode = "simple" | "advanced";

export const ConcreteWeightCalculatorModal = ({ isOpen, onClose }: ConcreteWeightCalculatorModalProps) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [mode, setMode] = useState<Mode>("simple");
  
  // Dimensions
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("3");
  const [concreteDepth, setConcreteDepth] = useState("10");
  const [gravelDepth, setGravelDepth] = useState("10");
  
  // Advanced inputs
  const [rebarSpacing, setRebarSpacing] = useState("30");
  const [singleRebarLength, setSingleRebarLength] = useState("6");
  
  // Material prices
  const [concretePrice, setConcretePrice] = useState("150");
  const [gravelPrice, setGravelPrice] = useState("50");
  const [rebarPrice, setRebarPrice] = useState("5");
  const [formworkPrice, setFormworkPrice] = useState("10");

  // Unit conversion helpers
  const lengthToMeters = (value: number): number => {
    return unitSystem === "imperial" ? value * 0.3048 : value;
  };

  const depthToMeters = (value: number): number => {
    return unitSystem === "imperial" ? value * 0.0254 : value / 100;
  };

  const volumeDisplay = (value: number): string => {
    if (unitSystem === "imperial") {
      return (value * 35.3147).toFixed(2) + " ft³";
    }
    return value.toFixed(2) + " m³";
  };

  const lengthDisplay = (value: number): string => {
    if (unitSystem === "imperial") {
      return (value * 3.28084).toFixed(2) + " ft";
    }
    return value.toFixed(2) + " m";
  };

  const calculate = () => {
    const l = lengthToMeters(parseFloat(length) || 0);
    const w = lengthToMeters(parseFloat(width) || 0);
    const cDepth = depthToMeters(parseFloat(concreteDepth) || 0);
    const gDepth = depthToMeters(parseFloat(gravelDepth) || 0);

    // Basic calculations
    const concreteVolume = l * w * cDepth;
    const gravelVolume = l * w * gDepth;

    let rebarTotalLength = 0;
    let rebarPieces = 0;
    let formworkLength = 0;
    let rebarCost = 0;
    let formworkCost = 0;

    if (mode === "advanced") {
      const spacing = depthToMeters(parseFloat(rebarSpacing) || 30);
      const singleLength = lengthToMeters(parseFloat(singleRebarLength) || 6);
      
      // Rebar calculation
      rebarTotalLength = ((l / spacing) + (w / spacing)) * 2 * Math.max(l, w);
      rebarPieces = Math.ceil(rebarTotalLength / singleLength);
      
      // Formwork
      formworkLength = 2 * (l + w);
      
      // Costs
      rebarCost = rebarTotalLength * (parseFloat(rebarPrice) || 0);
      formworkCost = formworkLength * (parseFloat(formworkPrice) || 0);
    }

    // Material costs
    const concreteCost = concreteVolume * (parseFloat(concretePrice) || 0);
    const gravelCost = gravelVolume * (parseFloat(gravelPrice) || 0);
    const totalCost = concreteCost + gravelCost + rebarCost + formworkCost;

    return {
      concreteVolume,
      gravelVolume,
      rebarTotalLength,
      rebarPieces,
      formworkLength,
      concreteCost,
      gravelCost,
      rebarCost,
      formworkCost,
      totalCost
    };
  };

  const results = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Concrete Driveway Calculator</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Mode and Unit System Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Calculation Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="mode" className="text-sm">Simple</Label>
                    <Switch
                      id="mode"
                      checked={mode === "advanced"}
                      onCheckedChange={(checked) => setMode(checked ? "advanced" : "simple")}
                    />
                    <Label htmlFor="mode" className="text-sm">Advanced</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {mode === "simple" ? "Basic volume calculation" : "Full cost breakdown with materials"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Unit System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="units" className="text-sm">Metric</Label>
                    <Switch
                      id="units"
                      checked={unitSystem === "imperial"}
                      onCheckedChange={(checked) => setUnitSystem(checked ? "imperial" : "metric")}
                    />
                    <Label htmlFor="units" className="text-sm">Imperial</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {unitSystem === "metric" ? "Meters, centimeters" : "Feet, inches"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle>Driveway Dimensions</CardTitle>
                <CardDescription>Enter the dimensions of your driveway</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length ({unitSystem === "metric" ? "m" : "ft"})</Label>
                    <Input
                      id="length"
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Width ({unitSystem === "metric" ? "m" : "ft"})</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concreteDepth">Concrete Depth ({unitSystem === "metric" ? "cm" : "in"})</Label>
                    <Input
                      id="concreteDepth"
                      type="number"
                      value={concreteDepth}
                      onChange={(e) => setConcreteDepth(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gravelDepth">Gravel Base Depth ({unitSystem === "metric" ? "cm" : "in"})</Label>
                    <Input
                      id="gravelDepth"
                      type="number"
                      value={gravelDepth}
                      onChange={(e) => setGravelDepth(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Mode Inputs */}
            {mode === "advanced" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Rebar & Formwork</CardTitle>
                    <CardDescription>Additional material specifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rebarSpacing">Rebar Spacing ({unitSystem === "metric" ? "cm" : "in"})</Label>
                        <Input
                          id="rebarSpacing"
                          type="number"
                          value={rebarSpacing}
                          onChange={(e) => setRebarSpacing(e.target.value)}
                          placeholder="30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="singleRebarLength">Single Rebar Length ({unitSystem === "metric" ? "m" : "ft"})</Label>
                        <Input
                          id="singleRebarLength"
                          type="number"
                          value={singleRebarLength}
                          onChange={(e) => setSingleRebarLength(e.target.value)}
                          placeholder="6"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Material Unit Prices</CardTitle>
                    <CardDescription>Enter costs per unit in your local currency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="concretePrice">Concrete Price (per {unitSystem === "metric" ? "m³" : "ft³"})</Label>
                        <Input
                          id="concretePrice"
                          type="number"
                          value={concretePrice}
                          onChange={(e) => setConcretePrice(e.target.value)}
                          placeholder="150"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gravelPrice">Gravel Price (per {unitSystem === "metric" ? "m³" : "ft³"})</Label>
                        <Input
                          id="gravelPrice"
                          type="number"
                          value={gravelPrice}
                          onChange={(e) => setGravelPrice(e.target.value)}
                          placeholder="50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rebarPrice">Rebar Price (per {unitSystem === "metric" ? "m" : "ft"})</Label>
                        <Input
                          id="rebarPrice"
                          type="number"
                          value={rebarPrice}
                          onChange={(e) => setRebarPrice(e.target.value)}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="formworkPrice">Formwork Price (per {unitSystem === "metric" ? "m" : "ft"})</Label>
                        <Input
                          id="formworkPrice"
                          type="number"
                          value={formworkPrice}
                          onChange={(e) => setFormworkPrice(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Results */}
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>Material quantities and cost estimates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Concrete Volume</p>
                    <p className="text-2xl font-bold">{volumeDisplay(results.concreteVolume)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Gravel Volume</p>
                    <p className="text-2xl font-bold">{volumeDisplay(results.gravelVolume)}</p>
                  </div>
                  
                  {mode === "advanced" && (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Total Rebar Length</p>
                        <p className="text-2xl font-bold">{lengthDisplay(results.rebarTotalLength)}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Number of Rebar Pieces</p>
                        <p className="text-2xl font-bold">{results.rebarPieces}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Wooden Form Length</p>
                        <p className="text-2xl font-bold">{lengthDisplay(results.formworkLength)}</p>
                      </div>
                    </>
                  )}
                </div>

                {mode === "advanced" && (
                  <div className="mt-6 space-y-3 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Cost Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Concrete Cost:</span>
                        <span className="font-semibold">${results.concreteCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gravel Cost:</span>
                        <span className="font-semibold">${results.gravelCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rebar Cost:</span>
                        <span className="font-semibold">${results.rebarCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Formwork Cost:</span>
                        <span className="font-semibold">${results.formworkCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t text-lg">
                        <span className="font-bold">Total Estimated Cost:</span>
                        <span className="font-bold text-primary">${results.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
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
                    <li>Choose your calculation mode (Simple or Advanced)</li>
                    <li>Select your preferred unit system (Metric or Imperial)</li>
                    <li>Enter your driveway dimensions (length, width, depths)</li>
                    <li>For advanced mode, add rebar and material pricing details</li>
                    <li>Review the calculated results and cost breakdown</li>
                  </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <img 
                    src={pavingImage} 
                    alt="Paving and driveway construction" 
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Calculation Methods</h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="font-medium">Concrete Volume</p>
                      <code className="text-xs">Volume = Length × Width × Depth</code>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="font-medium">Gravel Volume</p>
                      <code className="text-xs">Volume = Length × Width × Gravel Depth</code>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="font-medium">Rebar Total Length</p>
                      <code className="text-xs">Length = (L/Spacing + W/Spacing) × 2 × Max(L,W)</code>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="font-medium">Formwork Length</p>
                      <code className="text-xs">Length = 2 × (Length + Width)</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Important Tips</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Standard driveway concrete depth is typically 10cm (4 inches)</li>
                    <li>A gravel base of 10-15cm provides proper drainage and stability</li>
                    <li>Rebar spacing of 30cm (12 inches) is common for residential driveways</li>
                    <li>Always add 5-10% extra material for waste and spillage</li>
                    <li>Check local building codes for specific requirements</li>
                    <li>Consider expansion joints for driveways longer than 6 meters</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Common Applications</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Residential Driveway</p>
                      <p className="text-xs text-muted-foreground">10cm concrete + 10cm gravel base</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Heavy-Duty Driveway</p>
                      <p className="text-xs text-muted-foreground">15cm concrete + 15cm gravel base</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Walkway/Patio</p>
                      <p className="text-xs text-muted-foreground">7.5cm concrete + 10cm gravel</p>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="font-medium">Light Traffic Path</p>
                      <p className="text-xs text-muted-foreground">5cm concrete + minimal base</p>
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
