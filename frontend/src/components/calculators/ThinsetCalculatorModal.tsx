import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info, Calculator, RotateCcw, Printer, Share2, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

interface ThinsetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tile size presets with recommended thinset thickness
const tileSizePresets = [
  { size: '2x2', label: '2" x 2" (5 x 5 cm)', thickness: 2.0, thicknessImperial: 0.079 }, // 1/9"
  { size: '4x4', label: '4" x 4" (10 x 10 cm)', thickness: 2.4, thicknessImperial: 0.094 }, // 1/9"
  { size: '6x6', label: '6" x 6" (15 x 15 cm)', thickness: 3.0, thicknessImperial: 0.118 },
  { size: '8x8', label: '8" x 8" (20 x 20 cm)', thickness: 3.5, thicknessImperial: 0.138 }, // 1/8"
  { size: '12x12', label: '12" x 12" (30 x 30 cm)', thickness: 5.0, thicknessImperial: 0.197 }, // 1/5"
  { size: '16x16', label: '16" x 16" (40 x 40 cm)', thickness: 6.0, thicknessImperial: 0.236 },
  { size: 'large', label: 'Larger than 12" x 12"', thickness: 7.0, thicknessImperial: 0.276 }, // 1/4"
  { size: 'custom', label: 'Custom Thickness', thickness: 0, thicknessImperial: 0 },
];

