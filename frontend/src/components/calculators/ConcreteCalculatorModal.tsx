import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import concreteSlabDimensions from "@/assets/calculators/concrete-slab-dimensions.jpg";
import concreteTypesDimensions from "@/assets/calculators/concrete-types-dimensions.jpg";

interface ConcreteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LengthUnit = "ft" | "m" | "in" | "yd" | "cm";
type WeightUnit = "lb" | "kg";

export const ConcreteCalculatorModal = ({ isOpen, onClose }: ConcreteCalculatorModalProps) => {
  // Input states
  const [length, setLength] = useState<string>("3");
  const [width, setWidth] = useState<string>("3");
  const [height, setHeight] = useState<string>("3");
  const [quantity, setQuantity] = useState<string>("4");
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>("ft");
  
  const [density, setDensity] = useState<string>("150");
  const [densityUnit, setDensityUnit] = useState<WeightUnit>("lb");
  
  const [bagSize, setBagSize] = useState<string>("60");
  const [bagUnit, setBagUnit] = useState<WeightUnit>("lb");
  
  const [waste, setWaste] = useState<string>("5");
  const [costPerBag, setCostPerBag] = useState<string>("10");

  // Conversion factors to feet for length
  const lengthToFeet = (value: number, unit: LengthUnit): number => {
    switch (unit) {
      case "ft": return value;
      case "m": return value * 3.28084;
      case "in": return value / 12;
      case "yd": return value * 3;
      case "cm": return value / 30.48;
      default: return value;
    }
  };

  // Conversion factors to cubic feet for volume
  const volumeToYards = (cubicFeet: number): number => cubicFeet / 27;
  const volumeToMeters = (cubicFeet: number): number => cubicFeet * 0.0283168;

  // Convert weight to pounds
  const weightToPounds = (value: number, unit: WeightUnit): number => {
    return unit === "lb" ? value : value * 2.20462;
  };

  // Calculate results
  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const qty = parseFloat(quantity) || 0;
    const d = parseFloat(density) || 0;
    const bag = parseFloat(bagSize) || 0;
    const w_percent = parseFloat(waste) || 0;
    const cost = parseFloat(costPerBag) || 0;

    // Convert all to feet
    const lengthFt = lengthToFeet(l, lengthUnit);
    const widthFt = lengthToFeet(w, lengthUnit);
    const heightFt = lengthToFeet(h, lengthUnit);

    // Volume calculation
    const volumePerSlabCubicFt = lengthFt * widthFt * heightFt;
    const totalVolumeCubicFt = volumePerSlabCubicFt * qty;
    const totalVolumeYards = volumeToYards(totalVolumeCubicFt);
    const totalVolumeMeters = volumeToMeters(totalVolumeCubicFt);

    // Weight calculation (convert density to lb/ft³)
    const densityLbPerCubicFt = weightToPounds(d, densityUnit);
    const totalWeight = totalVolumeCubicFt * densityLbPerCubicFt;

    // Bags calculation (convert bag size to pounds)
    const bagSizeLb = weightToPounds(bag, bagUnit);
    const bagsWithoutWaste = totalWeight / bagSizeLb;
    const bagsNeeded = Math.ceil(bagsWithoutWaste * (1 + w_percent / 100));

    // Cost calculation
    const totalCost = bagsNeeded * cost;
    const costPerSlab = qty > 0 ? totalCost / qty : 0;
    const areaPerSlab = lengthFt * widthFt;
    const totalArea = areaPerSlab * qty;
    const costPerSqFt = totalArea > 0 ? totalCost / totalArea : 0;
    const costPerCubicYd = totalVolumeYards > 0 ? totalCost / totalVolumeYards : 0;

    return {
      volumePerSlabCubicFt,
      totalVolumeCubicFt,
      totalVolumeYards,
      totalVolumeMeters,
      totalWeight,
      bagsWithoutWaste,
      bagsNeeded,
      totalCost,
      costPerSlab,
      costPerSqFt,
      costPerCubicYd,
      totalArea,
      areaPerSlab
    };
  };

  const results = calculate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Concrete Calculator</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Dimensions Section */}
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold text-lg">Dimensions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="length"
                      type="number"
                      step="0.01"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={lengthUnit} onValueChange={(v) => setLengthUnit(v as LengthUnit)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="yd">yd</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="width"
                      type="number"
                      step="0.01"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={lengthUnit} onValueChange={(v) => setLengthUnit(v as LengthUnit)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="yd">yd</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height / Depth</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={lengthUnit} onValueChange={(v) => setLengthUnit(v as LengthUnit)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ft">ft</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="in">in</SelectItem>
                        <SelectItem value="yd">yd</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Material Properties Section */}
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold text-lg">Material Properties</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="density">Concrete Density</Label>
                  <div className="flex gap-2">
                    <Input
                      id="density"
                      type="number"
                      step="0.1"
                      value={density}
                      onChange={(e) => setDensity(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={densityUnit} onValueChange={(v) => setDensityUnit(v as WeightUnit)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lb">lb/ft³</SelectItem>
                        <SelectItem value="kg">kg/m³</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bagSize">Bag Size</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bagSize"
                      type="number"
                      step="1"
                      value={bagSize}
                      onChange={(e) => setBagSize(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={bagUnit} onValueChange={(v) => setBagUnit(v as WeightUnit)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lb">lb</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waste">Waste / Spillage (%)</Label>
                  <Input
                    id="waste"
                    type="number"
                    step="0.1"
                    value={waste}
                    onChange={(e) => setWaste(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPerBag">Cost per Bag ($)</Label>
                  <Input
                    id="costPerBag"
                    type="number"
                    step="0.01"
                    value={costPerBag}
                    onChange={(e) => setCostPerBag(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Results Section */}
            <Card className="p-4 space-y-4 bg-muted/50">
              <h3 className="font-semibold text-lg">Results</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Volume per Slab</p>
                  <p className="text-lg font-semibold">{results.volumePerSlabCubicFt.toFixed(2)} ft³</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-lg font-semibold">{results.totalVolumeCubicFt.toFixed(2)} ft³</p>
                  <p className="text-sm text-muted-foreground">{results.totalVolumeYards.toFixed(2)} yd³ | {results.totalVolumeMeters.toFixed(2)} m³</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Weight</p>
                  <p className="text-lg font-semibold">{results.totalWeight.toFixed(2)} lb</p>
                  <p className="text-sm text-muted-foreground">{(results.totalWeight / 2.20462).toFixed(2)} kg</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bags Needed</p>
                  <p className="text-lg font-semibold text-primary">{results.bagsNeeded} bags</p>
                  <p className="text-sm text-muted-foreground">({results.bagsWithoutWaste.toFixed(1)} + {waste}% waste)</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="text-lg font-semibold">{results.totalArea.toFixed(2)} ft²</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-semibold text-primary">${results.totalCost.toFixed(2)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cost per Slab</p>
                  <p className="text-lg font-semibold">${results.costPerSlab.toFixed(2)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cost per ft²</p>
                  <p className="text-lg font-semibold">${results.costPerSqFt.toFixed(2)}</p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Cost per Cubic Yard</p>
                  <p className="text-lg font-semibold">${results.costPerCubicYd.toFixed(2)}</p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">How to Use This Calculator</h4>
                    <p className="text-sm text-muted-foreground">
                      This concrete calculator helps you estimate the amount of concrete needed for your project, 
                      along with the number of bags required and total cost.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Understanding Dimensions</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Measure your concrete slab or element carefully. Here's a visual guide:
                        </p>
                        <img 
                          src={concreteSlabDimensions} 
                          alt="Concrete slab dimensions diagram showing length, width, and height measurements" 
                          className="rounded-lg border w-full max-w-2xl mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Basic slab dimensions: Length, Width, and Height/Depth
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Different types of concrete elements:
                        </p>
                        <img 
                          src={concreteTypesDimensions} 
                          alt="Different concrete structures including footings, columns, and walkways with dimension labels" 
                          className="rounded-lg border w-full max-w-2xl mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Examples: Foundation footings, columns, and walkway slabs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Step-by-Step Guide</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Enter the dimensions of your slab or element (length, width, and height/depth)</li>
                      <li>Select your preferred unit of measurement (feet, meters, inches, yards, or centimeters)</li>
                      <li>Enter the quantity of slabs or elements you need</li>
                      <li>Adjust the concrete density if needed (default is 150 lb/ft³)</li>
                      <li>Set the bag size (default is 60 lb bags)</li>
                      <li>Add a waste percentage to account for spillage (recommended 5-10%)</li>
                      <li>Enter the cost per bag to get a cost estimate</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Calculation Method</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Volume:</strong> Length × Width × Height × Quantity</p>
                      <p><strong>Weight:</strong> Volume × Density</p>
                      <p><strong>Bags Needed:</strong> (Weight ÷ Bag Size) × (1 + Waste%)</p>
                      <p><strong>Total Cost:</strong> Bags Needed × Cost per Bag</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Default Values & Tips</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li><strong>Standard concrete density:</strong> 150 lb/ft³ (2,400 kg/m³)</li>
                      <li><strong>Common bag sizes:</strong> 40 lb, 60 lb, or 80 lb bags</li>
                      <li><strong>Recommended waste allowance:</strong> 5-10% for typical projects</li>
                      <li><strong>One cubic yard:</strong> Equals 27 cubic feet</li>
                      <li>Always round up the number of bags to ensure you have enough material</li>
                      <li>For large projects, consider ordering ready-mix concrete in cubic yards</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Common Applications</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Concrete slabs for patios, driveways, or floors</li>
                      <li>Foundation footings and pads</li>
                      <li>Sidewalks and walkways</li>
                      <li>Concrete columns and posts</li>
                      <li>Steps and stairs</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Pro Tip:</strong> For best results, always order slightly more concrete than calculated 
                      to account for uneven ground, measurement variations, and waste. It's better to have extra 
                      than to run short during your pour.
                    </p>
                  </div>
                </div>
              </div>
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
