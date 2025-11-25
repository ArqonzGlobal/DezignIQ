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
import brickMasonryImg from "@/assets/calculators/brick-masonry.jpg";

interface ConcreteBlockFillCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitSystem = "metric" | "imperial";

export const ConcreteBlockFillCalculatorModal = ({ isOpen, onClose }: ConcreteBlockFillCalculatorModalProps) => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  
  // Wall dimensions
  const [wallHeight, setWallHeight] = useState<string>("3");
  const [wallWidth, setWallWidth] = useState<string>("10");
  
  // Block dimensions
  const [blockHeight, setBlockHeight] = useState<string>("0.2");
  const [blockWidth, setBlockWidth] = useState<string>("0.4");
  const [blockThickness, setBlockThickness] = useState<string>("0.2");
  
  // Block structure
  const [shellThickness, setShellThickness] = useState<string>("0.025");
  const [webThickness, setWebThickness] = useState<string>("0.025");
  const [numberOfWebs, setNumberOfWebs] = useState<string>("2");
  const [wastagePercent, setWastagePercent] = useState<string>("10");
  
  // Results
  const [results, setResults] = useState({
    coreVolumePerBlock: 0,
    numberOfBlocks: 0,
    fillVolumeBeforeWaste: 0,
    finalFillVolume: 0,
    wallArea: 0,
  });

  // Update default values when unit system changes
  useEffect(() => {
    if (unitSystem === "imperial") {
      setWallHeight("9.8");
      setWallWidth("32.8");
      setBlockHeight("8");
      setBlockWidth("16");
      setBlockThickness("8");
      setShellThickness("1");
      setWebThickness("1");
    } else {
      setWallHeight("3");
      setWallWidth("10");
      setBlockHeight("0.2");
      setBlockWidth("0.4");
      setBlockThickness("0.2");
      setShellThickness("0.025");
      setWebThickness("0.025");
    }
  }, [unitSystem]);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [
    wallHeight,
    wallWidth,
    blockHeight,
    blockWidth,
    blockThickness,
    shellThickness,
    webThickness,
    numberOfWebs,
    wastagePercent,
    unitSystem,
  ]);

  const calculateResults = () => {
    try {
      const wHeight = parseFloat(wallHeight) || 0;
      const wWidth = parseFloat(wallWidth) || 0;
      const bHeight = parseFloat(blockHeight) || 0;
      const bWidth = parseFloat(blockWidth) || 0;
      const bThickness = parseFloat(blockThickness) || 0;
      const shellT = parseFloat(shellThickness) || 0;
      const webT = parseFloat(webThickness) || 0;
      const numWebs = parseFloat(numberOfWebs) || 0;
      const wastage = parseFloat(wastagePercent) || 0;

      // Convert imperial to metric for calculations if needed
      let wallHeightM = wHeight;
      let wallWidthM = wWidth;
      let blockHeightM = bHeight;
      let blockWidthM = bWidth;
      let blockThicknessM = bThickness;
      let shellThicknessM = shellT;
      let webThicknessM = webT;

      if (unitSystem === "imperial") {
        wallHeightM = wHeight * 0.3048;
        wallWidthM = wWidth * 0.3048;
        blockHeightM = bHeight * 0.0254;
        blockWidthM = bWidth * 0.0254;
        blockThicknessM = bThickness * 0.0254;
        shellThicknessM = shellT * 0.0254;
        webThicknessM = webT * 0.0254;
      }

      // Calculate wall area
      const wallArea = wallHeightM * wallWidthM;

      // Calculate number of blocks
      const blockArea = blockHeightM * blockWidthM;
      const numberOfBlocks = Math.ceil(wallArea / blockArea);

      // Calculate internal dimensions (subtracting shell thickness from both sides)
      const blockInternalWidth = blockWidthM - (2 * shellThicknessM);
      const blockInternalThickness = blockThicknessM - (2 * shellThicknessM);
      
      // Calculate core volume per block (internal space minus webs)
      const totalInternalVolume = blockInternalWidth * blockInternalThickness * blockHeightM;
      const websVolume = numWebs * webThicknessM * blockInternalThickness * blockHeightM;
      const coreVolumePerBlock = totalInternalVolume - websVolume;

      // Calculate total fill volume
      const fillVolumeBeforeWaste = coreVolumePerBlock * numberOfBlocks;
      const finalFillVolume = fillVolumeBeforeWaste * (1 + wastage / 100);

      setResults({
        wallArea: unitSystem === "metric" ? wallArea : wallArea * 10.7639,
        numberOfBlocks,
        coreVolumePerBlock: unitSystem === "metric" ? coreVolumePerBlock : coreVolumePerBlock * 35.3147,
        fillVolumeBeforeWaste: unitSystem === "metric" ? fillVolumeBeforeWaste : fillVolumeBeforeWaste * 35.3147,
        finalFillVolume: unitSystem === "metric" ? finalFillVolume : finalFillVolume * 35.3147,
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
            Concrete Block Fill Calculator
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
                      <SelectItem value="imperial">Imperial (feet, inches, ft³)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Wall Dimensions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Wall Dimensions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallHeight">
                        Wall Height ({unitSystem === "metric" ? "m" : "ft"})
                        <InfoTooltip text="Total height of the concrete block wall." />
                      </Label>
                      <Input
                        id="wallHeight"
                        type="number"
                        step="0.1"
                        min="0"
                        value={wallHeight}
                        onChange={(e) => setWallHeight(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wallWidth">
                        Wall Width/Length ({unitSystem === "metric" ? "m" : "ft"})
                        <InfoTooltip text="Length of the wall to be filled." />
                      </Label>
                      <Input
                        id="wallWidth"
                        type="number"
                        step="0.1"
                        min="0"
                        value={wallWidth}
                        onChange={(e) => setWallWidth(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Block Dimensions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Block Dimensions</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blockHeight">
                        Block Height ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Vertical dimension of one block. Standard: 200mm (8 inches)." />
                      </Label>
                      <Input
                        id="blockHeight"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.5"}
                        min="0"
                        value={blockHeight}
                        onChange={(e) => setBlockHeight(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="blockWidth">
                        Block Width ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Horizontal length of one block. Standard: 400mm (16 inches)." />
                      </Label>
                      <Input
                        id="blockWidth"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.5"}
                        min="0"
                        value={blockWidth}
                        onChange={(e) => setBlockWidth(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blockThickness">
                        Block Thickness ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Wall thickness (depth into the page). Standard: 200mm (8 inches)." />
                      </Label>
                      <Input
                        id="blockThickness"
                        type="number"
                        step={unitSystem === "metric" ? "0.01" : "0.5"}
                        min="0"
                        value={blockThickness}
                        onChange={(e) => setBlockThickness(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Block Structure */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Block Structure Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shellThickness">
                        Shell Thickness ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Thickness of outer walls. Typical: 25mm (1 inch)." />
                      </Label>
                      <Input
                        id="shellThickness"
                        type="number"
                        step={unitSystem === "metric" ? "0.001" : "0.125"}
                        min="0"
                        value={shellThickness}
                        onChange={(e) => setShellThickness(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webThickness">
                        Web Thickness ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Thickness of internal connecting webs. Typical: 25mm (1 inch)." />
                      </Label>
                      <Input
                        id="webThickness"
                        type="number"
                        step={unitSystem === "metric" ? "0.001" : "0.125"}
                        min="0"
                        value={webThickness}
                        onChange={(e) => setWebThickness(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfWebs">
                        Number of Webs
                        <InfoTooltip text="How many internal vertical webs connect the two shells. Standard: 2." />
                      </Label>
                      <Input
                        id="numberOfWebs"
                        type="number"
                        step="1"
                        min="0"
                        value={numberOfWebs}
                        onChange={(e) => setNumberOfWebs(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wastage">
                        Wastage (%)
                        <InfoTooltip text="Account for material waste and spillage. Typical: 10%." />
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
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Calculation Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Wall Area</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.wallArea.toFixed(2)} {unitSystem === "metric" ? "m²" : "ft²"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Number of Blocks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.numberOfBlocks}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Core Volume per Block</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.coreVolumePerBlock.toFixed(4)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Fill Before Waste</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.fillVolumeBeforeWaste.toFixed(2)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Fill Volume Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.finalFillVolume.toFixed(2)} {unitSystem === "metric" ? "m³" : "ft³"}
                        </div>
                        <CardDescription className="mt-1">
                          Including {wastagePercent}% wastage allowance
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
                  <h2 className="text-2xl font-bold mb-3">What is a Concrete Block Fill Calculator?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A concrete block fill calculator determines how much concrete, grout, or mortar is needed to fill the 
                    hollow cores of concrete blocks (CMUs). This is essential for reinforced walls where cores must be filled 
                    for structural strength, or when adding insulation or other materials to the block cavities. The calculator 
                    accounts for the complex internal geometry of hollow blocks including shells, webs, and core spaces.
                  </p>
                </section>

                <Separator />

                {/* Visual Guide */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Understanding Block Core Structure</h2>
                  <div className="my-4">
                    <img 
                      src={brickMasonryImg} 
                      alt="Concrete block showing hollow cores and internal structure" 
                      className="rounded-lg border w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Typical hollow concrete blocks with core cavities that need filling for structural applications
                    </p>
                  </div>
                </section>

                <Separator />

                {/* How Calculations Work */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">How the Calculation Works</h2>
                  <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Internal Dimensions
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        First, calculate the internal cavity dimensions by subtracting shell thickness:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Internal Width = Block Width - (2 × Shell Thickness)<br/>
                        Internal Thickness = Block Thickness - (2 × Shell Thickness)
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Core Volume per Block
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Calculate the fillable volume accounting for internal webs:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Total Internal Volume = Internal Width × Internal Thickness × Block Height<br/>
                        Webs Volume = Number of Webs × Web Thickness × Internal Thickness × Block Height<br/>
                        Core Volume = Total Internal Volume - Webs Volume
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Total Fill Volume
                      </h4>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Number of Blocks = (Wall Height × Wall Width) ÷ (Block Height × Block Width)<br/>
                        Fill Volume = Core Volume per Block × Number of Blocks<br/>
                        Final Volume = Fill Volume × (1 + Wastage Fraction)
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Common Applications */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">When to Fill Concrete Block Cores</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Structural Reinforcement</h4>
                        <p className="text-sm text-muted-foreground">
                          Fill cores containing vertical rebar for load-bearing walls, retaining walls, or seismic zones. 
                          The filled cores provide compressive and lateral strength.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Foundation Walls</h4>
                        <p className="text-sm text-muted-foreground">
                          Below-grade walls often require filled cores for structural capacity and resistance to soil pressure.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Sound Insulation</h4>
                        <p className="text-sm text-muted-foreground">
                          Filling cores with concrete or specialized insulation material significantly reduces sound transmission.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Thermal Mass</h4>
                        <p className="text-sm text-muted-foreground">
                          Filled blocks provide greater thermal mass, helping regulate indoor temperature in certain climates.
                        </p>
                      </div>
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
                        <h4 className="font-semibold mb-1">Use Proper Grout Mix</h4>
                        <p className="text-sm text-muted-foreground">
                          Use fine grout (max 3/8" aggregate) or coarse grout (max 1/2" aggregate) depending on your core dimensions. 
                          Fine grout flows better in narrow spaces.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Fill in Lifts</h4>
                        <p className="text-sm text-muted-foreground">
                          Don't fill more than 4-5 feet at once. Allow grout to consolidate, then continue filling. 
                          This prevents voids and ensures proper strength development.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Consolidate Properly</h4>
                        <p className="text-sm text-muted-foreground">
                          Use a vibrator or consolidation rod to eliminate air pockets and ensure grout flows around rebar. 
                          Proper consolidation is critical for structural performance.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Add 10-15% Wastage</h4>
                        <p className="text-sm text-muted-foreground">
                          Always order extra material. Grout can settle, and actual block dimensions vary slightly. 
                          Running short mid-pour creates construction joints and weak points.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Check Building Codes</h4>
                        <p className="text-sm text-muted-foreground">
                          Local codes specify which cores must be filled, grout strength requirements, and inspection procedures. 
                          Always verify requirements before starting.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Clean Cores Before Filling</h4>
                        <p className="text-sm text-muted-foreground">
                          Remove all mortar droppings and debris from cores before filling. Use a long rod or cleanout 
                          openings at the base. Debris creates voids and reduces strength.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Grout vs Concrete */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Grout vs. Concrete for Filling</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Grout (Recommended)</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Higher slump, flows into cores easily</li>
                        <li>• Smaller aggregate size fits through rebar</li>
                        <li>• Specifically designed for masonry cavities</li>
                        <li>• Self-consolidating options available</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Concrete</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• May not flow well in narrow cores</li>
                        <li>• Larger aggregate can bridge around rebar</li>
                        <li>• Requires more vibration/consolidation</li>
                        <li>• Sometimes used for large cores</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Important Notes */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Important Notes</h2>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <strong>Structural Requirements:</strong> Consult a structural engineer for load-bearing walls, 
                      retaining walls, or seismic applications. Grout strength, rebar placement, and inspection are critical.
                    </p>
                    <p className="text-sm">
                      <strong>Selective Filling:</strong> Not all cores need filling. Typically, only cores with rebar 
                      or structural requirements are filled. Check your project specifications.
                    </p>
                    <p className="text-sm">
                      <strong>Measurement Accuracy:</strong> This calculator provides estimates. Actual block dimensions 
                      and core volumes vary by manufacturer. Measure actual blocks when possible or contact your supplier.
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