const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const ThinsetCalculatorModal = ({ isOpen, onClose }: ThinsetCalculatorModalProps) => {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("imperial");
  const [areaLength, setAreaLength] = useState<string>("");
  const [areaWidth, setAreaWidth] = useState<string>("");
  const [tileSize, setTileSize] = useState<string>("12x12");
  const [customThickness, setCustomThickness] = useState<string>("");
  const [wastage, setWastage] = useState<string>("10");
  const [showMaterialDetails, setShowMaterialDetails] = useState(false);
  const [thinsetDensity, setThinsetDensity] = useState<string>("1600");
  const [dryMaterialPercent, setDryMaterialPercent] = useState<string>("50");
  const [costPerBag, setCostPerBag] = useState<string>("");
  const [weightPerBag, setWeightPerBag] = useState<string>("50");
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getThickness = () => {
    const preset = tileSizePresets.find(p => p.size === tileSize);
    if (!preset) return 0;
    
    if (tileSize === 'custom' && customThickness) {
      return parseFloat(customThickness);
    }
    
    return unitSystem === "metric" ? preset.thickness : preset.thicknessImperial;
  };

  const calculateResults = () => {
    const length = parseFloat(areaLength) || 0;
    const width = parseFloat(areaWidth) || 0;
    const thickness = getThickness();
    const wastagePercent = parseFloat(wastage) || 0;
    const density = parseFloat(thinsetDensity) || 1600;
    const dryPercent = parseFloat(dryMaterialPercent) || 50;
    const bagWeight = parseFloat(weightPerBag) || 50;
    const bagCost = parseFloat(costPerBag) || 0;

    if (length <= 0 || width <= 0 || thickness <= 0) {
      return null;
    }

    const area = length * width;
    
    // Calculate volume based on unit system
    let volume: number;
    if (unitSystem === "metric") {
      // area in m², thickness in mm -> volume in m³
      volume = area * (thickness / 1000);
    } else {
      // area in ft², thickness in inches -> volume in ft³
      volume = area * (thickness / 12);
    }

    const volumeWithWastage = volume * (1 + wastagePercent / 100);
    
    // Calculate weight (density in kg/m³ or lb/ft³)
    const weight = volumeWithWastage * density;
    
    // Calculate dry thinset required
    const dryThinset = weight * (dryPercent / 100);
    
    // Calculate number of bags
    const bagsNeeded = Math.ceil(dryThinset / bagWeight);
    
    // Calculate total cost
    const totalCost = bagsNeeded * bagCost;

    return {
      area,
      thickness,
      volume: volumeWithWastage,
      weight,
      dryThinset,
      bagsNeeded,
      totalCost,
    };
  };

  const results = calculateResults();

  const resetForm = () => {
    setAreaLength("");
    setAreaWidth("");
    setTileSize("12x12");
    setCustomThickness("");
    setWastage("10");
    setThinsetDensity("1600");
    setDryMaterialPercent("50");
    setCostPerBag("");
    setWeightPerBag("50");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      unitSystem,
      areaLength,
      areaWidth,
      tileSize,
      customThickness,
      wastage,
      thinsetDensity,
      dryMaterialPercent,
      costPerBag,
      weightPerBag,
    });
    
    const url = `${window.location.origin}${window.location.pathname}?thinset=${params.toString()}`;
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link copied!",
      description: "The calculator link has been copied to your clipboard.",
    });
  };

  const handleExportPDF = async () => {
    if (!resultsRef.current) return;

    const opt = {
      margin: 10,
      filename: 'thinset-calculation.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    try {
      await html2pdf().from(resultsRef.current).set(opt).save();
      toast({
        title: "PDF exported!",
        description: "Your calculation has been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Thinset Calculator
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Information</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6">
                {/* Unit System Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Unit System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="unit-toggle" className="text-sm">
                        {unitSystem === "metric" ? "Metric (m, cm, mm)" : "Imperial (ft, in)"}
                      </Label>
                      <Switch
                        id="unit-toggle"
                        checked={unitSystem === "metric"}
                        onCheckedChange={(checked) => setUnitSystem(checked ? "metric" : "imperial")}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Area Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Area to be Tiled</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="area-length">
                          Length ({unitSystem === "metric" ? "m" : "ft"})
                          <InfoTooltip content="Enter the length of the surface you want to tile" />
                        </Label>
                        <Input
                          id="area-length"
                          type="number"
                          min="0"
                          step="0.1"
                          value={areaLength}
                          onChange={(e) => setAreaLength(e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area-width">
                          Width ({unitSystem === "metric" ? "m" : "ft"})
                          <InfoTooltip content="Enter the width of the surface you want to tile" />
                        </Label>
                        <Input
                          id="area-width"
                          type="number"
                          min="0"
                          step="0.1"
                          value={areaWidth}
                          onChange={(e) => setAreaWidth(e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tile Size Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tile Size & Thinset Thickness</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tile-size">
                        Tile Size
                        <InfoTooltip content="Select your tile size for recommended thinset thickness" />
                      </Label>
                      <Select value={tileSize} onValueChange={setTileSize}>
                        <SelectTrigger id="tile-size">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tileSizePresets.map((preset) => (
                            <SelectItem key={preset.size} value={preset.size}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {tileSize === 'custom' && (
                      <div className="space-y-2">
                        <Label htmlFor="custom-thickness">
                          Custom Thickness ({unitSystem === "metric" ? "mm" : "inches"})
                          <InfoTooltip content="Enter your desired thinset thickness" />
                        </Label>
                        <Input
                          id="custom-thickness"
                          type="number"
                          min="0"
                          step="0.1"
                          value={customThickness}
                          onChange={(e) => setCustomThickness(e.target.value)}
                          placeholder="0.0"
                        />
                      </div>
                    )}

                    {tileSize !== 'custom' && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        Recommended thickness: {getThickness().toFixed(2)} {unitSystem === "metric" ? "mm" : "inches"}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Additional Parameters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wastage">
                        Wastage (%)
                        <InfoTooltip content="Recommended 10% to account for spillage and uneven surfaces" />
                      </Label>
                      <Input
                        id="wastage"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={wastage}
                        onChange={(e) => setWastage(e.target.value)}
                        placeholder="10"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <Label htmlFor="material-details-toggle" className="text-sm">
                        Show Material Details
                        <InfoTooltip content="Toggle to enter thinset density and dry material percentage" />
                      </Label>
                      <Switch
                        id="material-details-toggle"
                        checked={showMaterialDetails}
                        onCheckedChange={setShowMaterialDetails}
                      />
                    </div>

                    {showMaterialDetails && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="density">
                            Thinset Density ({unitSystem === "metric" ? "kg/m³" : "lb/ft³"})
                            <InfoTooltip content="Typical thinset density is around 1600 kg/m³ (100 lb/ft³)" />
                          </Label>
                          <Input
                            id="density"
                            type="number"
                            min="0"
                            step="1"
                            value={thinsetDensity}
                            onChange={(e) => setThinsetDensity(e.target.value)}
                            placeholder={unitSystem === "metric" ? "1600" : "100"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dry-percent">
                            Dry Material Percentage (%)
                            <InfoTooltip content="Typical dry content is 50% (the rest is water)" />
                          </Label>
                          <Input
                            id="dry-percent"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={dryMaterialPercent}
                            onChange={(e) => setDryMaterialPercent(e.target.value)}
                            placeholder="50"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Bag Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bag Details (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bag-weight">
                          Weight per Bag ({unitSystem === "metric" ? "kg" : "lb"})
                          <InfoTooltip content="Typical bag weight is 50 lb (23 kg)" />
                        </Label>
                        <Input
                          id="bag-weight"
                          type="number"
                          min="0"
                          step="1"
                          value={weightPerBag}
                          onChange={(e) => setWeightPerBag(e.target.value)}
                          placeholder={unitSystem === "metric" ? "23" : "50"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost-per-bag">
                          Cost per Bag ($)
                          <InfoTooltip content="Enter the cost of one bag of thinset for total cost estimate" />
                        </Label>
                        <Input
                          id="cost-per-bag"
                          type="number"
                          min="0"
                          step="0.01"
                          value={costPerBag}
                          onChange={(e) => setCostPerBag(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                {results && (
                  <Card ref={resultsRef} className="border-primary">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Calculation Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Total Area</p>
                          <p className="text-2xl font-bold">
                            {results.area.toFixed(2)} {unitSystem === "metric" ? "m²" : "ft²"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Thinset Thickness</p>
                          <p className="text-2xl font-bold">
                            {results.thickness.toFixed(2)} {unitSystem === "metric" ? "mm" : "in"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Required Volume (with wastage)</p>
                          <p className="text-xl font-semibold">
                            {unitSystem === "metric" 
                              ? `${results.volume.toFixed(4)} m³ (${(results.volume * 1000).toFixed(2)} liters)`
                              : `${results.volume.toFixed(4)} ft³ (${(results.volume * 7.48).toFixed(2)} gallons)`
                            }
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Estimated Weight</p>
                          <p className="text-xl font-semibold">
                            {results.weight.toFixed(2)} {unitSystem === "metric" ? "kg" : "lb"}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Dry Thinset Required</p>
                          <p className="text-xl font-semibold">
                            {results.dryThinset.toFixed(2)} {unitSystem === "metric" ? "kg" : "lb"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Number of Bags Needed</p>
                          <p className="text-2xl font-bold text-primary">
                            {results.bagsNeeded} bags
                          </p>
                        </div>
                      </div>

                      {costPerBag && parseFloat(costPerBag) > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
                            <p className="text-2xl font-bold text-primary">
                              ${results.totalCost.toFixed(2)}
                            </p>
                          </div>
                        </>
                      )}

                      <Separator />

                      <div className="flex gap-2">
                        <Button onClick={resetForm} variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                        <Button onClick={handlePrint} variant="outline" size="sm">
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button onClick={handleShare} variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button onClick={handleExportPDF} variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="guide">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6">
                {/* What is Thinset */}
                <Card>
                  <CardHeader>
                    <CardTitle>What is Thinset?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p>
                      <strong>Thinset</strong> (also called thin-set mortar or thinset adhesive) is a specialized cement-based 
                      adhesive used to bond tiles to surfaces. It's called "thin-set" because it's applied in a thin layer, 
                      typically 3-6mm thick, unlike traditional thick-bed mortar which can be several inches thick.
                    </p>
                    
                    <div className="bg-muted p-4 rounded-md space-y-2">
                      <p className="font-semibold">Key Differences: Thinset vs. Regular Mortar</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Thinset</strong>: Contains polymers for flexibility and stronger adhesion, applied in thin layers (3-7mm)</li>
                        <li><strong>Regular Mortar</strong>: Used for general masonry, applied much thicker, less flexible</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold">Modified vs. Unmodified Thinset:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong>Modified Thinset</strong>: Contains polymer additives for enhanced flexibility, water resistance, 
                        and bonding strength. Best for most applications including floors, showers, and outdoor projects.</li>
                        <li><strong>Unmodified Thinset</strong>: Pure cement-based without additives. Required when using certain 
                        types of tile (like natural stone) or waterproofing membranes that need to breathe.</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Important Note:</p>
                      <p className="text-blue-800 dark:text-blue-200 mt-1">
                        Always check the tile and substrate manufacturer's recommendations. Using the wrong type of thinset 
                        can void warranties and lead to tile failure.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Tile Size Matters */}
                <Card>
                  <CardHeader>
                    <CardTitle>Why Tile Size & Trowel Notch Matter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p>
                      The size of your tile directly determines how thick your thinset layer needs to be:
                    </p>
                    
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li><strong>Smaller tiles</strong> (2"×2" to 4"×4"): Require thinner thinset layers (2-3mm) because 
                      they're lighter and have less tendency to sag or slip</li>
                      <li><strong>Medium tiles</strong> (8"×8" to 12"×12"): Need moderate thickness (3-5mm) to ensure 
                      proper coverage and prevent lippage</li>
                      <li><strong>Large tiles</strong> (over 12"×12"): Require thicker thinset (6-8mm+) to accommodate 
                      surface irregularities and provide adequate support</li>
                    </ul>

                    <div className="bg-muted p-4 rounded-md">
                      <p className="font-semibold mb-2">Trowel Notch Size</p>
                      <p>
                        The trowel notch size determines how much thinset is applied. When you "comb" thinset with a notched 
                        trowel, the ridges collapse to about 50-70% of the notch depth when the tile is pressed down. This 
                        ensures proper coverage without excess material.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Thickness Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Thinset Thickness by Tile Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-semibold">Tile Size</th>
                            <th className="text-left p-2 font-semibold">Trowel Notch</th>
                            <th className="text-left p-2 font-semibold">Thickness (Imperial)</th>
                            <th className="text-left p-2 font-semibold">Thickness (Metric)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">2" × 2" (5 × 5 cm) and smaller</td>
                            <td className="p-2">3/16" × 5/32" (5 × 5 mm) V-notch</td>
                            <td className="p-2">1/9"</td>
                            <td className="p-2">2.0 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">4" × 4" (10 × 10 cm) and smaller</td>
                            <td className="p-2">1/4" × 3/16" (6 × 5 mm) V-notch</td>
                            <td className="p-2">1/9"</td>
                            <td className="p-2">2.4 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">8" × 8" (20 × 20 cm) and smaller</td>
                            <td className="p-2">1/4" × 1/4" (6 × 6 mm) square-notch</td>
                            <td className="p-2">1/8"</td>
                            <td className="p-2">3.5 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">8" × 8" (20 × 20 cm) and smaller</td>
                            <td className="p-2">1/4" × 5/16" (6 × 8 mm) U-notch</td>
                            <td className="p-2">1/7"</td>
                            <td className="p-2">4.0 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">12" × 12" (30 × 30 cm) and smaller</td>
                            <td className="p-2">1/4" × 3/8" (6 × 9.5 mm) square-notch</td>
                            <td className="p-2">1/5"</td>
                            <td className="p-2">5.0 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">12" × 12" (30 × 30 cm) and smaller</td>
                            <td className="p-2">1/4" × 3/8" (6 × 9.5 mm) U-notch</td>
                            <td className="p-2">1/5"</td>
                            <td className="p-2">5.0 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">12" × 12" (30 × 30 cm) and larger</td>
                            <td className="p-2">1/2" × 1/2" (13 × 13 mm) square-notch</td>
                            <td className="p-2">1/4"</td>
                            <td className="p-2">7.0 mm</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">12" × 12" (30 × 30 cm) and larger</td>
                            <td className="p-2">1/4" × 1/2" (6 × 12 mm) U-notch</td>
                            <td className="p-2">1/4"</td>
                            <td className="p-2">7.0 mm</td>
                          </tr>
                          <tr>
                            <td className="p-2">12" × 12" (30 × 30 cm) and larger</td>
                            <td className="p-2">3/4" × 5/8" (19 × 16 mm) U-notch</td>
                            <td className="p-2">1/3"</td>
                            <td className="p-2">8.0 mm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* How the Calculation Works */}
                <Card>
                  <CardHeader>
                    <CardTitle>How the Calculation Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">1. Calculate Area</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Area = Length × Width
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">2. Calculate Volume</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Volume = Area × Thickness
                        </code>
                        <p className="text-muted-foreground mt-1">
                          Note: Thickness is converted to the same unit as area (meters or feet)
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold">3. Add Wastage</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Volume with Wastage = Volume × (1 + Wastage%)
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">4. Calculate Weight</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Weight = Volume × Density
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">5. Calculate Dry Thinset</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Dry Thinset = Weight × (Dry Material %)
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">6. Calculate Bags Needed</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Bags = Ceiling(Dry Thinset ÷ Weight per Bag)
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">7. Calculate Total Cost</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Total Cost = Bags × Cost per Bag
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold">Q: How much thinset do I need per square foot?</p>
                      <p className="mt-1">
                        A: It depends on tile size and thinset thickness. For 12"×12" tiles with 5mm thickness, you need 
                        approximately 0.016 cubic feet (0.00045 m³) per square foot, or about 1.5-2 pounds of dry thinset 
                        per square foot with wastage.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Q: Should I always add 10% wastage?</p>
                      <p className="mt-1">
                        A: 10% is a good standard for flat, even surfaces. For uneven surfaces, complex layouts, or if you're 
                        inexperienced, consider 15-20% wastage to account for extra material usage and mistakes.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Q: Can I use the same thinset for walls and floors?</p>
                      <p className="mt-1">
                        A: While some thinsets work for both, floors typically require a stronger, more rigid thinset, while 
                        walls may benefit from a more flexible formula. Always check the product specifications for approved 
                        applications.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Q: How long does thinset take to cure?</p>
                      <p className="mt-1">
                        A: Thinset typically takes 24-48 hours to set enough for light foot traffic, but full cure can take 
                        up to 28 days. Wait at least 24 hours before grouting, and follow manufacturer instructions for your 
                        specific product.
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">Q: What if my substrate isn't perfectly level?</p>
                      <p className="mt-1">
                        A: Thinset is not meant to level surfaces. Floors should be level to within 1/4" over 10 feet. Use 
                        a self-leveling compound to fix major irregularities before tiling.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Always mix thinset to the consistency of peanut butter - not too wet, not too dry</li>
                      <li>Let mixed thinset "slake" (rest) for 5-10 minutes before use for better performance</li>
                      <li>Work in small sections (about 3-4 square feet at a time) to prevent thinset from skinning over</li>
                      <li>Achieve 95%+ coverage on floors and 80%+ on walls for proper adhesion</li>
                      <li>Use the "back-buttering" technique (applying thinset to both tile and substrate) for tiles over 8"×8"</li>
                      <li>Don't mix more thinset than you can use in 20-30 minutes</li>
                      <li>Clean tools immediately after use - dried thinset is very difficult to remove</li>
                      <li>Store unused dry thinset in a cool, dry place in a sealed container</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
