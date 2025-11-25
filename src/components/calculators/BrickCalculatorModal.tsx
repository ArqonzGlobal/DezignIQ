import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Calculator, CheckCircle2, Printer, Share2, Download, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

interface BrickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UnitSystem = "metric" | "imperial";

export const BrickCalculatorModal = ({ isOpen, onClose }: BrickCalculatorModalProps) => {
  const { currencySymbol } = useCurrency();
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  
  // Wall dimensions
  const [wallLength, setWallLength] = useState<string>("10");
  const [wallHeight, setWallHeight] = useState<string>("3");
  
  // Brick dimensions
  const [brickLength, setBrickLength] = useState<string>("0.19");
  const [brickHeight, setBrickHeight] = useState<string>("0.057");
  
  // Mortar and wastage
  const [mortarThickness, setMortarThickness] = useState<string>("0.01");
  const [wastagePercentage, setWastagePercentage] = useState<string>("10");
  
  // Cost inputs (optional)
  const [brickCostPer1000, setBrickCostPer1000] = useState<string>("500");
  const [mortarCostPerBag, setMortarCostPerBag] = useState<string>("15");
  
  // Results
  const [results, setResults] = useState({
    wallArea: 0,
    bricksNeeded: 0,
    bricksWithWastage: 0,
    mortarBags: 0,
    totalCost: 0,
  });

  // Update default values when unit system changes
  useEffect(() => {
    if (unitSystem === "imperial") {
      setWallLength("32.8");
      setWallHeight("9.8");
      setBrickLength("7.5");
      setBrickHeight("2.25");
      setMortarThickness("0.375");
    } else {
      setWallLength("10");
      setWallHeight("3");
      setBrickLength("0.19");
      setBrickHeight("0.057");
      setMortarThickness("0.01");
    }
  }, [unitSystem]);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [
    wallLength,
    wallHeight,
    brickLength,
    brickHeight,
    mortarThickness,
    wastagePercentage,
    brickCostPer1000,
    mortarCostPerBag,
    unitSystem,
  ]);

  const calculateResults = () => {
    try {
      const wLength = parseFloat(wallLength) || 0;
      const wHeight = parseFloat(wallHeight) || 0;
      const bLength = parseFloat(brickLength) || 0;
      const bHeight = parseFloat(brickHeight) || 0;
      const mThickness = parseFloat(mortarThickness) || 0;
      const wastage = parseFloat(wastagePercentage) || 0;

      // Convert imperial to metric for calculations if needed
      let wallLengthM = wLength;
      let wallHeightM = wHeight;
      let brickLengthM = bLength;
      let brickHeightM = bHeight;
      let mortarThicknessM = mThickness;

      if (unitSystem === "imperial") {
        wallLengthM = wLength * 0.3048; // ft to m
        wallHeightM = wHeight * 0.3048; // ft to m
        brickLengthM = bLength * 0.0254; // inches to m
        brickHeightM = bHeight * 0.0254; // inches to m
        mortarThicknessM = mThickness * 0.0254; // inches to m
      }

      // Calculate wall area
      const wallArea = wallLengthM * wallHeightM;

      // Calculate brick area including mortar joint
      const brickWithMortarLength = brickLengthM + mortarThicknessM;
      const brickWithMortarHeight = brickHeightM + mortarThicknessM;
      const brickArea = brickWithMortarLength * brickWithMortarHeight;

      // Calculate number of bricks needed
      const bricksNeeded = Math.ceil(wallArea / brickArea);
      
      // Apply wastage
      const bricksWithWastage = Math.ceil(bricksNeeded * (1 + wastage / 100));

      // Calculate mortar (rough estimate: 20% of wall volume)
      const mortarVolume = wallArea * mortarThicknessM * 1.2; // m³
      const mortarBags = Math.ceil(mortarVolume * 60); // Approx 60 bags per m³

      // Calculate costs
      const brickCost = (bricksWithWastage / 1000) * (parseFloat(brickCostPer1000) || 0);
      const mortarCost = mortarBags * (parseFloat(mortarCostPerBag) || 0);
      const totalCost = brickCost + mortarCost;

      setResults({
        wallArea: unitSystem === "metric" ? wallArea : wallArea * 10.7639, // Convert to ft² if imperial
        bricksNeeded,
        bricksWithWastage,
        mortarBags,
        totalCost,
      });
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleReset = () => {
    if (unitSystem === "imperial") {
      setWallLength("32.8");
      setWallHeight("9.8");
      setBrickLength("7.5");
      setBrickHeight("2.25");
      setMortarThickness("0.375");
    } else {
      setWallLength("10");
      setWallHeight("3");
      setBrickLength("0.19");
      setBrickHeight("0.057");
      setMortarThickness("0.01");
    }
    setWastagePercentage("10");
    setBrickCostPer1000("500");
    setMortarCostPerBag("15");
    toast({ title: "Calculator Reset", description: "All values have been reset to defaults." });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('wallLength', wallLength);
    url.searchParams.set('wallHeight', wallHeight);
    url.searchParams.set('brickLength', brickLength);
    url.searchParams.set('brickHeight', brickHeight);
    url.searchParams.set('mortarThickness', mortarThickness);
    url.searchParams.set('wastage', wastagePercentage);
    url.searchParams.set('unitSystem', unitSystem);
    
    navigator.clipboard.writeText(url.toString());
    toast({ title: "Link Copied", description: "Calculator link copied to clipboard!" });
  };

  const handleExportPDF = () => {
    const element = resultsRef.current;
    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'brick-calculator-results.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().from(element).set(opt).save();
    toast({ title: "PDF Generated", description: "Your results have been exported to PDF." });
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
            Brick Calculator
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
                      <Label htmlFor="wallLength">
                        Wall Length ({unitSystem === "metric" ? "m" : "ft"})
                        <InfoTooltip text="Enter the total length of the wall to be built." />
                      </Label>
                      <Input
                        id="wallLength"
                        type="number"
                        step="0.1"
                        min="0"
                        value={wallLength}
                        onChange={(e) => setWallLength(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wallHeight">
                        Wall Height ({unitSystem === "metric" ? "m" : "ft"})
                        <InfoTooltip text="Enter the height of the wall from ground level." />
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
                  </div>
                </div>

                <Separator />

                {/* Brick Dimensions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Brick Dimensions</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brickLength">
                        Brick Length ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Standard metric: 190mm (0.19m). Standard imperial: 7.5 inches." />
                      </Label>
                      <Input
                        id="brickLength"
                        type="number"
                        step={unitSystem === "metric" ? "0.001" : "0.125"}
                        min="0"
                        value={brickLength}
                        onChange={(e) => setBrickLength(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brickHeight">
                        Brick Height ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Standard metric: 57mm (0.057m). Standard imperial: 2.25 inches." />
                      </Label>
                      <Input
                        id="brickHeight"
                        type="number"
                        step={unitSystem === "metric" ? "0.001" : "0.125"}
                        min="0"
                        value={brickHeight}
                        onChange={(e) => setBrickHeight(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Mortar and Wastage */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Mortar and Wastage</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mortarThickness">
                        Mortar Joint Thickness ({unitSystem === "metric" ? "m" : "inches"})
                        <InfoTooltip text="Standard mortar joint is 10mm (0.01m) or 3/8 inch. Adjust based on your requirements." />
                      </Label>
                      <Input
                        id="mortarThickness"
                        type="number"
                        step={unitSystem === "metric" ? "0.001" : "0.0625"}
                        min="0"
                        value={mortarThickness}
                        onChange={(e) => setMortarThickness(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wastage">
                        Wastage (%)
                        <InfoTooltip text="Account for broken bricks and cutting waste. Typical range: 5-15%." />
                      </Label>
                      <Input
                        id="wastage"
                        type="number"
                        step="1"
                        min="0"
                        max="30"
                        value={wastagePercentage}
                        onChange={(e) => setWastagePercentage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Cost Estimation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Cost Estimation (Optional)</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brickCost">Cost per 1000 Bricks ({currencySymbol})</Label>
                      <Input
                        id="brickCost"
                        type="number"
                        step="10"
                        min="0"
                        value={brickCostPer1000}
                        onChange={(e) => setBrickCostPer1000(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mortarCost">Cost per Mortar Bag ({currencySymbol})</Label>
                      <Input
                        id="mortarCost"
                        type="number"
                        step="1"
                        min="0"
                        value={mortarCostPerBag}
                        onChange={(e) => setMortarCostPerBag(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div className="space-y-4" ref={resultsRef}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Calculation Results</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportPDF}>
                        <Download className="h-4 w-4 mr-1" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <CardTitle className="text-sm font-medium">Bricks Needed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.bricksNeeded}
                        </div>
                        <CardDescription className="mt-1">
                          Without wastage
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Bricks (with Wastage)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.bricksWithWastage}
                        </div>
                        <CardDescription className="mt-1">
                          +{wastagePercentage}% wastage allowance
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Mortar Bags</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {results.mortarBags}
                        </div>
                        <CardDescription className="mt-1">
                          Standard 50 lb bags
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
                          Materials only (excludes labor)
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
                  <h2 className="text-2xl font-bold mb-3">What is a Brick Calculator?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    A brick calculator is an essential construction tool that helps you accurately determine the number of bricks 
                    needed for your masonry project. Whether you're a professional builder planning a large construction project or 
                    a DIY enthusiast building a garden wall, this calculator eliminates guesswork and ensures you order the right 
                    quantity of materials, saving you time and money while preventing costly material shortages or excess waste.
                  </p>
                </section>

                <Separator />

                {/* How to Use */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">How to Use the Brick Calculator</h2>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold mb-1">Select Your Unit System</h4>
                        <p className="text-muted-foreground text-sm">Choose between metric (meters) or imperial (feet/inches) measurements based on your region and preference.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold mb-1">Enter Wall Dimensions</h4>
                        <p className="text-muted-foreground text-sm">Input the length and height of your wall. For irregular walls, calculate each section separately and add the totals.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold mb-1">Specify Brick Dimensions</h4>
                        <p className="text-muted-foreground text-sm">Enter your brick size. Standard sizes are pre-filled, but you can adjust them for custom or specialty bricks.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h4 className="font-semibold mb-1">Set Mortar Thickness</h4>
                        <p className="text-muted-foreground text-sm">Input the mortar joint thickness. Standard is 10mm (3/8 inch), but this can vary based on aesthetic preferences.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">5</div>
                      <div>
                        <h4 className="font-semibold mb-1">Add Wastage Percentage</h4>
                        <p className="text-muted-foreground text-sm">Account for broken bricks and cutting waste. We recommend 10% for professional work and 15% for DIY projects.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">6</div>
                      <div>
                        <h4 className="font-semibold mb-1">Optional: Enter Material Costs</h4>
                        <p className="text-muted-foreground text-sm">Add brick and mortar prices to get an instant material cost estimate for budgeting purposes.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Formulas */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Calculation Formulas Explained</h2>
                  
                  <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold mb-2">1. Wall Area Calculation</h4>
                      <code className="bg-background px-3 py-1 rounded text-sm">
                        Wall Area = Wall Length × Wall Height
                      </code>
                      <p className="text-muted-foreground text-sm mt-2">
                        This gives us the total surface area to be covered with bricks.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">2. Brick Coverage Area</h4>
                      <code className="bg-background px-3 py-1 rounded text-sm">
                        Brick Area = (Brick Length + Mortar Thickness) × (Brick Height + Mortar Thickness)
                      </code>
                      <p className="text-muted-foreground text-sm mt-2">
                        Each brick occupies space including its mortar joints on all sides.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">3. Number of Bricks</h4>
                      <code className="bg-background px-3 py-1 rounded text-sm">
                        Bricks Needed = Wall Area ÷ Brick Area
                      </code>
                      <p className="text-muted-foreground text-sm mt-2">
                        This tells us how many bricks fit in the wall area, rounded up to the nearest whole number.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">4. Wastage Adjustment</h4>
                      <code className="bg-background px-3 py-1 rounded text-sm">
                        Total Bricks = Bricks Needed × (1 + Wastage % ÷ 100)
                      </code>
                      <p className="text-muted-foreground text-sm mt-2">
                        Adding wastage ensures you have enough bricks to account for breakage and cuts.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Example Calculation */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Example Calculation</h2>
                  
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold">Scenario: Building a Garden Wall</h4>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Given:</strong></p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                        <li>Wall Length: 10 meters</li>
                        <li>Wall Height: 2 meters</li>
                        <li>Brick Size: 190mm × 57mm (standard metric)</li>
                        <li>Mortar Joint: 10mm</li>
                        <li>Wastage: 10%</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Step-by-Step Solution:</strong></p>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                        <li>
                          <strong>Calculate wall area:</strong>
                          <div className="ml-6 mt-1">10m × 2m = 20 m²</div>
                        </li>
                        <li>
                          <strong>Calculate brick coverage area:</strong>
                          <div className="ml-6 mt-1">(0.19m + 0.01m) × (0.057m + 0.01m) = 0.2m × 0.067m = 0.0134 m²</div>
                        </li>
                        <li>
                          <strong>Calculate bricks needed:</strong>
                          <div className="ml-6 mt-1">20 m² ÷ 0.0134 m² = 1,493 bricks</div>
                        </li>
                        <li>
                          <strong>Add wastage (10%):</strong>
                          <div className="ml-6 mt-1">1,493 × 1.10 = 1,642 bricks</div>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="bg-background p-3 rounded mt-3">
                      <p className="font-semibold text-primary">
                        <CheckCircle2 className="inline h-4 w-4 mr-1" />
                        Final Answer: Order 1,642 bricks
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Benefits */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Benefits of Using This Calculator</h2>
                  
                  <div className="grid gap-3">
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Accurate Material Estimation</h4>
                        <p className="text-sm text-muted-foreground">Eliminate guesswork and order the exact quantity needed, reducing waste and saving money.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Time Savings</h4>
                        <p className="text-sm text-muted-foreground">Get instant calculations instead of manual arithmetic, allowing you to focus on planning and execution.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Cost Control</h4>
                        <p className="text-sm text-muted-foreground">Get accurate cost estimates upfront, helping you stay within budget and avoid surprise expenses.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Professional Results</h4>
                        <p className="text-sm text-muted-foreground">Proper planning leads to better project outcomes, whether you're a professional or DIY builder.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Flexible Units</h4>
                        <p className="text-sm text-muted-foreground">Work in metric or imperial units based on your location and material specifications.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">Avoid Material Shortages</h4>
                        <p className="text-sm text-muted-foreground">Built-in wastage calculations ensure you won't run short mid-project, avoiding costly delays.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Tips and Assumptions */}
                <section>
                  <h2 className="text-2xl font-bold mb-3">Tips and Important Assumptions</h2>
                  
                  <div className="space-y-3">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Mortar Joint Thickness
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Standard mortar joints are typically 10mm (3/8 inch). However, aesthetic choices may require thicker or 
                        thinner joints. Thicker joints require more mortar but fewer bricks, while thinner joints are structurally 
                        stronger but require more bricks and precision.
                      </p>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Wastage Recommendations
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Professional builders typically use 5-10% wastage, while DIY projects should account for 10-15% wastage 
                        due to higher breakage rates and learning curves. Complex patterns or extensive cutting may require up to 20% wastage.
                      </p>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Brick Size Variations
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        This calculator uses face dimensions of bricks. Standard sizes vary by region: UK standard is 215mm × 65mm, 
                        US standard is 8" × 2.25", and metric standard is 190mm × 57mm. Always verify your specific brick dimensions 
                        with your supplier before ordering.
                      </p>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Windows and Doors
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        This calculator assumes a solid wall. If your wall has windows or doors, calculate the total wall area first, 
                        then calculate and subtract the area of openings. The calculator will then give you the net brick requirement.
                      </p>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Mortar Estimation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        The mortar bag calculation is approximate and assumes standard 50 lb bags. Actual mortar consumption varies 
                        based on joint thickness, brick porosity, and mixing ratios. Consult with your supplier for precise mortar requirements.
                      </p>
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Buy Extra for Future Repairs
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Consider ordering 5% extra bricks beyond the wastage allowance for future repairs or modifications. 
                        Brick colors and textures can vary between batches, so having matching bricks on hand is valuable for long-term maintenance.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                {/* Call to Action */}
                <section className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h2 className="text-2xl font-bold mb-3">Ready to Start Your Brick Project?</h2>
                  <p className="text-muted-foreground mb-4">
                    Use our brick calculator to get accurate material estimates and take the guesswork out of your construction planning. 
                    Whether you're building a small garden wall or a large commercial structure, precise calculations are the foundation 
                    of successful project management.
                  </p>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <p>Switch to the Calculator tab above to start calculating your brick requirements now!</p>
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
