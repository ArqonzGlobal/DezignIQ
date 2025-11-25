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
import { Switch } from "@/components/ui/switch";
import { useCurrency } from "@/contexts/CurrencyContext";
import stairsImg from "@/assets/calculators/stairs.jpg";

interface ConcreteStairsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitSystem = "metric" | "imperial";

export const ConcreteStairsCalculatorModal = ({ isOpen, onClose }: ConcreteStairsCalculatorModalProps) => {
  const { currencySymbol } = useCurrency();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  
  // Stair dimensions
  const [numSteps, setNumSteps] = useState<string>("12");
  const [riserRise, setRiserRise] = useState<string>("0.18");
  const [effectiveTreadRun, setEffectiveTreadRun] = useState<string>("0.25");
  const [nosingDepth, setNosingDepth] = useState<string>("0.03");
  const [throatDepth, setThroatDepth] = useState<string>("0.15");
  const [stairWidth, setStairWidth] = useState<string>("1.2");
  
  // Settings
  const [useAngledRisers, setUseAngledRisers] = useState<boolean>(false);
  const [wastagePercent, setWastagePercent] = useState<string>("10");
  const [concreteCostPerUnit, setConcreteCostPerUnit] = useState<string>("100");
  
  // Results
  const [results, setResults] = useState({
    stepArea: 0,
    carriageAreaPerStep: 0,
    rawVolume: 0,
    finalVolume: 0,
    totalRise: 0,
    totalRun: 0,
    totalCost: 0,
  });

  // Update defaults when unit system changes
  useEffect(() => {
    if (unitSystem === "imperial") {
      setNumSteps("12");
      setRiserRise("7");
      setEffectiveTreadRun("10");
      setNosingDepth("1");
      setThroatDepth("6");
      setStairWidth("48");
      setConcreteCostPerUnit("150");
    } else {
      setNumSteps("12");
      setRiserRise("0.18");
      setEffectiveTreadRun("0.25");
      setNosingDepth("0.03");
      setThroatDepth("0.15");
      setStairWidth("1.2");
      setConcreteCostPerUnit("100");
    }
  }, [unitSystem]);

  // Calculate results
  useEffect(() => {
    calculateResults();
  }, [
    numSteps,
    riserRise,
    effectiveTreadRun,
    nosingDepth,
    throatDepth,
    stairWidth,
    useAngledRisers,
    wastagePercent,
    concreteCostPerUnit,
    unitSystem,
  ]);

  const calculateResults = () => {
    try {
      const steps = parseFloat(numSteps) || 0;
      const r = parseFloat(riserRise) || 0;
      const t = parseFloat(effectiveTreadRun) || 0;
      const nosing = parseFloat(nosingDepth) || 0;
      const d = parseFloat(throatDepth) || 0;
      const w = parseFloat(stairWidth) || 0;
      const wastage = parseFloat(wastagePercent) || 0;
      const costPerUnit = parseFloat(concreteCostPerUnit) || 0;

      // Convert imperial to metric for calculations if needed
      let riserRiseM = r;
      let effectiveTreadRunM = t;
      let nosingDepthM = nosing;
      let throatDepthM = d;
      let stairWidthM = w;

      if (unitSystem === "imperial") {
        riserRiseM = r * 0.0254; // inches to meters
        effectiveTreadRunM = t * 0.0254;
        nosingDepthM = nosing * 0.0254;
        throatDepthM = d * 0.0254;
        stairWidthM = w * 0.0254;
      }

      // Calculate step area
      let stepArea: number;
      if (useAngledRisers) {
        // For angled risers: step_area = 0.5 × (effective_tread_run + nosing_depth) × riser_rise
        stepArea = 0.5 * (effectiveTreadRunM + nosingDepthM) * riserRiseM;
      } else {
        // For regular risers: step_area = 0.5 × effective_tread_run × riser_rise
        stepArea = 0.5 * effectiveTreadRunM * riserRiseM;
      }

      // Calculate carriage (stringer) area per step
      // carriage_area_per_step = sqrt(tread² + rise²) × throat_depth
      const diagonalLength = Math.sqrt(
        Math.pow(effectiveTreadRunM, 2) + Math.pow(riserRiseM, 2)
      );
      const carriageAreaPerStep = diagonalLength * throatDepthM;

      // Calculate total end area
      const endAreaTotal = steps * (stepArea + carriageAreaPerStep);

      // Calculate raw volume
      const rawVolume = endAreaTotal * stairWidthM;

      // Apply wastage
      const finalVolume = rawVolume * (1 + wastage / 100);

      // Calculate total dimensions
      const totalRise = riserRiseM * steps;
      const totalRun = effectiveTreadRunM * (steps - 1); // One less tread than risers

      // Calculate cost (cost per cubic unit)
      const totalCost = finalVolume * costPerUnit;

      setResults({
        stepArea: unitSystem === "metric" ? stepArea : stepArea * 10.7639,
        carriageAreaPerStep: unitSystem === "metric" ? carriageAreaPerStep : carriageAreaPerStep * 10.7639,
        rawVolume: unitSystem === "metric" ? rawVolume : rawVolume * 35.3147,
        finalVolume: unitSystem === "metric" ? finalVolume : finalVolume * 35.3147,
        totalRise: unitSystem === "metric" ? totalRise : totalRise * 3.28084,
        totalRun: unitSystem === "metric" ? totalRun : totalRun * 3.28084,
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
            Concrete Stairs Calculator
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
                <div className="space-y-2">
                  <Label>Unit System</Label>
                  <Select value={unitSystem} onValueChange={(value) => setUnitSystem(value as UnitSystem)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (meters, m³)</SelectItem>
                      <SelectItem value="imperial">Imperial (inches, feet, ft³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Stair Dimensions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Stair Dimensions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numSteps">
                        Number of Steps (Risers)
                        <InfoTooltip text="Total number of risers (vertical steps) in the flight." />
                      </Label>
                      <Input
                        id="numSteps"
                        type="number"
                        step="1"
                        min="1"
                        value={numSteps}
                        onChange={(e) => setNumSteps(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="riserRise">
                        Riser Height ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Vertical height of each step. Building codes: 150-200mm (6-8 inches)." />
                      </Label>
                      <Input
                        id="riserRise"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.25"}
                        min="0"
                        value={riserRise}
                        onChange={(e) => setRiserRise(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="effectiveTreadRun">
                        Tread Run/Depth ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Horizontal depth of each step. Building codes: 250-300mm (10-11 inches)." />
                      </Label>
                      <Input
                        id="effectiveTreadRun"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.25"}
                        min="0"
                        value={effectiveTreadRun}
                        onChange={(e) => setEffectiveTreadRun(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nosingDepth">
                        Nosing Overhang ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Extra tread overhang at the front. Typical: 25-40mm (1-1.5 inches)." />
                      </Label>
                      <Input
                        id="nosingDepth"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.25"}
                        min="0"
                        value={nosingDepth}
                        onChange={(e) => setNosingDepth(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="throatDepth">
                        Throat/Slab Thickness ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Thickness of the slab/carriage under the stairs. Typical: 150-200mm (6-8 inches)." />
                      </Label>
                      <Input
                        id="throatDepth"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.25"}
                        min="0"
                        value={throatDepth}
                        onChange={(e) => setThroatDepth(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stairWidth">
                        Stair Width ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Width of the stairs. Residential minimum: 900mm (36 inches)." />
                      </Label>
                      <Input
                        id="stairWidth"
                        type="number"
                        step={unitSystem === "metric" ? "0.1" : "1"}
                        min="0"
                        value={stairWidth}
                        onChange={(e) => setStairWidth(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Additional Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="angledRisers" className="text-sm font-medium">
                          Use Angled/Slanted Risers
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle if risers are slanted instead of vertical (increases concrete volume)
                        </p>
                      </div>
                      <Switch
                        id="angledRisers"
                        checked={useAngledRisers}
                        onCheckedChange={setUseAngledRisers}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wastage">
                          Wastage (%)
                          <InfoTooltip text="Material waste and spillage allowance. Typical: 10-15%." />
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
                        <Label htmlFor="costPerUnit">
                          Cost per {unitSystem === "metric" ? "m³" : "ft³"} ({currencySymbol})
                          <InfoTooltip text="Concrete cost per cubic unit for total cost estimation." />
                        </Label>
                        <Input
                          id="costPerUnit"
                          type="number"
                          step="1"
                          min="0"
                          value={concreteCostPerUnit}
                          onChange={(e) => setConcreteCostPerUnit(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Calculation Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Rise (Height)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.totalRise.toFixed(2)} {unitSystem === "metric" ? "m" : "ft"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Run (Length)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.totalRun.toFixed(2)} {unitSystem === "metric" ? "m" : "ft"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Step Area (Each)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.stepArea.toFixed(4)} {unitSystem === "metric" ? "m²" : "ft²"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Carriage Area (Each)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.carriageAreaPerStep.toFixed(4)} {unitSystem === "metric" ? "m²" : "ft²"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Volume Before Waste</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.rawVolume.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Final Volume Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.finalVolume.toFixed(3)} {unitSystem === "metric" ? "m³" : "ft³"}
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
                          Concrete only (excludes formwork, rebar & labor)
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
                  <h2 className="text-2xl font-bold mb-3">What is a Concrete Stairs Calculator?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A concrete stairs calculator helps you determine the exact volume of concrete needed for constructing 
                    a flight of concrete stairs. Whether you're building exterior stairs to a porch, interior stairs between 
                    floors, or basement access stairs, this calculator accounts for the complex geometry including treads, 
                    risers, nosing, and the supporting slab (throat/carriage) beneath the stairs. Accurate calculations 
                    prevent costly over-ordering or project delays from material shortages.
                  </p>
                </section>

                <Separator />

                {/* Visual Guide */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Understanding Stair Components</h2>
                  <div className="my-4">
                    <img 
                      src={stairsImg} 
                      alt="Diagram showing concrete stair components including risers, treads, and nosing" 
                      className="rounded-lg border w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Key components of concrete stairs: risers (vertical), treads (horizontal), and nosing (overhang)
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
                        Step Area (Per Step)
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Calculate the cross-sectional area of each step:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm space-y-1">
                        <div>Regular Risers: 0.5 × Tread Run × Riser Height</div>
                        <div>Angled Risers: 0.5 × (Tread + Nosing) × Riser Height</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Carriage/Stringer Area
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Calculate the diagonal slab supporting the stairs:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm space-y-1">
                        <div>Diagonal Length = √(Tread² + Rise²)</div>
                        <div>Carriage Area = Diagonal Length × Throat Thickness</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Total Volume
                      </h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm space-y-1">
                        <div>End Area = Number of Steps × (Step Area + Carriage Area)</div>
                        <div>Raw Volume = End Area × Stair Width</div>
                        <div>Final Volume = Raw Volume × (1 + Wastage Fraction)</div>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Building Codes */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Building Code Requirements</h2>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Riser Height</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Maximum: 7.75 inches (197mm) - Residential</li>
                        <li>• Maximum: 7 inches (178mm) - Commercial</li>
                        <li>• Variation between risers: ≤ 3/8 inch (9.5mm)</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Tread Depth</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Minimum: 10 inches (254mm) - Residential</li>
                        <li>• Minimum: 11 inches (280mm) - Commercial</li>
                        <li>• Measured from riser to nosing</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Stair Width</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Minimum: 36 inches (914mm) - Residential</li>
                        <li>• Minimum: 44 inches (1118mm) - Commercial</li>
                        <li>• Measure between handrails</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Headroom</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Minimum: 80 inches (2032mm) measured vertically</li>
                        <li>• Check at all points along stair run</li>
                      </ul>
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
                        <h4 className="font-semibold mb-1">Rise and Run Formula</h4>
                        <p className="text-sm text-muted-foreground">
                          Use the "2R + T = 24-25 inches" rule (in imperial) or "2R + T = 600-650mm" (metric). 
                          This ensures comfortable stair proportions. Example: 7" rise + 11" tread = 25".
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Formwork is Critical</h4>
                        <p className="text-sm text-muted-foreground">
                          Stairs require precise, sturdy formwork. Even small errors in riser height create tripping hazards. 
                          Use laser levels and brace formwork heavily—wet concrete is very heavy.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Reinforcement Required</h4>
                        <p className="text-sm text-muted-foreground">
                          All concrete stairs need steel reinforcement. Use rebar grid in the slab and additional bars 
                          at the nose of each tread. Minimum 3000 psi (20 MPa) concrete recommended.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Finish Before Concrete Sets</h4>
                        <p className="text-sm text-muted-foreground">
                          Tread surfaces must be finished for traction. Use a broom finish or apply non-slip strips. 
                          Work quickly—you must finish while concrete is still workable.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Order 10-15% Extra</h4>
                        <p className="text-sm text-muted-foreground">
                          Stair formwork deflects under load, and hand-finishing uses more concrete than calculated. 
                          Always order extra—you cannot stop mid-pour for more concrete.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Landing Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          Building codes require landings at top and bottom, and every 12 feet of vertical rise. 
                          Landing must be at least as wide as the stairs and 36 inches deep minimum.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Common Mistakes */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Common Mistakes to Avoid</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-destructive">✕</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Inconsistent Riser Heights</h4>
                        <p className="text-sm text-muted-foreground">
                          Even small variations in riser height create serious tripping hazards. Use precision formwork 
                          and measure multiple times during construction.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-destructive">✕</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Inadequate Curing</h4>
                        <p className="text-sm text-muted-foreground">
                          Stairs experience heavy traffic and must reach full strength. Keep concrete moist for 7 days 
                          minimum. Don't allow traffic until fully cured (28 days for full strength).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-destructive">✕</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Forgetting Drainage</h4>
                        <p className="text-sm text-muted-foreground">
                          Outdoor stairs need proper drainage. Slope treads slightly (1/8" per foot) toward front and 
                          ensure water doesn't pond. Standing water causes freeze-thaw damage and slipping.
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
                      <strong>Code Compliance:</strong> Always check local building codes before construction. Stair 
                      requirements vary by jurisdiction and occupancy type. Inspections are typically required.
                    </p>
                    <p className="text-sm">
                      <strong>Structural Design:</strong> Stairs are structural elements. For spans over 6 feet or unusual 
                      configurations, consult a structural engineer to ensure adequate strength and proper connections.
                    </p>
                    <p className="text-sm">
                      <strong>Safety First:</strong> Stairs are one of the most hazardous parts of buildings. Precise 
                      construction, proper handrails, adequate lighting, and slip-resistant surfaces are essential.
                    </p>
                    <p className="text-sm">
                      <strong>This Calculator:</strong> Provides volume estimates for standard straight-run stairs. 
                      Complex stairs (spiral, L-shaped, U-shaped) require custom calculations and engineering.
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
