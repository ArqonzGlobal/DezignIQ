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
import brickMasonryImg from "@/assets/calculators/brick-masonry.jpg";

interface ConcreteBlockCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitSystem = "metric" | "imperial";

export const ConcreteBlockCalculatorModal = ({ isOpen, onClose }: ConcreteBlockCalculatorModalProps) => {
  const { currencySymbol } = useCurrency();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  
  // Wall dimensions
  const [wallHeight, setWallHeight] = useState<string>("3");
  const [wallWidth, setWallWidth] = useState<string>("10");
  
  // Block dimensions
  const [blockHeight, setBlockHeight] = useState<string>("0.2");
  const [blockWidth, setBlockWidth] = useState<string>("0.4");
  
  // Optional inputs
  const [pricePerBlock, setPricePerBlock] = useState<string>("2.50");
  const [includeMortarEstimation, setIncludeMortarEstimation] = useState<boolean>(true);
  
  // Results
  const [results, setResults] = useState({
    numberOfBlocks: 0,
    totalBlockCost: 0,
    mortarBagsEstimation: 0,
    wallArea: 0,
  });

  // Update default values when unit system changes
  useEffect(() => {
    if (unitSystem === "imperial") {
      setWallHeight("9.8");
      setWallWidth("32.8");
      setBlockHeight("8");
      setBlockWidth("16");
    } else {
      setWallHeight("3");
      setWallWidth("10");
      setBlockHeight("0.2");
      setBlockWidth("0.4");
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
    pricePerBlock,
    includeMortarEstimation,
    unitSystem,
  ]);

  const calculateResults = () => {
    try {
      const wHeight = parseFloat(wallHeight) || 0;
      const wWidth = parseFloat(wallWidth) || 0;
      const bHeight = parseFloat(blockHeight) || 0;
      const bWidth = parseFloat(blockWidth) || 0;
      const price = parseFloat(pricePerBlock) || 0;

      // Convert imperial to metric for calculations if needed
      let wallHeightM = wHeight;
      let wallWidthM = wWidth;
      let blockHeightM = bHeight;
      let blockWidthM = bWidth;

      if (unitSystem === "imperial") {
        wallHeightM = wHeight * 0.3048; // ft to m
        wallWidthM = wWidth * 0.3048; // ft to m
        blockHeightM = bHeight * 0.0254; // inches to m
        blockWidthM = bWidth * 0.0254; // inches to m
      }

      // Calculate wall area
      const wallArea = wallHeightM * wallWidthM;

      // Calculate block area
      const blockArea = blockHeightM * blockWidthM;

      // Calculate number of blocks needed
      // Formula: number_of_blocks = (wall_height × wall_width) / (block_height × block_width)
      const numberOfBlocks = Math.ceil(wallArea / blockArea);
      
      // Calculate total block cost
      // Formula: total_block_cost = number_of_blocks × price_per_block
      const totalBlockCost = numberOfBlocks * price;

      // Calculate mortar bags estimation
      // Formula: mortar_bags_estimation = number_of_blocks / 33.3
      const mortarBagsEstimation = Math.ceil(numberOfBlocks / 33.3);

      setResults({
        wallArea: unitSystem === "metric" ? wallArea : wallArea * 10.7639, // Convert to ft² if imperial
        numberOfBlocks,
        totalBlockCost,
        mortarBagsEstimation: includeMortarEstimation ? mortarBagsEstimation : 0,
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
            Concrete Block Calculator
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
                      <SelectItem value="metric">Metric (meters, m²)</SelectItem>
                      <SelectItem value="imperial">Imperial (feet, inches, ft²)</SelectItem>
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
                        <InfoTooltip text="Enter the total height of the wall from ground to top." />
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
                        <InfoTooltip text="Enter the length of the wall you want to build." />
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
                  <h3 className="font-semibold text-sm">Concrete Block Dimensions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blockHeight">
                        Block Height ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Standard concrete block: 200mm (0.2m) or 8 inches." />
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
                        Block Width/Length ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Standard concrete block: 400mm (0.4m) or 16 inches." />
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
                  </div>
                </div>

                <Separator />

                {/* Optional Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Optional Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerBlock">
                        Price per Block ({currencySymbol})
                        <InfoTooltip text="Enter the cost of one concrete block to estimate total material cost." />
                      </Label>
                      <Input
                        id="pricePerBlock"
                        type="number"
                        step="0.01"
                        min="0"
                        value={pricePerBlock}
                        onChange={(e) => setPricePerBlock(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="includeMortar" className="text-sm font-medium">
                          Include Mortar Estimation
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Calculate required mortar bags (approximately 1 bag per 33.3 blocks)
                        </p>
                      </div>
                      <Switch
                        id="includeMortar"
                        checked={includeMortarEstimation}
                        onCheckedChange={setIncludeMortarEstimation}
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
                        <CardTitle className="text-sm font-medium">Blocks Needed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.numberOfBlocks}
                        </div>
                        <CardDescription className="mt-1">
                          Concrete blocks required
                        </CardDescription>
                      </CardContent>
                    </Card>

                    {includeMortarEstimation && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Mortar Bags</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-primary">
                            {results.mortarBagsEstimation}
                          </div>
                          <CardDescription className="mt-1">
                            Estimated bags (1 per ~33 blocks)
                          </CardDescription>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Block Cost</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {currencySymbol}{results.totalBlockCost.toFixed(2)}
                        </div>
                        <CardDescription className="mt-1">
                          Blocks only (excludes mortar & labor)
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
                  <h2 className="text-2xl font-bold mb-3">What is a Concrete Block Calculator?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A concrete block calculator is an essential tool for construction projects that helps you accurately 
                    determine how many concrete blocks (also known as CMU - Concrete Masonry Units) you need for building 
                    walls. Whether you're constructing a foundation wall, retaining wall, or building exterior, this calculator 
                    eliminates guesswork and ensures you purchase the right quantity of materials, saving both time and money 
                    while preventing project delays due to material shortages.
                  </p>
                </section>

                <Separator />

                {/* Visual Guide */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Understanding Concrete Block Construction</h2>
                  <div className="my-4">
                    <img 
                      src={brickMasonryImg} 
                      alt="Concrete block masonry wall construction showing stacked blocks with mortar joints" 
                      className="rounded-lg border w-full"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      Typical concrete block wall construction with mortar joints
                    </p>
                  </div>
                </section>

                <Separator />

                {/* How to Use */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">How to Use This Calculator</h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Choose Your Unit System</h4>
                        <p className="text-sm text-muted-foreground">
                          Select between metric (meters) or imperial (feet and inches) based on your preference 
                          and regional standards.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Enter Wall Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                          Measure and input the height and length (width) of the wall you plan to build. For accuracy, 
                          measure from the foundation to the desired wall height, and the full length of the wall section.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Specify Block Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                          Enter the dimensions of the concrete blocks you'll be using. Standard blocks are typically 
                          200mm × 400mm (8" × 16"), but sizes may vary. Check with your supplier for exact dimensions.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Add Optional Information</h4>
                        <p className="text-sm text-muted-foreground">
                          Enter the price per block to get a cost estimate, and toggle mortar estimation if you need 
                          to calculate mortar bags required for the project.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">5</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Review Results</h4>
                        <p className="text-sm text-muted-foreground">
                          The calculator automatically displays the number of blocks needed, total cost, and mortar 
                          bag estimation (if enabled). Results update instantly as you modify inputs.
                        </p>
                      </div>
                    </div>
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
                        Number of Blocks
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        The calculator uses this formula to determine blocks needed:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Number of Blocks = (Wall Height × Wall Width) ÷ (Block Height × Block Width)
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        This divides the total wall area by the area of a single block to determine quantity needed.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Total Cost
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Material cost is calculated as:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Total Cost = Number of Blocks × Price per Block
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Mortar Bags
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Mortar requirement is estimated using:
                      </p>
                      <div className="bg-background p-3 rounded border font-mono text-sm">
                        Mortar Bags = Number of Blocks ÷ 33.3
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        This is based on the rule of thumb that one 80 lb bag of mortar can lay approximately 33-35 blocks.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Standard Sizes */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Standard Concrete Block Sizes</h2>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Standard Block (Most Common)</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Metric:</span>
                          <span className="ml-2 font-mono">200mm × 400mm</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Imperial:</span>
                          <span className="ml-2 font-mono">8" × 16"</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Half Block</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Metric:</span>
                          <span className="ml-2 font-mono">200mm × 200mm</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Imperial:</span>
                          <span className="ml-2 font-mono">8" × 8"</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Jumbo Block</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Metric:</span>
                          <span className="ml-2 font-mono">300mm × 600mm</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Imperial:</span>
                          <span className="ml-2 font-mono">12" × 24"</span>
                        </div>
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
                        <h4 className="font-semibold mb-1">Add 5-10% Extra</h4>
                        <p className="text-sm text-muted-foreground">
                          Always order 5-10% more blocks than calculated to account for breakage, cuts, and errors. 
                          This prevents project delays and ensures you can complete the job without running short.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Check Block Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                          Actual block dimensions may differ slightly from nominal sizes. Verify exact dimensions 
                          with your supplier before ordering to ensure accurate calculations.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Consider Mortar Joints</h4>
                        <p className="text-sm text-muted-foreground">
                          Standard mortar joints are typically 10mm (3/8") thick. For walls with many openings 
                          (doors/windows), reduce the wall dimensions accordingly before calculating.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Mortar Mix Ratios</h4>
                        <p className="text-sm text-muted-foreground">
                          Standard mortar mix for concrete blocks is typically 1:3 or 1:4 (cement to sand). 
                          Consult local building codes for specific requirements in your area.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Foundation Requirements</h4>
                        <p className="text-sm text-muted-foreground">
                          Concrete block walls require a solid foundation. Ensure you have a proper concrete footing 
                          that's at least twice the width of the block and extends below the frost line.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Delivery and Storage</h4>
                        <p className="text-sm text-muted-foreground">
                          Store blocks on pallets, elevated off the ground, and covered to protect from moisture. 
                          Arrange delivery close to the work area to minimize handling and reduce breakage risk.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Common Applications */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Common Applications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Foundation Walls</h4>
                      <p className="text-sm text-muted-foreground">
                        Below-grade walls supporting structures, typically requiring reinforcement and waterproofing.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Retaining Walls</h4>
                      <p className="text-sm text-muted-foreground">
                        Walls holding back soil or water, often requiring drainage systems and structural engineering.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Load-Bearing Walls</h4>
                      <p className="text-sm text-muted-foreground">
                        Structural walls supporting roof or floor loads, requiring proper reinforcement and design.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Garden & Property Walls</h4>
                      <p className="text-sm text-muted-foreground">
                        Decorative or boundary walls, including raised garden beds and property line demarcation.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Important Notes */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Important Notes</h2>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                    <p className="text-sm">
                      <strong>Building Codes:</strong> Always check local building codes and regulations before starting 
                      construction. Many jurisdictions require permits and inspections for concrete block walls.
                    </p>
                    <p className="text-sm">
                      <strong>Structural Engineering:</strong> For walls over 4 feet high, retaining walls, or load-bearing 
                      applications, consult a structural engineer to ensure proper design and reinforcement.
                    </p>
                    <p className="text-sm">
                      <strong>Calculation Accuracy:</strong> This calculator provides estimates. Actual requirements may vary 
                      based on specific project conditions, block types, and construction methods.
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
