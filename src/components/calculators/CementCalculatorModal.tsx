import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Printer, Share2, Download, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import cementMixingRatios from "@/assets/calculators/cement-mixing-ratios.jpg";
import cementApplications from "@/assets/calculators/cement-applications.jpg";

interface CementCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MixGrade = "M5" | "M7.5" | "M10" | "M15" | "M20" | "M25" | "M30";
type QuantityType = "volume" | "area";
type UnitSystem = "metric" | "imperial";

interface MixRatio {
  cement: number;
  sand: number;
  aggregate: number;
  waterCementRatio: number;
}

const mixRatios: Record<MixGrade, MixRatio> = {
  "M5": { cement: 1, sand: 5, aggregate: 10, waterCementRatio: 0.6 },
  "M7.5": { cement: 1, sand: 4, aggregate: 8, waterCementRatio: 0.6 },
  "M10": { cement: 1, sand: 3, aggregate: 6, waterCementRatio: 0.55 },
  "M15": { cement: 1, sand: 2, aggregate: 4, waterCementRatio: 0.55 },
  "M20": { cement: 1, sand: 1.5, aggregate: 3, waterCementRatio: 0.5 },
  "M25": { cement: 1, sand: 1, aggregate: 2, waterCementRatio: 0.5 },
  "M30": { cement: 1, sand: 1, aggregate: 1.5, waterCementRatio: 0.45 },
};

