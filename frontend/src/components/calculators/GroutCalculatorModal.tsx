import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Printer, Share2, Download } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import groutImg from "@/assets/calculators/grout-calculator.png";

interface GroutCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const GroutCalculatorModal = ({ isOpen, onClose }: GroutCalculatorModalProps) => {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Unit system
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');
  
  // Input states
  const [areaLength, setAreaLength] = useState<string>("10");
  const [areaWidth, setAreaWidth] = useState<string>("10");
  const [tileLength, setTileLength] = useState<string>("12");
  const [tileWidth, setTileWidth] = useState<string>("12");
  const [gapWidth, setGapWidth] = useState<string>("0.125");
  const [gapDepth, setGapDepth] = useState<string>("0.375");
  
  // Optional material details
  const [showMaterialDetails, setShowMaterialDetails] = useState(false);
  const [groutDensity, setGroutDensity] = useState<string>("100"); // lb/ft³ or kg/m³
  const [dryMaterialPercent, setDryMaterialPercent] = useState<string>("50");
  const [bagSize, setBagSize] = useState<string>("10"); // lb or kg

  // Calculations
  const results = useMemo(() => {
    const L = parseFloat(areaLength) || 0;
    const W = parseFloat(areaWidth) || 0;
    const l = parseFloat(tileLength) || 0;
    const w = parseFloat(tileWidth) || 0;
    const g = parseFloat(gapWidth) || 0;
    const d = parseFloat(gapDepth) || 0;

    if (L <= 0 || W <= 0 || l <= 0 || w <= 0 || g < 0 || d <= 0) {
      return {
        surfaceArea: 0,
        groutArea: 0,
        groutVolume: 0,
        groutWeight: 0,
        bagsNeeded: 0,
        valid: false
      };
    }

    // Convert everything to consistent units for calculation
    let calcL = L, calcW = W, calcL_tile = l, calcW_tile = w, calcG = g, calcD = d;
    
    if (unitSystem === 'imperial') {
      // Convert inches to feet for tile dimensions and gaps
      calcL_tile = l / 12;
      calcW_tile = w / 12;
      calcG = g / 12;
      calcD = d / 12;
    }

    // Calculate surface area
    const surfaceArea = calcL * calcW;

    // Calculate ratio R = (l + g) × (w + g) / (l × w)
    const R = ((calcL_tile + calcG) * (calcW_tile + calcG)) / (calcL_tile * calcW_tile);

    // Calculate grout area = A_surface - (A_surface / R)
    const groutArea = surfaceArea - (surfaceArea / R);

    // Calculate grout volume = grout area × gap depth
    const groutVolume = groutArea * calcD;

    // Convert volume to display units (liters for metric, cubic feet for imperial)
    let displayVolume = groutVolume;
    let volumeUnit = unitSystem === 'metric' ? 'liters' : 'cubic feet';
    
    if (unitSystem === 'metric') {
      // m³ to liters
      displayVolume = groutVolume * 1000;
    }

    // Calculate weight
    const density = parseFloat(groutDensity) || (unitSystem === 'metric' ? 1600 : 100);
    let groutWeight = 0;
    
    if (showMaterialDetails) {
      if (unitSystem === 'metric') {
        // density in kg/m³, volume in m³
        groutWeight = groutVolume * density;
      } else {
        // density in lb/ft³, volume in ft³
        groutWeight = groutVolume * density;
      }
    }

    // Calculate bags needed
    let bagsNeeded = 0;
    if (showMaterialDetails) {
      const size = parseFloat(bagSize) || 10;
      const dryPercent = (parseFloat(dryMaterialPercent) || 50) / 100;
      const effectiveMaterialPerBag = size * dryPercent;
      bagsNeeded = Math.ceil(groutWeight / effectiveMaterialPerBag);
    }

    return {
      surfaceArea,
      groutArea,
      groutVolume: displayVolume,
      volumeUnit,
      groutWeight,
      bagsNeeded,
      valid: true
    };
  }, [areaLength, areaWidth, tileLength, tileWidth, gapWidth, gapDepth, unitSystem, showMaterialDetails, groutDensity, dryMaterialPercent, bagSize]);

