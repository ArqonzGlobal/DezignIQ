import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Calculator, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrency } from "@/contexts/CurrencyContext";
import structuralEngineeringImg from "@/assets/calculators/structural-engineering.jpg";

interface ConcreteColumnCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitSystem = "metric" | "imperial";
type ColumnShape = "circular" | "rectangular";

export const ConcreteColumnCalculatorModal = ({ isOpen, onClose }: ConcreteColumnCalculatorModalProps) => {
  const { currencySymbol } = useCurrency();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [columnShape, setColumnShape] = useState<ColumnShape>("circular");
  
  // Column dimensions
  const [diameter, setDiameter] = useState<string>("0.4");
  const [width, setWidth] = useState<string>("0.3");
  const [depth, setDepth] = useState<string>("0.3");
  const [height, setHeight] = useState<string>("3");
  const [quantity, setQuantity] = useState<string>("4");
  
  // Material properties
  const [concreteDensity, setConcreteDensity] = useState<string>("2400");
  const [mixRatioCement, setMixRatioCement] = useState<string>("1");
  const [mixRatioSand, setMixRatioSand] = useState<string>("2");
  const [mixRatioAggregate, setMixRatioAggregate] = useState<string>("4");
  const [bagWeight, setBagWeight] = useState<string>("50");
  const [wastagePercent, setWastagePercent] = useState<string>("5");
  const [costPerBag, setCostPerBag] = useState<string>("8");
  
  // Results
  const [results, setResults] = useState({
    volumePerColumn: 0,
    totalVolume: 0,
    totalWeight: 0,
    cementVolume: 0,
    sandVolume: 0,
    aggregateVolume: 0,
    bagsNeeded: 0,
    totalCost: 0,
  });

  // Update defaults when unit system changes
  useEffect(() => {
    if (unitSystem === "imperial") {
      setDiameter("15.75");
      setWidth("11.8");
      setDepth("11.8");
      setHeight("9.84");
      setConcreteDensity("150");
      setBagWeight("80");
    } else {
      setDiameter("0.4");
      setWidth("0.3");
      setDepth("0.3");
      setHeight("3");
      setConcreteDensity("2400");
      setBagWeight("50");
    }
  }, [unitSystem]);

  // Calculate results
  useEffect(() => {
    calculateResults();
  }, [
    columnShape,
    diameter,
    width,
    depth,
    height,
    quantity,
    concreteDensity,
    mixRatioCement,
    mixRatioSand,
    mixRatioAggregate,
    bagWeight,
    wastagePercent,
    costPerBag,
    unitSystem,
  ]);

  const calculateResults = () => {
    try {
      const qty = parseFloat(quantity) || 0;
      const h = parseFloat(height) || 0;
      const density = parseFloat(concreteDensity) || 0;
      const cement = parseFloat(mixRatioCement) || 0;
      const sand = parseFloat(mixRatioSand) || 0;
      const aggregate = parseFloat(mixRatioAggregate) || 0;
      const bag = parseFloat(bagWeight) || 0;
      const wastage = parseFloat(wastagePercent) || 0;
      const cost = parseFloat(costPerBag) || 0;

      let heightM = h;
      let crossSectionalArea = 0;

      if (columnShape === "circular") {
        const d = parseFloat(diameter) || 0;
        let diameterM = d;
        
        if (unitSystem === "imperial") {
          diameterM = d * 0.0254; // inches to meters
          heightM = h * 0.3048; // feet to meters
        }
        
        const radius = diameterM / 2;
        crossSectionalArea = Math.PI * radius * radius;
      } else {
        const w = parseFloat(width) || 0;
        const d = parseFloat(depth) || 0;
        let widthM = w;
        let depthM = d;
        
        if (unitSystem === "imperial") {
          widthM = w * 0.0254; // inches to meters
          depthM = d * 0.0254; // inches to meters
          heightM = h * 0.3048; // feet to meters
        }
        
        crossSectionalArea = widthM * depthM;
      }

      // Volume calculations
      const volumePerColumn = crossSectionalArea * heightM;
      const totalVolume = volumePerColumn * qty;

      // Weight calculation
      let densityKgPerM3 = density;
      if (unitSystem === "imperial") {
        densityKgPerM3 = density * 16.0185; // lb/ft³ to kg/m³
      }
      const totalWeight = totalVolume * densityKgPerM3;

      // Mix ratio calculations
      const sumOfRatioParts = cement + sand + aggregate;
      const cementVolume = totalVolume * (cement / sumOfRatioParts);
      const sandVolume = totalVolume * (sand / sumOfRatioParts);
      const aggregateVolume = totalVolume * (aggregate / sumOfRatioParts);

      // Bags calculation
      let bagWeightKg = bag;
      if (unitSystem === "imperial") {
        bagWeightKg = bag * 0.453592; // lb to kg
      }
      
      const bagsWithoutWaste = totalWeight / bagWeightKg;
      const bagsNeeded = Math.ceil(bagsWithoutWaste * (1 + wastage / 100));
      const totalCost = bagsNeeded * cost;

      setResults({
        volumePerColumn: unitSystem === "metric" ? volumePerColumn : volumePerColumn * 35.3147,
        totalVolume: unitSystem === "metric" ? totalVolume : totalVolume * 35.3147,
        totalWeight: unitSystem === "metric" ? totalWeight : totalWeight * 2.20462,
        cementVolume: unitSystem === "metric" ? cementVolume : cementVolume * 35.3147,
        sandVolume: unitSystem === "metric" ? sandVolume : sandVolume * 35.3147,
        aggregateVolume: unitSystem === "metric" ? aggregateVolume : aggregateVolume * 35.3147,
        bagsNeeded,
        totalCost,
      });
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const InfoTooltip = ({ text }: { text: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Concrete Column Calculator
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 p-1">
                {/* Unit System */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit System</Label>
                    <Select value={unitSystem} onValueChange={(value) => setUnitSystem(value as UnitSystem)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (meters, kg)</SelectItem>
                        <SelectItem value="imperial">Imperial (feet, inches, lb)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Column Shape</Label>
                    <Select value={columnShape} onValueChange={(value) => setColumnShape(value as ColumnShape)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circular">Circular</SelectItem>
                        <SelectItem value="rectangular">Rectangular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Column Dimensions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Column Dimensions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {columnShape === "circular" ? (
                      <div className="space-y-2">
                        <Label htmlFor="diameter">
                          Diameter ({unitSystem === "metric" ? "m" : "inches"})
                          <InfoTooltip text="Diameter of circular column. Common: 300-600mm (12-24 inches)." />
                        </Label>
                        <Input
                          id="diameter"
                          type="number"
                          step={unitSystem === "metric" ? "0.01" : "0.5"}
                          min="0"
                          value={diameter}
                          onChange={(e) => setDiameter(e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="width">
                            Width ({unitSystem === "metric" ? "m" : "inches"})
                            <InfoTooltip text="Width of rectangular column." />
                          </Label>
                          <Input
                            id="width"
                            type="number"
                            step={unitSystem === "metric" ? "0.01" : "0.5"}
                            min="0"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="depth">
                            Depth ({unitSystem === "metric" ? "m" : "inches"})
                            <InfoTooltip text="Depth of rectangular column." />
                          </Label>
                          <Input
                            id="depth"
                            type="number"
                            step={unitSystem === "metric" ? "0.01" : "0.5"}
                            min="0"
                            value={depth}
                            onChange={(e) => setDepth(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="height">
                        Height ({unitSystem === "metric" ? "m" : "ft"})
                        <InfoTooltip text="Full height of column from base to top." />
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        min="0"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity
                        <InfoTooltip text="Number of identical columns." />
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="1"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Material Properties */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Material Properties</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="density">
                        Concrete Density ({unitSystem === "metric" ? "kg/m³" : "lb/ft³"})
                        <InfoTooltip text="Standard concrete: 2400 kg/m³ (150 lb/ft³)." />
                      </Label>
                      <Input
                        id="density"
                        type="number"
                        step="1"
                        min="0"
                        value={concreteDensity}
                        onChange={(e) => setConcreteDensity(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bagWeight">
                        Bag Weight ({unitSystem === "metric" ? "kg" : "lb"})
                        <InfoTooltip text="Weight of one concrete/cement bag. Standard: 50kg (80lb)." />
                      </Label>
                      <Input
                        id="bagWeight"
                        type="number"
                        step="1"
                        min="0"
                        value={bagWeight}
                        onChange={(e) => setBagWeight(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wastage">
                        Wastage (%)
                        <InfoTooltip text="Material waste allowance. Typical: 5-10%." />
                      </Label>
                      <Input
                        id="wastage"
                        type="number"
                        step="1"
                        min="0"
                        max="30"
                        value={wastagePercent}
                        onChange={(e) => setWastagePercent(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costPerBag">
                        Cost per Bag ({currencySymbol})
                        <InfoTooltip text="Price of one bag for cost estimation." />
                      </Label>
                      <Input
                        id="costPerBag"
                        type="number"
                        step="0.1"
                        min="0"
                        value={costPerBag}
                        onChange={(e) => setCostPerBag(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Mix Ratio */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Mix Ratio (Cement : Sand : Aggregate)</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cement">
                        Cement
                        <InfoTooltip text="Cement ratio part. Standard structural: 1:2:4 or 1:1.5:3." />
                      </Label>
                      <Input
                        id="cement"
                        type="number"
                        step="0.5"
                        min="0"
                        value={mixRatioCement}
                        onChange={(e) => setMixRatioCement(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sand">Sand</Label>
                      <Input
                        id="sand"
                        type="number"
                        step="0.5"
                        min="0"
                        value={mixRatioSand}
                        onChange={(e) => setMixRatioSand(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aggregate">Aggregate</Label>
                      <Input
                        id="aggregate"
                        type="number"
                        step="0.5"
                        min="0"
                        value={mixRatioAggregate}
                        onChange={(e) => setMixRatioAggregate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Calculation Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Volume per Column</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.volumePerColumn.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.totalVolume.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                        <CardDescription className="mt-1">
                          For {quantity} column(s)
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.totalWeight.toFixed(1)} {unitSystem === "metric" ? "kg" : "lb"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Cement Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.cementVolume.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                        <CardDescription className="mt-1">
                          Based on mix ratio
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Sand Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.sandVolume.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Aggregate Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.aggregateVolume.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Bags Needed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.bagsNeeded}
                        </div>
                        <CardDescription className="mt-1">
                          Including {wastagePercent}% wastage
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Estimated Total Cost</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {currencySymbol}{results.totalCost.toFixed(2)}
                        </div>
                        <CardDescription className="mt-1">
                          Materials only (excludes labor & rebar)
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="guide">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 p-1 prose prose-sm max-w-none dark:prose-invert">
                {/* Introduction */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">What is a Concrete Column Calculator?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A concrete column calculator helps you determine the volume, weight, and material requirements for 
                    reinforced concrete columns. Whether you're designing circular or rectangular columns for a building, 
                    bridge, or other structure, this calculator provides accurate estimates for concrete volume, component 
                    materials (cement, sand, aggregate), and total project costs. It's essential for both structural engineers 
                    and construction professionals planning column construction.
                  </p>
                </section>

                <Separator />

                {/* Visual Guide */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Understanding Concrete Columns</h2>
                  <div className="my-4">
                    <img 
                      src={structuralEngineeringImg} 
                      alt="Concrete column construction showing formwork and reinforcement" 
                      className="rounded-lg border w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Reinforced concrete columns supporting structural loads
                    </p>
                  </div>
                </section>

                <Separator />

                {/* Calculation Method */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">How the Calculation Works</h2>
                  <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Volume Calculation
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Volume depends on column cross-section:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm space-y-1">
                        <div>Circular: Volume = π × (Diameter/2)² × Height</div>
                        <div>Rectangular: Volume = Width × Depth × Height</div>
                        <div>Total Volume = Volume per Column × Quantity</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Weight Calculation
                      </h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Total Weight = Total Volume × Concrete Density
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Mix Components
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Based on mix ratio (e.g., 1:2:4 = Cement:Sand:Aggregate):
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm space-y-1">
                        <div>Sum of Ratio = 1 + 2 + 4 = 7</div>
                        <div>Cement Volume = Total Volume × (1/7)</div>
                        <div>Sand Volume = Total Volume × (2/7)</div>
                        <div>Aggregate Volume = Total Volume × (4/7)</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Bags Required
                      </h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Bags = (Total Weight / Bag Weight) × (1 + Wastage%)
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Column Types */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Common Column Types</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Circular Columns</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Better load distribution in all directions</li>
                        <li>• Aesthetically pleasing appearance</li>
                        <li>• More expensive formwork required</li>
                        <li>• Common in bridges and architectural features</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Rectangular Columns</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Simpler formwork and construction</li>
                        <li>• Better for corners and wall connections</li>
                        <li>• More common in building construction</li>
                        <li>• Can be designed for specific load directions</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Mix Ratios */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Standard Mix Ratios for Columns</h2>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">1:2:4 (M15 Grade)</h4>
                      <p className="text-sm text-muted-foreground">
                        General purpose mix for residential columns. Compressive strength: ~15 MPa (2175 psi).
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">1:1.5:3 (M20 Grade)</h4>
                      <p className="text-sm text-muted-foreground">
                        Standard structural mix for most building columns. Compressive strength: ~20 MPa (2900 psi).
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">1:1:2 (M25 Grade)</h4>
                      <p className="text-sm text-muted-foreground">
                        High-strength mix for heavy-duty columns and multi-story buildings. Compressive strength: ~25 MPa (3625 psi).
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Pro Tips */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Professional Tips</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Structural Design Required</h4>
                        <p className="text-sm text-muted-foreground">
                          Always consult a structural engineer for column design. This calculator estimates materials only—
                          actual design must account for loads, reinforcement, ties, and local building codes.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Minimum Column Size</h4>
                        <p className="text-sm text-muted-foreground">
                          Typical minimum column size: 230mm × 230mm (9" × 9") for light loads, 300mm × 300mm (12" × 12") 
                          for normal residential buildings. Larger sizes needed for heavier structures.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Reinforcement Steel</h4>
                        <p className="text-sm text-muted-foreground">
                          Columns require vertical rebar (main bars) and horizontal ties/stirrups. Typical reinforcement: 
                          1-3% of column cross-sectional area. This calculator doesn't include rebar weight.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Pour Continuously</h4>
                        <p className="text-sm text-muted-foreground">
                          Columns should be poured in one continuous operation to avoid cold joints. Plan concrete delivery 
                          and formwork capacity accordingly.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Vibration is Critical</h4>
                        <p className="text-sm text-muted-foreground">
                          Use concrete vibrators to eliminate air pockets, especially around rebar. Poor consolidation 
                          creates weak spots and reduces load capacity significantly.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Formwork Pressure</h4>
                        <p className="text-sm text-muted-foreground">
                          Column formwork experiences significant lateral pressure from wet concrete. Ensure adequate 
                          bracing and tie strength, especially for tall columns.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Important Notes */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Important Notes</h2>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <strong>Engineering Required:</strong> This calculator is for material estimation only. All structural 
                      columns must be designed by a licensed structural engineer considering loads, seismic requirements, 
                      soil conditions, and building codes.
                    </p>
                    <p className="text-sm">
                      <strong>Concrete Grade:</strong> Use appropriate concrete grade for your application. Higher loads 
                      require higher strength concrete (M20, M25, M30, etc.). Your engineer will specify the required grade.
                    </p>
                    <p className="text-sm">
                      <strong>Reinforcement Not Included:</strong> This calculator estimates concrete only. Steel reinforcement 
                      (rebar and ties) must be calculated separately based on structural design.
                    </p>
                    <p className="text-sm">
                      <strong>Quality Control:</strong> Use good quality cement, clean sand and aggregate, correct water-cement 
                      ratio, and proper curing for 28 days to achieve design strength.
                    </p>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
