import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Calculator, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VastuCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Direction = "North" | "South" | "East" | "West" | "North-East" | "North-West" | "South-East" | "South-West";
type PropertyType = "Home" | "Office" | "Shop" | "Plot";

interface VastuAnalysis {
  score: number;
  propertyScore: number;
  entryScore: number;
  kitchenScore: number;
  bedroomScore: number;
  bathroomScore: number;
  poojaScore: number;
  staircaseScore: number;
  waterSourceScore: number;
  remedies: string[];
  tips: string[];
}

export const VastuCalculatorModal = ({ isOpen, onClose }: VastuCalculatorModalProps) => {
  // User inputs
  const [name, setName] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [propertyType, setPropertyType] = useState<PropertyType>("Home");
  const [facingDirection, setFacingDirection] = useState<Direction>("North");
  const [entryDirection, setEntryDirection] = useState<Direction>("North-East");
  const [kitchenLocation, setKitchenLocation] = useState<Direction>("South-East");
  const [bedroomLocation, setBedroomLocation] = useState<Direction>("South-West");
  const [bathroomLocation, setBathroomLocation] = useState<Direction>("North-West");
  const [poojaLocation, setPoojaLocation] = useState<Direction>("North-East");
  const [staircaseDirection, setStaircaseDirection] = useState<Direction>("South");
  const [waterSourceLocation, setWaterSourceLocation] = useState<Direction>("North-East");

  const [analysis, setAnalysis] = useState<VastuAnalysis>({
    score: 0,
    propertyScore: 0,
    entryScore: 0,
    kitchenScore: 0,
    bedroomScore: 0,
    bathroomScore: 0,
    poojaScore: 0,
    staircaseScore: 0,
    waterSourceScore: 0,
    remedies: [],
    tips: [],
  });

  useEffect(() => {
    calculateVastuScore();
  }, [
    propertyType,
    facingDirection,
    entryDirection,
    kitchenLocation,
    bedroomLocation,
    bathroomLocation,
    poojaLocation,
    staircaseDirection,
    waterSourceLocation,
  ]);

  const calculateVastuScore = () => {
    const remedies: string[] = [];
    const tips: string[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // Facing Direction Score (Weight: 15)
    maxScore += 15;
    let facingScore = 0;
    if (facingDirection === "East" || facingDirection === "North") {
      facingScore = 15;
    } else if (facingDirection === "North-East") {
      facingScore = 14;
    } else if (facingDirection === "West") {
      facingScore = 10;
    } else if (facingDirection === "South") {
      facingScore = 8;
    } else {
      facingScore = 12;
    }
    totalScore += facingScore;

    // Entry Direction Score (Weight: 20)
    maxScore += 20;
    let entryScore = 0;
    if (entryDirection === "North-East" || entryDirection === "North" || entryDirection === "East") {
      entryScore = 20;
      tips.push("Excellent entry placement! Positive energy flows freely.");
    } else if (entryDirection === "West") {
      entryScore = 14;
      tips.push("West entry is acceptable but could be improved.");
    } else if (entryDirection === "South" || entryDirection === "South-West") {
      entryScore = 8;
      remedies.push("❌ Entry in " + entryDirection + " - Place a Vaastu pyramid or bright light at entrance. Use yellow/white paint.");
    } else {
      entryScore = 16;
    }
    totalScore += entryScore;

    // Kitchen Location Score (Weight: 15)
    maxScore += 15;
    let kitchenScore = 0;
    if (kitchenLocation === "South-East") {
      kitchenScore = 15;
      tips.push("✅ Kitchen in SE - Perfect placement as per Agni (fire) direction.");
    } else if (kitchenLocation === "North-West") {
      kitchenScore = 10;
      remedies.push("Kitchen in NW - Acceptable, but SE would be ideal. Use yellow/orange colors.");
    } else if (kitchenLocation === "North" || kitchenLocation === "North-East") {
      kitchenScore = 3;
      remedies.push("❌ Kitchen in " + kitchenLocation + " - Not ideal. Place Vaastu salt bowl, use light colors, relocate if possible.");
    } else {
      kitchenScore = 8;
      remedies.push("Kitchen in " + kitchenLocation + " - Consider relocating to South-East for better energy.");
    }
    totalScore += kitchenScore;

    // Master Bedroom Score (Weight: 12)
    maxScore += 12;
    let bedroomScore = 0;
    if (bedroomLocation === "South-West") {
      bedroomScore = 12;
      tips.push("✅ Master Bedroom in SW - Ideal placement for stability and rest.");
    } else if (bedroomLocation === "South" || bedroomLocation === "West") {
      bedroomScore = 10;
      tips.push("Master Bedroom in " + bedroomLocation + " - Good placement.");
    } else if (bedroomLocation === "North-East") {
      bedroomScore = 4;
      remedies.push("❌ Master Bedroom in NE - Not recommended. Use earthy colors, keep heavy furniture in SW corner.");
    } else {
      bedroomScore = 7;
    }
    totalScore += bedroomScore;

    // Bathroom/Toilet Score (Weight: 12)
    maxScore += 12;
    let bathroomScore = 0;
    if (bathroomLocation === "North-West" || bathroomLocation === "West") {
      bathroomScore = 12;
      tips.push("✅ Bathroom in " + bathroomLocation + " - Good placement.");
    } else if (bathroomLocation === "North-East") {
      bathroomScore = 2;
      remedies.push("❌ Bathroom in NE - Problematic. Place Vaastu salt bowl, use light yellow paint, keep well-lit and ventilated.");
    } else if (bathroomLocation === "South-West") {
      bathroomScore = 4;
      remedies.push("Bathroom in SW - Not ideal. Keep the toilet seat lid closed, use light colors.");
    } else {
      bathroomScore = 8;
    }
    totalScore += bathroomScore;

    // Pooja Room Score (Weight: 10)
    maxScore += 10;
    let poojaScore = 0;
    if (poojaLocation === "North-East") {
      poojaScore = 10;
      tips.push("✅ Pooja Room in NE - Perfect placement for spiritual practices.");
    } else if (poojaLocation === "North" || poojaLocation === "East") {
      poojaScore = 8;
      tips.push("Pooja Room in " + poojaLocation + " - Good placement.");
    } else if (poojaLocation === "South-West" || poojaLocation === "South") {
      poojaScore = 3;
      remedies.push("Pooja Room in " + poojaLocation + " - Not ideal. Place idols facing East/North, use white/yellow colors.");
    } else {
      poojaScore = 6;
    }
    totalScore += poojaScore;

    // Staircase Score (Weight: 8)
    maxScore += 8;
    let staircaseScore = 0;
    if (staircaseDirection === "South" || staircaseDirection === "West" || staircaseDirection === "South-West") {
      staircaseScore = 8;
      tips.push("✅ Staircase in " + staircaseDirection + " - Good placement.");
    } else if (staircaseDirection === "North-East") {
      staircaseScore = 2;
      remedies.push("❌ Staircase in NE - Not recommended. Keep the area under stairs empty and well-lit.");
    } else {
      staircaseScore = 6;
    }
    totalScore += staircaseScore;

    // Water Source Score (Weight: 8)
    maxScore += 8;
    let waterSourceScore = 0;
    if (waterSourceLocation === "North-East") {
      waterSourceScore = 8;
      tips.push("✅ Water source in NE - Ideal placement as per Vaastu.");
    } else if (waterSourceLocation === "North") {
      waterSourceScore = 7;
      tips.push("Water source in North - Good placement.");
    } else if (waterSourceLocation === "South-West" || waterSourceLocation === "South") {
      waterSourceScore = 2;
      remedies.push("❌ Water source in " + waterSourceLocation + " - Not ideal. Ensure proper drainage, consider relocation.");
    } else {
      waterSourceScore = 5;
    }
    totalScore += waterSourceScore;

    // Add general tips
    tips.push("💡 Keep your North-East area clutter-free and well-lit for positive energy flow.");
    tips.push("💡 Place heavy furniture and storage in the South-West direction for stability.");
    
    // Calculate percentage score
    const percentageScore = Math.round((totalScore / maxScore) * 100);

    setAnalysis({
      score: percentageScore,
      propertyScore: facingScore,
      entryScore,
      kitchenScore,
      bedroomScore,
      bathroomScore,
      poojaScore,
      staircaseScore,
      waterSourceScore,
      remedies,
      tips,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent - Very Good Vaastu Compliance";
    if (score >= 70) return "Good - Minor Improvements Possible";
    if (score >= 50) return "Average - Several Areas Need Attention";
    return "Needs Improvement - Major Corrections Required";
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
            Vaastu Calculator
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
                {/* Optional User Profile */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Optional Profile Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name (Optional)</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City/Location (Optional)</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Your city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Property Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Property Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">
                        Property Type
                        <InfoTooltip text="Select the type of property for customized Vaastu analysis." />
                      </Label>
                      <Select value={propertyType} onValueChange={(value) => setPropertyType(value as PropertyType)}>
                        <SelectTrigger id="propertyType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home">Home</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="Shop">Shop</SelectItem>
                          <SelectItem value="Plot">Plot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facingDirection">
                        Facing Direction
                        <InfoTooltip text="The direction the main entrance of your property faces. This is the most important Vaastu factor." />
                      </Label>
                      <Select value={facingDirection} onValueChange={(value) => setFacingDirection(value as Direction)}>
                        <SelectTrigger id="facingDirection">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Room Locations */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm">Room Locations</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entryDirection">
                        Entry Door Direction
                        <InfoTooltip text="Direction where your main entrance door is located." />
                      </Label>
                      <Select value={entryDirection} onValueChange={(value) => setEntryDirection(value as Direction)}>
                        <SelectTrigger id="entryDirection">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kitchenLocation">
                        Kitchen Location
                        <InfoTooltip text="South-East is ideal as it aligns with the fire element (Agni)." />
                      </Label>
                      <Select value={kitchenLocation} onValueChange={(value) => setKitchenLocation(value as Direction)}>
                        <SelectTrigger id="kitchenLocation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bedroomLocation">
                        Master Bedroom Location
                        <InfoTooltip text="South-West is ideal for the master bedroom, promoting stability and rest." />
                      </Label>
                      <Select value={bedroomLocation} onValueChange={(value) => setBedroomLocation(value as Direction)}>
                        <SelectTrigger id="bedroomLocation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathroomLocation">
                        Bathroom/Toilet Location
                        <InfoTooltip text="North-West or West is ideal. Avoid North-East for bathrooms." />
                      </Label>
                      <Select value={bathroomLocation} onValueChange={(value) => setBathroomLocation(value as Direction)}>
                        <SelectTrigger id="bathroomLocation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poojaLocation">
                        Pooja/Prayer Room Location
                        <InfoTooltip text="North-East is most auspicious for prayer and meditation spaces." />
                      </Label>
                      <Select value={poojaLocation} onValueChange={(value) => setPoojaLocation(value as Direction)}>
                        <SelectTrigger id="poojaLocation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="staircaseDirection">
                        Staircase Direction
                        <InfoTooltip text="South or West is ideal for staircases. Avoid North-East." />
                      </Label>
                      <Select value={staircaseDirection} onValueChange={(value) => setStaircaseDirection(value as Direction)}>
                        <SelectTrigger id="staircaseDirection">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waterSourceLocation">
                        Water Source Location (Borewell/Tank)
                        <InfoTooltip text="North-East is most favorable for water sources and tanks." />
                      </Label>
                      <Select value={waterSourceLocation} onValueChange={(value) => setWaterSourceLocation(value as Direction)}>
                        <SelectTrigger id="waterSourceLocation">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Analysis Results */}
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">🏡 Vaastu Analysis for Your {propertyType}</h2>
                    {name && <p className="text-muted-foreground">For: {name}{city && `, ${city}`}</p>}
                  </div>

                  {/* Overall Score */}
                  <Card className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-center">Overall Vaastu Score</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className={`text-6xl font-bold text-center ${getScoreColor(analysis.score)}`}>
                        {analysis.score}/100
                      </div>
                      <p className="text-center text-lg font-medium">{getScoreLabel(analysis.score)}</p>
                    </CardContent>
                  </Card>

                  {/* Room-by-Room Analysis */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">📊 Room-by-Room Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {facingDirection === "East" || facingDirection === "North" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Facing Direction
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{facingDirection}</div>
                          <CardDescription>
                            {facingDirection === "East" || facingDirection === "North" ? "✅ Excellent" : "Good"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {entryDirection === "North-East" || entryDirection === "North" || entryDirection === "East" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Entry Door
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{entryDirection}</div>
                          <CardDescription>
                            {entryDirection === "North-East" || entryDirection === "North" || entryDirection === "East"
                              ? "✅ Very Good"
                              : "Acceptable"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {kitchenLocation === "South-East" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : kitchenLocation === "North" || kitchenLocation === "North-East" ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Kitchen
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{kitchenLocation}</div>
                          <CardDescription>
                            {kitchenLocation === "South-East"
                              ? "✅ Ideal"
                              : kitchenLocation === "North" || kitchenLocation === "North-East"
                              ? "❌ Not Ideal"
                              : "Acceptable"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {bedroomLocation === "South-West" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : bedroomLocation === "North-East" ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Master Bedroom
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{bedroomLocation}</div>
                          <CardDescription>
                            {bedroomLocation === "South-West"
                              ? "✅ Ideal"
                              : bedroomLocation === "North-East"
                              ? "❌ Not Recommended"
                              : "Acceptable"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {bathroomLocation === "North-West" || bathroomLocation === "West" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : bathroomLocation === "North-East" ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Bathroom
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{bathroomLocation}</div>
                          <CardDescription>
                            {bathroomLocation === "North-West" || bathroomLocation === "West"
                              ? "✅ Good"
                              : bathroomLocation === "North-East"
                              ? "❌ Problematic"
                              : "Acceptable"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {poojaLocation === "North-East" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Pooja Room
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{poojaLocation}</div>
                          <CardDescription>
                            {poojaLocation === "North-East" ? "✅ Perfect" : "Acceptable"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {staircaseDirection === "South" || staircaseDirection === "West" || staircaseDirection === "South-West" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Staircase
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{staircaseDirection}</div>
                          <CardDescription>
                            {staircaseDirection === "South" ||
                            staircaseDirection === "West" ||
                            staircaseDirection === "South-West"
                              ? "✅ Good"
                              : "Needs Attention"}
                          </CardDescription>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            {waterSourceLocation === "North-East" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            Water Source
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl font-bold">{waterSourceLocation}</div>
                          <CardDescription>
                            {waterSourceLocation === "North-East" ? "✅ Ideal" : "Could Be Better"}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Remedies */}
                  {analysis.remedies.length > 0 && (
                    <Card className="border-orange-200 dark:border-orange-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          🛠 Remedies & Corrections
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysis.remedies.map((remedy, index) => (
                            <li key={index} className="text-sm leading-relaxed">
                              {remedy}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tips */}
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                        ✅ Tips & Positive Aspects
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.tips.map((tip, index) => (
                          <li key={index} className="text-sm leading-relaxed">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="guide">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 p-1 prose prose-sm max-w-none dark:prose-invert">
                <section>
                  <h2 className="text-2xl font-bold mb-3">What is Vaastu Shastra?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Vaastu Shastra is an ancient Indian science of architecture and design that combines the five elements 
                    (earth, water, fire, air, and space) with directional energies to create harmonious living and working 
                    spaces. It aims to balance cosmic energy flow to promote health, prosperity, and overall well-being.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-bold mb-3">Key Vaastu Principles</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">🧭 Directional Importance</h3>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li><strong>North-East (Ishaan):</strong> Most auspicious direction. Ideal for prayer rooms, water sources, and entrance. Keep it light and clutter-free.</li>
                        <li><strong>South-East (Agneya):</strong> Fire element. Perfect for kitchens as it aligns with Agni (fire god).</li>
                        <li><strong>South-West (Nairutya):</strong> Earth element. Best for master bedrooms and heavy storage for stability.</li>
                        <li><strong>North-West (Vayavya):</strong> Air element. Suitable for guest rooms and bathrooms.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">🏠 Room Placement Guidelines</h3>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                        <li><strong>Main Entrance:</strong> North, East, or North-East facing is most favorable.</li>
                        <li><strong>Kitchen:</strong> South-East corner is ideal. Avoid North or North-East.</li>
                        <li><strong>Master Bedroom:</strong> South-West provides stability and restful sleep.</li>
                        <li><strong>Bathroom:</strong> North-West or West. Never in North-East.</li>
                        <li><strong>Pooja Room:</strong> North-East for spiritual energy and peace.</li>
                        <li><strong>Living Room:</strong> North or East for positive social interactions.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">⚡ Energy Flow (Prana)</h3>
                      <p className="text-muted-foreground">
                        Vaastu emphasizes the free flow of positive energy (Prana) throughout the space. North-East 
                        should be light and open, while South-West should have more weight and density. This creates 
                        a balanced energy gradient from light to heavy.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-bold mb-3">Common Vaastu Remedies</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">🧂 Vaastu Salt</h3>
                      <p className="text-muted-foreground text-sm">
                        Place salt bowls in problematic areas to absorb negative energy. Replace weekly.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">💡 Lighting</h3>
                      <p className="text-muted-foreground text-sm">
                        Keep the North-East well-lit. Use bright lights in dark corners to enhance positive energy.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">🎨 Colors</h3>
                      <p className="text-muted-foreground text-sm">
                        Use light colors (white, yellow, light blue) in North and East. Earthy tones in South and West.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">🔺 Vaastu Pyramids</h3>
                      <p className="text-muted-foreground text-sm">
                        Place at entrance or problem areas to correct energy imbalances.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">🪴 Plants</h3>
                      <p className="text-muted-foreground text-sm">
                        Tulsi (Holy Basil) in North-East, Money Plant in South-East. Avoid cactus and thorny plants indoors.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">🪞 Mirrors</h3>
                      <p className="text-muted-foreground text-sm">
                        Place mirrors on North or East walls. Avoid mirrors facing the bed or main entrance.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-bold mb-3">Vaastu for Different Property Types</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">🏡 Residential Homes</h3>
                      <p className="text-muted-foreground text-sm">
                        Focus on bedroom placement (SW), kitchen (SE), and main entrance (NE/N/E). Ensure proper 
                        ventilation and natural light, especially in North-East.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">🏢 Offices</h3>
                      <p className="text-muted-foreground text-sm">
                        Owner's cabin in South-West facing North or East. Accounts/Finance in North. Marketing/Sales 
                        in North-West. Reception in North-East or North.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">🏪 Shops</h3>
                      <p className="text-muted-foreground text-sm">
                        Cash counter in North facing North or East. Heavy products in South-West. Entrance in North-East 
                        or North for maximum customer flow.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">📐 Plots</h3>
                      <p className="text-muted-foreground text-sm">
                        Regular shapes (square/rectangle) are best. Avoid plots with cuts in North-East. Slopes should 
                        descend towards North or East. Road on North or East is favorable.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-bold mb-3">Important Notes</h2>
                  <div className="bg-muted p-4 rounded-lg">
                    <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                      <li>This calculator provides general Vaastu guidelines based on traditional principles.</li>
                      <li>Individual circumstances and site-specific factors may require consultation with a Vaastu expert.</li>
                      <li>Some Vaastu corrections may not be practically feasible in existing structures.</li>
                      <li>Focus on achievable remedies rather than major structural changes.</li>
                      <li>Vaastu is complementary to modern architecture and should be balanced with practical needs.</li>
                      <li>Maintaining cleanliness, proper ventilation, and positive environment is as important as directional placement.</li>
                    </ul>
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
