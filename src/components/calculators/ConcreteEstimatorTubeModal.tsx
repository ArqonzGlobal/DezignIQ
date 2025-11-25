import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import concreteImage from "@/assets/calculators/concrete-types-dimensions.jpg";

interface ConcreteEstimatorTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConcreteEstimatorTubeModal = ({ isOpen, onClose }: ConcreteEstimatorTubeModalProps) => {
  const { currencyCode } = useCurrency();
  
  // State for inputs
  const [numberOfTubes, setNumberOfTubes] = useState<number>(5);
  const [outerDiameter, setOuterDiameter] = useState<number>(1.6);
  const [innerDiameter, setInnerDiameter] = useState<number>(1.3);
  const [height, setHeight] = useState<number>(8);
  const [density, setDensity] = useState<number>(150);
  const [bagWeight, setBagWeight] = useState<number>(60);
  const [wastePercent, setWastePercent] = useState<number>(5);
  const [costPerBag, setCostPerBag] = useState<number>(10);
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  // Calculate results
  const results = useMemo(() => {
    if (!numberOfTubes || !outerDiameter || !innerDiameter || !height || !density || !bagWeight) {
      return null;
    }

    // Convert diameters to radius
    const outerRadius = outerDiameter / 2;
    const innerRadius = innerDiameter / 2;

    // Volume of one tube = π × h × (R² - r²)
    const volumePerTube = Math.PI * height * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));
    
    // Total volume for all tubes
    const totalVolume = volumePerTube * numberOfTubes;

    // Add waste
    const volumeWithWaste = totalVolume * (1 + wastePercent / 100);

    // Total weight
    const totalWeight = volumeWithWaste * density;

    // Number of bags needed
    const bagsNeeded = Math.ceil(totalWeight / bagWeight);

    // Total cost
    const totalCost = bagsNeeded * costPerBag;