export const CementCalculatorModal = ({ isOpen, onClose }: CementCalculatorModalProps) => {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  const [mixGrade, setMixGrade] = useState<MixGrade>("M20");
  const [quantityType, setQuantityType] = useState<QuantityType>("volume");
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  
  // Volume inputs
  const [volume, setVolume] = useState<string>("1");
  
  // Area inputs
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("10");
  const [thickness, setThickness] = useState<string>("0.15");
  
  // Advanced options
  const [dryVolumeMultiplier, setDryVolumeMultiplier] = useState<string>("1.54");
  const [waterCementRatio, setWaterCementRatio] = useState<string>("0.5");
  const [wastagePercentage, setWastagePercentage] = useState<string>("5");
  
  // Cost inputs (optional)
  const [cementCostPerBag, setCementCostPerBag] = useState<string>("8");
  const [sandCostPerUnit, setSandCostPerUnit] = useState<string>("50");
  const [aggregateCostPerUnit, setAggregateCostPerUnit] = useState<string>("60");
  
  // Results
  const [results, setResults] = useState({
    totalVolume: 0,
    cementKg: 0,
    cementBags: 0,
    sandVolume: 0,
    aggregateVolume: 0,
    waterLiters: 0,
    totalCost: 0,
  });

  // Update water-cement ratio when mix grade changes
  useEffect(() => {
    setWaterCementRatio(mixRatios[mixGrade].waterCementRatio.toString());
  }, [mixGrade]);

  // Calculate results whenever inputs change
  useEffect(() => {
    calculateResults();
  }, [
    mixGrade,
    quantityType,
    volume,
    length,
    width,
    thickness,
    dryVolumeMultiplier,
    waterCementRatio,
    wastagePercentage,
    cementCostPerBag,
    sandCostPerUnit,
    aggregateCostPerUnit,
    unitSystem,
  ]);

  const calculateResults = () => {
    try {
      // Calculate total volume
      let totalVolume = 0;
      if (quantityType === "volume") {
        totalVolume = parseFloat(volume) || 0;
      } else {
        const l = parseFloat(length) || 0;
        const w = parseFloat(width) || 0;
        const t = parseFloat(thickness) || 0;
        
        if (unitSystem === "metric") {
          totalVolume = l * w * t; // m³
        } else {
          // Convert ft² × inches to m³
          const areaM2 = (l * w) * 0.092903; // ft² to m²
          const thicknessM = t * 0.0254; // inches to meters
          totalVolume = areaM2 * thicknessM;
        }
      }

      // Apply wastage
      const wastage = parseFloat(wastagePercentage) || 0;
      totalVolume = totalVolume * (1 + wastage / 100);

      // Calculate dry volume
      const dryMultiplier = parseFloat(dryVolumeMultiplier) || 1.54;
      const dryVolume = totalVolume * dryMultiplier;

      // Get mix ratio
      const ratio = mixRatios[mixGrade];
      const totalParts = ratio.cement + ratio.sand + ratio.aggregate;

      // Calculate individual volumes
      const cementVolume = (dryVolume * ratio.cement) / totalParts;
      const sandVolume = (dryVolume * ratio.sand) / totalParts;
      const aggregateVolume = (dryVolume * ratio.aggregate) / totalParts;

      // Calculate cement in kg (density of cement ≈ 1440 kg/m³)
      const cementKg = cementVolume * 1440;
      const cementBags = cementKg / 50; // 50 kg per bag

      // Calculate water (using water-cement ratio)
      const wcRatio = parseFloat(waterCementRatio) || 0.5;
      const waterLiters = cementKg * wcRatio;

      // Calculate costs
      const cementCost = cementBags * (parseFloat(cementCostPerBag) || 0);
      const sandCost = sandVolume * (parseFloat(sandCostPerUnit) || 0);
      const aggregateCost = aggregateVolume * (parseFloat(aggregateCostPerUnit) || 0);
      const totalCost = cementCost + sandCost + aggregateCost;

      setResults({
        totalVolume,
        cementKg,
        cementBags,
        sandVolume,
        aggregateVolume,
        waterLiters,
        totalCost,
      });
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handleReset = () => {
    setMixGrade("M20");
    setQuantityType("volume");
    setVolume("1");
    setLength("10");
    setWidth("10");
    setThickness("0.15");
    setDryVolumeMultiplier("1.54");
    setWaterCementRatio("0.5");
    setWastagePercentage("5");
    setCementCostPerBag("8");
    setSandCostPerUnit("50");
    setAggregateCostPerUnit("60");
    toast({ title: "Calculator Reset", description: "All values have been reset to defaults." });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mixGrade', mixGrade);
    url.searchParams.set('quantityType', quantityType);
    if (quantityType === 'volume') {
      url.searchParams.set('volume', volume);
    } else {
      url.searchParams.set('length', length);
      url.searchParams.set('width', width);
      url.searchParams.set('thickness', thickness);
    }
    
    navigator.clipboard.writeText(url.toString());
    toast({ title: "Link Copied", description: "Calculator link copied to clipboard!" });
  };

  const handleExportPDF = () => {
    const element = resultsRef.current;
    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'cement-calculator-results.pdf',
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Cement Calculator</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 p-1">
            {/* Mix Grade Selection */}
            <div className="space-y-2">
              <Label htmlFor="mixGrade">
                Concrete Mix Grade
                <InfoTooltip text="M20 (1:1.5:3) is commonly used for residential construction. Higher grades are stronger but use more cement." />
              </Label>
              <Select value={mixGrade} onValueChange={(value) => setMixGrade(value as MixGrade)}>
                <SelectTrigger id="mixGrade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M5">M5 (1:5:10)</SelectItem>
                  <SelectItem value="M7.5">M7.5 (1:4:8)</SelectItem>
                  <SelectItem value="M10">M10 (1:3:6)</SelectItem>
                  <SelectItem value="M15">M15 (1:2:4)</SelectItem>
                  <SelectItem value="M20">M20 (1:1.5:3) - Recommended</SelectItem>
                  <SelectItem value="M25">M25 (1:1:2)</SelectItem>
                  <SelectItem value="M30">M30 (1:1:1.5)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Ratio - Cement : Sand : Aggregate = 1 : {mixRatios[mixGrade].sand} : {mixRatios[mixGrade].aggregate}
              </p>
            </div>

            <Separator />

            {/* Unit System */}
            <div className="space-y-2">
              <Label>Unit System</Label>
              <RadioGroup value={unitSystem} onValueChange={(value) => setUnitSystem(value as UnitSystem)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric" className="font-normal cursor-pointer">Metric (m, m³)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial" className="font-normal cursor-pointer">Imperial (ft, ft³)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quantity Type */}
            <div className="space-y-2">
              <Label>Calculation Method</Label>
              <RadioGroup value={quantityType} onValueChange={(value) => setQuantityType(value as QuantityType)} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="volume" id="volume" />
                  <Label htmlFor="volume" className="font-normal cursor-pointer">Direct Volume</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="area" id="area" />
                  <Label htmlFor="area" className="font-normal cursor-pointer">Area + Thickness</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Volume or Area Inputs */}
            {quantityType === "volume" ? (
              <div className="space-y-2">
                <Label htmlFor="volume">
                  Volume ({unitSystem === "metric" ? "m³" : "ft³"})
                  <InfoTooltip text="Enter the total volume of concrete required." />
                </Label>
                <Input
                  id="volume"
                  type="number"
                  step="0.01"
                  min="0"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="1.0"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length ({unitSystem === "metric" ? "m" : "ft"})</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width ({unitSystem === "metric" ? "m" : "ft"})</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thickness">
                    Thickness ({unitSystem === "metric" ? "m" : "inches"})
                  </Label>
                  <Input
                    id="thickness"
                    type="number"
                    step={unitSystem === "metric" ? "0.01" : "0.25"}
                    min="0"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                    placeholder={unitSystem === "metric" ? "0.15" : "6"}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Advanced Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Advanced Options</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dryVolume">
                    Dry Volume Multiplier
                    <InfoTooltip text="Accounts for voids and compaction. Standard value is 1.54." />
                  </Label>
                  <Input
                    id="dryVolume"
                    type="number"
                    step="0.01"
                    min="1"
                    max="2"
                    value={dryVolumeMultiplier}
                    onChange={(e) => setDryVolumeMultiplier(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waterCement">
                    Water-Cement Ratio
                    <InfoTooltip text="Lower ratios produce stronger concrete but are less workable." />
                  </Label>
                  <Input
                    id="waterCement"
                    type="number"
                    step="0.05"
                    min="0.3"
                    max="0.7"
                    value={waterCementRatio}
                    onChange={(e) => setWaterCementRatio(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wastage">
                    Wastage (%)
                    <InfoTooltip text="Additional material to account for spillage and waste. Typical range: 5-10%." />
                  </Label>
                  <Input
                    id="wastage"
                    type="number"
                    step="1"
                    min="0"
                    max="20"
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
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cementCost">Cost per Cement Bag ($)</Label>
                  <Input
                    id="cementCost"
                    type="number"
                    step="0.1"
                    min="0"
                    value={cementCostPerBag}
                    onChange={(e) => setCementCostPerBag(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sandCost">Cost per m³ Sand ($)</Label>
                  <Input
                    id="sandCost"
                    type="number"
                    step="1"
                    min="0"
                    value={sandCostPerUnit}
                    onChange={(e) => setSandCostPerUnit(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aggregateCost">Cost per m³ Aggregate ($)</Label>
                  <Input
                    id="aggregateCost"
                    type="number"
                    step="1"
                    min="0"
                    value={aggregateCostPerUnit}
                    onChange={(e) => setAggregateCostPerUnit(e.target.value)}
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
                    <CardTitle className="text-sm font-medium">Total Concrete Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {results.totalVolume.toFixed(3)} m³
                    </div>
                    <CardDescription className="mt-1">
                      {(results.totalVolume * 35.3147).toFixed(2)} ft³
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Cement Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {results.cementBags.toFixed(1)} bags
                    </div>
                    <CardDescription className="mt-1">
                      {results.cementKg.toFixed(1)} kg (@ 50 kg/bag)
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Sand Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {results.sandVolume.toFixed(3)} m³
                    </div>
                    <CardDescription className="mt-1">
                      {(results.sandVolume * 35.3147).toFixed(2)} ft³
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Aggregate Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {results.aggregateVolume.toFixed(3)} m³
                    </div>
                    <CardDescription className="mt-1">
                      {(results.aggregateVolume * 35.3147).toFixed(2)} ft³
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Water Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {results.waterLiters.toFixed(1)} L
                    </div>
                    <CardDescription className="mt-1">
                      {(results.waterLiters * 0.264172).toFixed(1)} gallons
                    </CardDescription>
                  </CardContent>
                </Card>

                {results.totalCost > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Estimated Total Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        ${results.totalCost.toFixed(2)}
                      </div>
                      <CardDescription className="mt-1">
                        Materials only (excluding labor)
                      </CardDescription>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="guide">
        <ScrollArea className="h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 p-1">
            <Card className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Understanding Cement Calculations</h4>
                    <p className="text-sm text-muted-foreground">
                      This cement calculator helps you determine the exact quantities of cement, sand, aggregate, and water 
                      needed for your concrete project based on industry-standard mix ratios.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Mix Ratios & Visual Guide</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Concrete mix is made by combining cement, sand, and aggregate in specific proportions. 
                          Here's a visual representation of the standard mixing ratio:
                        </p>
                        <img 
                          src={cementMixingRatios} 
                          alt="Cement mixing ratios diagram showing 1:2:4 ratio with cement bag and aggregate visualization" 
                          className="rounded-lg border w-full max-w-2xl mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Standard mixing ratio: 1 part cement : 2 parts sand : 4 parts aggregate
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Common Mix Grades Explained</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li><strong>M5 (1:5:10):</strong> Low strength - Used for lean concrete, leveling courses</li>
                      <li><strong>M10 (1:3:6):</strong> Non-structural - Used for pathways, simple foundations</li>
                      <li><strong>M15 (1:2:4):</strong> Standard - Used for floors, footpaths, residential construction</li>
                      <li><strong>M20 (1:1.5:3):</strong> Recommended - Most common for residential slabs, beams, columns</li>
                      <li><strong>M25 (1:1:2):</strong> High strength - Used for heavy-duty construction, multi-story buildings</li>
                      <li><strong>M30 (1:1:1.5):</strong> Very high strength - Used for commercial buildings, bridges</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Common Applications</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Cement is used in various construction applications. Here are the most common:
                        </p>
                        <img 
                          src={cementApplications} 
                          alt="Different cement applications including foundation slabs, mortar for brickwork, and plastering" 
                          className="rounded-lg border w-full max-w-2xl mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Foundation slabs, mortar for masonry, and wall plastering
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Calculation Factors</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Dry Volume Multiplier (1.54):</strong> Accounts for voids between particles when materials are in dry state. This means you need 54% more dry materials than the wet volume.</p>
                      <p><strong>Water-Cement Ratio:</strong> The weight of water divided by weight of cement. Lower ratios (0.4-0.5) create stronger but less workable concrete.</p>
                      <p><strong>Cement Density:</strong> Standard cement density is approximately 1440 kg/m³ (loose bulk density).</p>
                      <p><strong>Bag Weight:</strong> Standard cement bags typically weigh 50 kg (110 lbs) or 42.5 kg (94 lbs) in some regions.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Step-by-Step Guide</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Select the concrete mix grade based on your project requirements (M20 recommended for most residential work)</li>
                      <li>Choose your preferred unit system (metric or imperial)</li>
                      <li>Select calculation method:
                        <ul className="list-disc list-inside ml-6 mt-1">
                          <li>Direct Volume: If you know the total cubic meters/feet needed</li>
                          <li>Area + Thickness: If you're calculating for a slab (length × width × thickness)</li>
                        </ul>
                      </li>
                      <li>Adjust advanced options if needed (dry volume multiplier, water-cement ratio, wastage)</li>
                      <li>Enter cost estimates to get total material cost</li>
                      <li>Review the calculated results for cement bags, sand, aggregate, and water quantities</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Important Tips</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Always add 5-10% wastage allowance to account for spillage and material loss</li>
                      <li>Use clean, potable water for mixing concrete</li>
                      <li>Sand should be river sand or washed sand, free from silt and clay</li>
                      <li>Aggregate size typically ranges from 10mm to 20mm for general construction</li>
                      <li>Mix concrete thoroughly to ensure uniform distribution of all materials</li>
                      <li>For large projects, consider using ready-mix concrete for better quality control</li>
                      <li>Store cement bags in dry conditions, elevated from ground level</li>
                      <li>Use cement within 3 months of manufacturing date for best results</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Pro Tip:</strong> For critical structural elements, always consult with a structural engineer 
                      to determine the appropriate mix grade and design specifications. The calculator provides estimates 
                      based on standard ratios, but specific project requirements may vary.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
      </DialogContent>
    </Dialog>
  );
};