  const handleReset = () => {
    setAreaLength("10");
    setAreaWidth("10");
    setTileLength("12");
    setTileWidth("12");
    setGapWidth("0.125");
    setGapDepth("0.375");
    setShowMaterialDetails(false);
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Your results are ready to print",
    });
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      areaLength,
      areaWidth,
      tileLength,
      tileWidth,
      gapWidth,
      gapDepth,
      unitSystem,
      showMaterialDetails: showMaterialDetails.toString(),
      groutDensity,
      dryMaterialPercent,
      bagSize,
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?calculator=grout&${params.toString()}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    });
  };

  const handleExportPDF = async () => {
    if (!resultsRef.current) return;

    const opt = {
      margin: 0.5,
      filename: 'grout-calculator-results.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(resultsRef.current).save();
      toast({
        title: "PDF Exported!",
        description: "Your results have been saved as PDF",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Grout Calculator</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Information</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 py-4">
                {/* Unit System Toggle */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Unit System</Label>
                    <div className="flex items-center gap-2">
                      <span className={unitSystem === 'imperial' ? 'font-semibold' : 'text-muted-foreground'}>
                        Imperial (ft/in)
                      </span>
                      <Switch
                        checked={unitSystem === 'metric'}
                        onCheckedChange={(checked) => setUnitSystem(checked ? 'metric' : 'imperial')}
                      />
                      <span className={unitSystem === 'metric' ? 'font-semibold' : 'text-muted-foreground'}>
                        Metric (m/cm)
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Surface Area Inputs */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Surface to be Tiled</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="areaLength">
                        Area Length (L)
                        <InfoTooltip content="Enter the length of the surface you want to tile" />
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="areaLength"
                          type="number"
                          value={areaLength}
                          onChange={(e) => setAreaLength(e.target.value)}
                          placeholder="10"
                          min="0"
                          step="0.1"
                        />
                        <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                          {unitSystem === 'metric' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="areaWidth">
                        Area Width (W)
                        <InfoTooltip content="Enter the width of the surface you want to tile" />
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="areaWidth"
                          type="number"
                          value={areaWidth}
                          onChange={(e) => setAreaWidth(e.target.value)}
                          placeholder="10"
                          min="0"
                          step="0.1"
                        />
                        <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                          {unitSystem === 'metric' ? 'm' : 'ft'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Tile Dimensions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tile Dimensions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tileLength">
                        Tile Length (l)
                        <InfoTooltip content="Enter the length of a single tile" />
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="tileLength"
                          type="number"
                          value={tileLength}
                          onChange={(e) => setTileLength(e.target.value)}
                          placeholder="12"
                          min="0"
                          step="0.1"
                        />
                        <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                          {unitSystem === 'metric' ? 'cm' : 'in'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tileWidth">
                        Tile Width (w)
                        <InfoTooltip content="Enter the width of a single tile" />
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="tileWidth"
                          type="number"
                          value={tileWidth}
                          onChange={(e) => setTileWidth(e.target.value)}
                          placeholder="12"
                          min="0"
                          step="0.1"
                        />
                        <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                          {unitSystem === 'metric' ? 'cm' : 'in'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Gap Settings */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Gap Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gapWidth">
                        Gap Width (g)
                        <InfoTooltip content="The spacing between tiles - typically 1/8 to 1/4 inch (3-6mm)" />
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="gapWidth"
                          type="number"
                          value={gapWidth}
                          onChange={(e) => setGapWidth(e.target.value)}
                          placeholder="0.125"
                          min="0"
                          step="0.001"
                        />
                        <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                          {unitSystem === 'metric' ? 'cm' : 'in'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gapDepth">
                        Gap Depth (d)
                        <InfoTooltip content="The depth of the grout joint - typically the tile thickness minus 1/8 inch" />
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="gapDepth"
                          type="number"
                          value={gapDepth}
                          onChange={(e) => setGapDepth(e.target.value)}
                          placeholder="0.375"
                          min="0"
                          step="0.001"
                        />
                        <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                          {unitSystem === 'metric' ? 'cm' : 'in'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Material Details */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="showMaterial" className="text-base font-semibold cursor-pointer">
                      Material Details (Optional)
                      <InfoTooltip content="Enable to calculate number of bags and weight needed" />
                    </Label>
                    <Switch
                      id="showMaterial"
                      checked={showMaterialDetails}
                      onCheckedChange={setShowMaterialDetails}
                    />
                  </div>

                  {showMaterialDetails && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="groutDensity">
                            Grout Density
                            <InfoTooltip content="Typical density: 100 lb/ft³ (1600 kg/m³)" />
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="groutDensity"
                              type="number"
                              value={groutDensity}
                              onChange={(e) => setGroutDensity(e.target.value)}
                              placeholder={unitSystem === 'metric' ? '1600' : '100'}
                              min="0"
                            />
                            <span className="flex items-center text-xs text-muted-foreground min-w-[60px]">
                              {unitSystem === 'metric' ? 'kg/m³' : 'lb/ft³'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="dryPercent">
                            Dry Material %
                            <InfoTooltip content="Percentage of dry material in the mix - typically 50%" />
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="dryPercent"
                              type="number"
                              value={dryMaterialPercent}
                              onChange={(e) => setDryMaterialPercent(e.target.value)}
                              placeholder="50"
                              min="0"
                              max="100"
                            />
                            <span className="flex items-center text-sm text-muted-foreground">%</span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bagSize">
                            Bag Size
                            <InfoTooltip content="Standard bag size - typically 10-25 lbs or 5-10 kg" />
                          </Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="bagSize"
                              type="number"
                              value={bagSize}
                              onChange={(e) => setBagSize(e.target.value)}
                              placeholder="10"
                              min="0"
                            />
                            <span className="flex items-center text-sm text-muted-foreground min-w-[40px]">
                              {unitSystem === 'metric' ? 'kg' : 'lb'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Results */}
                {results.valid && (
                  <Card className="p-6 bg-primary/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Results</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleReset}>
                          Reset
                        </Button>
                      </div>
                    </div>
                    
                    <div ref={resultsRef} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Surface Area</p>
                          <p className="text-2xl font-bold">
                            {results.surfaceArea.toFixed(2)} {unitSystem === 'metric' ? 'm²' : 'ft²'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Grout Area</p>
                          <p className="text-2xl font-bold">
                            {results.groutArea.toFixed(2)} {unitSystem === 'metric' ? 'm²' : 'ft²'}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm text-muted-foreground">Grout Volume Needed</p>
                        <p className="text-3xl font-bold text-primary">
                          {results.groutVolume.toFixed(3)} {results.volumeUnit}
                        </p>
                      </div>

                      {showMaterialDetails && (
                        <>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Grout Weight</p>
                              <p className="text-xl font-semibold">
                                {results.groutWeight.toFixed(2)} {unitSystem === 'metric' ? 'kg' : 'lb'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Bags Needed</p>
                              <p className="text-xl font-semibold text-primary">
                                {results.bagsNeeded} bags
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrint}
                          className="flex items-center gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          Print Results
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportPDF}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export to PDF
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="guide">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 py-4">
                {/* What is Grout */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">What is Grout?</h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      Grout is a dense fluid material used to fill gaps between tiles. It serves multiple important purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li><strong>Sealing joints:</strong> Prevents dirt and liquid from penetrating between tiles</li>
                      <li><strong>Structural support:</strong> Locks tiles in place and prevents movement</li>
                      <li><strong>Aesthetic finish:</strong> Creates clean, professional-looking lines between tiles</li>
                      <li><strong>Flexibility:</strong> Accommodates minor tile movement and prevents cracking</li>
                    </ul>
                    
                    <div className="bg-muted p-4 rounded-lg mt-4">
                      <h4 className="font-semibold mb-2">Common Grout Types:</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>Sanded Grout:</strong> For joints wider than 1/8 inch</li>
                        <li>• <strong>Unsanded Grout:</strong> For joints 1/8 inch or narrower</li>
                        <li>• <strong>Epoxy Grout:</strong> Stain-resistant, ideal for kitchens and bathrooms</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                {/* How the Formula Works */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">How the Calculation Works</h3>
                  <div className="space-y-4 text-sm">
                    <p>The grout calculator uses a precise mathematical formula to determine grout requirements:</p>
                    
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div>
                        <p className="font-semibold">Step 1: Calculate the Ratio (R)</p>
                        <code className="text-xs block mt-1">R = (tile_length + gap) × (tile_width + gap) ÷ (tile_length × tile_width)</code>
                        <p className="text-xs mt-1 text-muted-foreground">
                          This ratio accounts for the extra area needed when gaps are included
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">Step 2: Calculate Grout Area</p>
                        <code className="text-xs block mt-1">Grout Area = Surface Area - (Surface Area ÷ R)</code>
                        <p className="text-xs mt-1 text-muted-foreground">
                          This gives the total area covered by grout joints
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">Step 3: Calculate Grout Volume</p>
                        <code className="text-xs block mt-1">Grout Volume = Grout Area × Gap Depth</code>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Multiply by depth to get the three-dimensional volume needed
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">Step 4: Calculate Bags (Optional)</p>
                        <code className="text-xs block mt-1">Weight = Volume × Density</code>
                        <code className="text-xs block mt-1">Bags = Weight ÷ (Bag Size × Dry Material %)</code>
                        <p className="text-xs mt-1 text-muted-foreground">
                          Accounts for material density and dry content percentage
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Visual Guide */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Understanding Measurements</h3>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Gap Width (g):</p>
                      <p className="text-sm">
                        The space between tiles. Common sizes: 1/8 inch (3mm), 3/16 inch (5mm), or 1/4 inch (6mm).
                        Larger tiles often need wider gaps.
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Gap Depth (d):</p>
                      <p className="text-sm">
                        How deep the grout goes. Typically the tile thickness minus 1/8 inch to avoid grout showing
                        through thin tiles. Standard: 3/8 inch (9.5mm) for floor tiles.
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-semibold mb-2">Tile Layout Example:</p>
                      <div className="grid grid-cols-3 gap-1 w-48 mx-auto my-4">
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                        <div className="aspect-square bg-primary/20 border-2 border-primary"></div>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        Tiles (colored) with grout lines (gaps) between them
                      </p>
                    </div>
                  </div>
                </Card>

                {/* FAQs */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold">How much grout do I need per square foot?</p>
                      <p className="text-muted-foreground mt-1">
                        It depends on tile size, gap width, and gap depth. For 12×12 inch tiles with 1/8 inch gaps
                        at 3/8 inch depth, you need approximately 0.05 lb per square foot. Use the calculator for
                        precise measurements.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Should I buy extra grout?</p>
                      <p className="text-muted-foreground mt-1">
                        Yes! Always purchase 10-15% extra grout to account for waste, mixing errors, and future repairs.
                        It's also good to have leftover grout for touch-ups.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">What gap width should I use?</p>
                      <p className="text-muted-foreground mt-1">
                        Smaller tiles (under 12 inches): 1/8 inch gaps<br />
                        Medium tiles (12-18 inches): 3/16 inch gaps<br />
                        Large tiles (over 18 inches): 1/4 inch gaps
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">How deep should grout be?</p>
                      <p className="text-muted-foreground mt-1">
                        For floor tiles, grout should be at least 3/8 inch deep (half the thickness of the tile).
                        For wall tiles, 1/4 to 3/8 inch is typical. Never fill gaps completely to the bottom—leave
                        space for tile adhesive.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Sanded or unsanded grout?</p>
                      <p className="text-muted-foreground mt-1">
                        Use unsanded for gaps 1/8 inch or less (prevents scratching). Use sanded for gaps wider
                        than 1/8 inch (provides strength and prevents shrinking).
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Tips */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Professional Tips</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <p>Always use tile spacers to ensure consistent gap widths</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <p>Mix grout in small batches to prevent premature drying</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <p>Allow tiles to set for 24-48 hours before grouting</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <p>Seal grout after it cures (3-7 days) to prevent staining</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <p>Work in small sections (about 10 sq ft at a time)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓</span>
                      <p>Clean excess grout immediately with a damp sponge</p>
                    </div>
                  </div>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