    return {
      volumePerTube,
      totalVolume,
      volumeWithWaste,
      totalWeight,
      bagsNeeded,
      totalCost,
    };
  }, [numberOfTubes, outerDiameter, innerDiameter, height, density, bagWeight, wastePercent, costPerBag]);

  const unitLabels = unitSystem === "imperial" 
    ? { length: "ft", volume: "ft³", weight: "lb", density: "lb/ft³" }
    : { length: "m", volume: "m³", weight: "kg", density: "kg/m³" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Concrete Estimator - Tube</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Information</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Unit System Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Unit System</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={unitSystem} onValueChange={(value: "imperial" | "metric") => setUnitSystem(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imperial">Imperial (ft, lb)</SelectItem>
                    <SelectItem value="metric">Metric (m, kg)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
                <CardDescription>Enter the dimensions and specifications for your concrete tubes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfTubes">Number of Tubes (N)</Label>
                    <Input
                      id="numberOfTubes"
                      type="number"
                      min="1"
                      value={numberOfTubes}
                      onChange={(e) => setNumberOfTubes(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outerDiameter">Outer Diameter (Dₒ) - {unitLabels.length}</Label>
                    <Input
                      id="outerDiameter"
                      type="number"
                      min="0"
                      step="0.1"
                      value={outerDiameter}
                      onChange={(e) => setOuterDiameter(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="innerDiameter">Inner Diameter (Dᵢ) - {unitLabels.length}</Label>
                    <Input
                      id="innerDiameter"
                      type="number"
                      min="0"
                      step="0.1"
                      value={innerDiameter}
                      onChange={(e) => setInnerDiameter(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height/Length (H) - {unitLabels.length}</Label>
                    <Input
                      id="height"
                      type="number"
                      min="0"
                      step="0.1"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="density">Concrete Density (ρ) - {unitLabels.density}</Label>
                    <Input
                      id="density"
                      type="number"
                      min="0"
                      value={density}
                      onChange={(e) => setDensity(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bagWeight">Bag Weight (Wₙ) - {unitLabels.weight}</Label>
                    <Input
                      id="bagWeight"
                      type="number"
                      min="0"
                      value={bagWeight}
                      onChange={(e) => setBagWeight(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wastePercent">Waste/Spillage (%)</Label>
                    <Input
                      id="wastePercent"
                      type="number"
                      min="0"
                      max="100"
                      value={wastePercent}
                      onChange={(e) => setWastePercent(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPerBag">Cost per Bag ({currencyCode})</Label>
                    <Input
                      id="costPerBag"
                      type="number"
                      min="0"
                      step="0.01"
                      value={costPerBag}
                      onChange={(e) => setCostPerBag(Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Calculation Results</CardTitle>
                  <CardDescription>Concrete requirements for your tube project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Volume per Tube</p>
                      <p className="text-2xl font-bold">{results.volumePerTube.toFixed(2)} {unitLabels.volume}</p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Volume (All Tubes)</p>
                      <p className="text-2xl font-bold">{results.totalVolume.toFixed(2)} {unitLabels.volume}</p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Volume with {wastePercent}% Waste</p>
                      <p className="text-2xl font-bold">{results.volumeWithWaste.toFixed(2)} {unitLabels.volume}</p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Weight</p>
                      <p className="text-2xl font-bold">{results.totalWeight.toFixed(2)} {unitLabels.weight}</p>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Bags Required</p>
                      <p className="text-2xl font-bold text-primary">{results.bagsNeeded} bags</p>
                    </div>

                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-2xl font-bold text-primary">{formatPrice(results.totalCost)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Calculate Concrete for Tubes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img 
                  src={concreteImage} 
                  alt="Concrete tube dimensions"
                  className="w-full rounded-lg shadow-md mb-4"
                />
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Formula Explanation</h3>
                  <p className="text-muted-foreground">
                    The volume of a hollow tube (cylinder) is calculated using:
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    V = π × h × (R² - r²)
                  </div>
                  <p className="text-muted-foreground">
                    Where:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>π</strong> = 3.14159...</li>
                    <li><strong>h</strong> = Height (or length) of the tube</li>
                    <li><strong>R</strong> = Outer radius (Dₒ / 2)</li>
                    <li><strong>r</strong> = Inner radius (Dᵢ / 2)</li>
                  </ul>
                </div>

                <div className="space-y-3 pt-4">
                  <h3 className="font-semibold text-lg">Step-by-Step Process</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Measure the outer diameter (Dₒ) and inner diameter (Dᵢ) of the tube</li>
                    <li>Measure the height or length (H) of the tube</li>
                    <li>Convert diameters to radii by dividing by 2</li>
                    <li>Calculate volume using the formula above</li>
                    <li>Multiply by the number of tubes needed</li>
                    <li>Add waste percentage for spillage and cutting</li>
                    <li>Calculate weight by multiplying volume by concrete density</li>
                    <li>Divide by bag weight and round up to get number of bags</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Concrete Densities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Concrete Type</th>
                        <th className="text-left p-2">Imperial (lb/ft³)</th>
                        <th className="text-left p-2">Metric (kg/m³)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Standard Concrete</td>
                        <td className="p-2">145-150</td>
                        <td className="p-2">2320-2400</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Reinforced Concrete</td>
                        <td className="p-2">150-160</td>
                        <td className="p-2">2400-2560</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Lightweight Concrete</td>
                        <td className="p-2">90-115</td>
                        <td className="p-2">1440-1840</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">High-Strength Concrete</td>
                        <td className="p-2">155-165</td>
                        <td className="p-2">2480-2640</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Waste Allowance</h4>
                  <p className="text-sm text-muted-foreground">
                    Always add 5-10% extra for waste, spillage, and uneven surfaces. For complex projects, consider 10-15%.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Unit Consistency</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure all measurements use the same unit system. Don't mix feet with meters or pounds with kilograms.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Tube Applications</h4>
                  <p className="text-sm text-muted-foreground">
                    Concrete tubes are commonly used for columns, piers, pilings, and cylindrical forms. Ensure inner diameter accounts for any reinforcement.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Ordering Strategy</h4>
                  <p className="text-sm text-muted-foreground">
                    Round up to whole bags. It's better to have a small amount left over than to run short during the pour.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
