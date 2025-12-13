import { useState, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, RotateCcw, Printer, Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import boardFootImage from "@/assets/calculators/board-foot-calculator.png";

interface BoardFootCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground cursor-help inline-block ml-1" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const BoardFootCalculatorModal = ({ isOpen, onClose }: BoardFootCalculatorModalProps) => {
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Unit system: "imperial" or "metric"
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  
  // Input states
  const [thickness, setThickness] = useState<string>("2");
  const [width, setWidth] = useState<string>("6");
  const [length, setLength] = useState<string>("12");
  const [quantity, setQuantity] = useState<string>("10");
  const [pricePerBoardFoot, setPricePerBoardFoot] = useState<string>("6.50");
  const [wastage, setWastage] = useState<string>("10");

  const results = useMemo(() => {
    const thicknessNum = parseFloat(thickness) || 0;
    const widthNum = parseFloat(width) || 0;
    const lengthNum = parseFloat(length) || 0;
    const quantityNum = parseFloat(quantity) || 0;
    const priceNum = parseFloat(pricePerBoardFoot) || 0;
    const wastageNum = parseFloat(wastage) || 0;

    let boardFeetPerPiece = 0;

    if (unitSystem === "imperial") {
      // Imperial: thickness (in), width (in), length (ft)
      // Board Feet = (Thickness × Width × Length) / 12
      boardFeetPerPiece = (thicknessNum * widthNum * lengthNum) / 12;
    } else {
      // Metric: thickness (mm), width (mm), length (m)
      // Convert to cubic meters then to board feet (1 m³ = 423.776 board feet)
      const volumeM3 = (thicknessNum / 1000) * (widthNum / 1000) * lengthNum;
      boardFeetPerPiece = volumeM3 * 423.776;
    }

    const totalBoardFeet = boardFeetPerPiece * quantityNum;
    const boardFeetWithWastage = totalBoardFeet * (1 + wastageNum / 100);
    const totalCost = boardFeetWithWastage * priceNum;

    return {
      boardFeetPerPiece,
      totalBoardFeet,
      boardFeetWithWastage,
      totalCost,
    };
  }, [thickness, width, length, quantity, pricePerBoardFoot, wastage, unitSystem]);

  const handleReset = () => {
    setThickness("2");
    setWidth("6");
    setLength("12");
    setQuantity("10");
    setPricePerBoardFoot("6.50");
    setWastage("10");
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Printing...",
      description: "Opening print dialog",
    });
  };

  const handleShare = () => {
    const params = new URLSearchParams({
      thickness,
      width,
      length,
      quantity,
      price: pricePerBoardFoot,
      wastage,
      unit: unitSystem,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?calculator=board-foot&${params.toString()}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Share link copied to clipboard",
    });
  };

  const handleExportPDF = () => {
    if (!resultsRef.current) return;

    const opt = {
      margin: 1,
      filename: 'board-foot-calculation.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in' as const, format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(resultsRef.current).save();
    
    toast({
      title: "Exporting to PDF...",
      description: "Your calculation will be downloaded shortly",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Board Foot Calculator</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Information</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            {/* Unit System Toggle */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="unit-system" className="text-base font-medium">
                    Unit System
                  </Label>
                  <div className="flex items-center gap-3">
                    <span className={unitSystem === "imperial" ? "font-bold" : "text-muted-foreground"}>
                      Imperial
                    </span>
                    <Switch
                      id="unit-system"
                      checked={unitSystem === "metric"}
                      onCheckedChange={(checked) => setUnitSystem(checked ? "metric" : "imperial")}
                    />
                    <span className={unitSystem === "metric" ? "font-bold" : "text-muted-foreground"}>
                      Metric
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Input Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Input Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thickness">
                      Thickness {unitSystem === "imperial" ? "(inches)" : "(mm)"}
                      <InfoTooltip content="The thickness of the lumber board" />
                    </Label>
                    <Input
                      id="thickness"
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      placeholder="e.g., 2"
                      min="0"
                      step="0.25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">
                      Width {unitSystem === "imperial" ? "(inches)" : "(mm)"}
                      <InfoTooltip content="The width of the lumber board" />
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="e.g., 6"
                      min="0"
                      step="0.25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">
                      Length {unitSystem === "imperial" ? "(feet)" : "(meters)"}
                      <InfoTooltip content="The length of the lumber board" />
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="e.g., 12"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Number of Pieces
                      <InfoTooltip content="How many pieces of lumber you need" />
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 10"
                      min="1"
                      step="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price per Board Foot ($)
                      <InfoTooltip content="Cost per board foot of lumber" />
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={pricePerBoardFoot}
                      onChange={(e) => setPricePerBoardFoot(e.target.value)}
                      placeholder="e.g., 6.50"
                      min="0"
                      step="0.10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wastage">
                      Wastage (%)
                      <InfoTooltip content="Additional material to account for cuts, defects, and waste" />
                    </Label>
                    <Input
                      id="wastage"
                      type="number"
                      value={wastage}
                      onChange={(e) => setWastage(e.target.value)}
                      placeholder="e.g., 10"
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card ref={resultsRef}>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Board Feet per Piece</p>
                    <p className="text-2xl font-bold text-primary">
                      {results.boardFeetPerPiece.toFixed(2)} BF
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Board Feet (No Wastage)</p>
                    <p className="text-2xl font-bold text-primary">
                      {results.totalBoardFeet.toFixed(2)} BF
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Board Feet (With {wastage}% Wastage)</p>
                    <p className="text-2xl font-bold text-primary">
                      {results.boardFeetWithWastage.toFixed(2)} BF
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(results.totalCost)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* What is a Board Foot */}
                <Card>
                  <CardHeader>
                    <CardTitle>What is a Board Foot?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      A <strong>board foot</strong> is a specialized unit of measure for the volume of lumber in North America. 
                      One board foot is equal to 144 cubic inches, which is the volume of a board that is 1 inch thick, 
                      12 inches wide, and 12 inches long (1" × 12" × 12").
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Board feet are used by lumber yards, contractors, and woodworkers to calculate how much lumber is 
                      needed for a project and to determine pricing. Understanding how to calculate board feet helps you 
                      accurately estimate material costs and order the right amount of lumber.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Why Board Feet Matter:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Standardized measurement for lumber purchasing</li>
                        <li>Helps calculate accurate project costs</li>
                        <li>Allows comparison of prices between different lumber dimensions</li>
                        <li>Essential for professional construction and woodworking estimates</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* How the Calculation Works */}
                <Card>
                  <CardHeader>
                    <CardTitle>How the Calculation Works</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">Imperial Formula (inches and feet):</h4>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                          Board Feet = (Thickness in inches × Width in inches × Length in feet) ÷ 12
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Or when all dimensions are in inches:
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mt-2">
                          Board Feet = (Thickness × Width × Length in inches) ÷ 144
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Metric Formula (mm and meters):</h4>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                          Volume (m³) = (Thickness in mm ÷ 1000) × (Width in mm ÷ 1000) × Length in meters
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mt-2">
                          Board Feet = Volume (m³) × 423.776
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Note: 1 cubic meter = 423.776 board feet
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Calculation:</h4>
                        <p className="text-sm text-muted-foreground">
                          A 2" × 6" × 12' board:
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mt-2">
                          BF = (2 × 6 × 12) ÷ 12 = 12 board feet
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Total Cost Calculation:</h4>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                          Total Cost = Board Feet × (1 + Wastage%) × Price per Board Foot
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Common Lumber Dimensions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Common Lumber Dimensions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Note: Nominal dimensions (what lumber is called) vs. actual dimensions (what you get):
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Nominal Size</th>
                              <th className="text-left p-2">Actual Size</th>
                              <th className="text-left p-2">BF per Linear Foot</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b">
                              <td className="p-2">1" × 4"</td>
                              <td className="p-2">3/4" × 3.5"</td>
                              <td className="p-2">0.33 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">1" × 6"</td>
                              <td className="p-2">3/4" × 5.5"</td>
                              <td className="p-2">0.50 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">2" × 4"</td>
                              <td className="p-2">1.5" × 3.5"</td>
                              <td className="p-2">0.67 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">2" × 6"</td>
                              <td className="p-2">1.5" × 5.5"</td>
                              <td className="p-2">1.00 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">2" × 8"</td>
                              <td className="p-2">1.5" × 7.25"</td>
                              <td className="p-2">1.33 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">2" × 10"</td>
                              <td className="p-2">1.5" × 9.25"</td>
                              <td className="p-2">1.67 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">2" × 12"</td>
                              <td className="p-2">1.5" × 11.25"</td>
                              <td className="p-2">2.00 BF/ft</td>
                            </tr>
                            <tr className="border-b">
                              <td className="p-2">4" × 4"</td>
                              <td className="p-2">3.5" × 3.5"</td>
                              <td className="p-2">1.33 BF/ft</td>
                            </tr>
                            <tr>
                              <td className="p-2">4" × 6"</td>
                              <td className="p-2">3.5" × 5.5"</td>
                              <td className="p-2">2.00 BF/ft</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reference Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={boardFootImage} 
                      alt="Board Foot Visual Reference" 
                      className="w-full rounded-lg"
                    />
                  </CardContent>
                </Card>

                {/* FAQs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How much does lumber cost per board foot?</h4>
                      <p className="text-sm text-muted-foreground">
                        Lumber prices vary widely based on wood species, grade, and market conditions. As of recent years, 
                        prices typically range from $2-$15+ per board foot. Softwoods like pine are generally cheaper ($2-$5/BF), 
                        while hardwoods like oak, maple, or walnut can cost $8-$15+ per board foot.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Why should I add wastage?</h4>
                      <p className="text-sm text-muted-foreground">
                        Wastage accounts for cuts, mistakes, defects in the lumber, and unusable end pieces. A typical wastage 
                        factor is 10-15% for most projects. Complex projects with many cuts may require 15-20% wastage.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">What's the difference between nominal and actual dimensions?</h4>
                      <p className="text-sm text-muted-foreground">
                        Nominal dimensions are the size lumber is referred to as (e.g., 2" × 4"). Actual dimensions are smaller 
                        due to planing and drying (a 2" × 4" is actually 1.5" × 3.5"). When calculating board feet, you should use 
                        the nominal dimensions as that's how lumber is priced.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Can I calculate board feet for rough-sawn lumber?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! For rough-sawn lumber (lumber that hasn't been planed), use the actual measured dimensions. 
                        Rough-sawn lumber dimensions are typically closer to or equal to the nominal size.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">How many board feet are in a standard 2x4x8?</h4>
                      <p className="text-sm text-muted-foreground">
                        A standard 2" × 4" × 8' board contains 5.33 board feet.
                        Calculation: (2 × 4 × 8) ÷ 12 = 5.33 BF
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        1
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Always buy extra:</strong> Add 10-15% wastage for standard projects, 15-20% for complex designs 
                        with many cuts and angles.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        2
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Check lumber grade:</strong> Higher grades cost more but have fewer defects. Select grade is 
                        good for visible work, while #2 common is fine for framing.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        3
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Compare prices:</strong> Use board feet to compare prices of different sized lumber. A 2×6×12 
                        might be cheaper per board foot than two 2×6×6 boards.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        4
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Consider moisture content:</strong> Kiln-dried lumber (marked KD) is more stable and ready to use. 
                        Green lumber is cheaper but will shrink as it dries.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        5
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Plan your cuts:</strong> Optimize your cutting plan to minimize waste. Longer boards often provide 
                        better value if you can utilize the full length.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        6
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Store lumber properly:</strong> Keep lumber flat and supported to prevent warping. Store in a dry 
                        location and allow it to acclimate to your workspace before use.
                      </p>
                    </div>
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
