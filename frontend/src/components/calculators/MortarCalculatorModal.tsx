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
import { Info } from "lucide-react";
import { useState, useMemo } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import cementMixingImg from "@/assets/calculators/cement-mixing-ratios.jpg";
import cementApplicationsImg from "@/assets/calculators/cement-applications.jpg";

interface MortarCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Yield data per bag type
const YIELD_DATA = {
  'modular-bricks': { '80lb': { min: 40, max: 45, avg: 42.5 }, '3000lb': { min: 1500, max: 1675, avg: 1587.5 } },
  'queen-bricks': { '80lb': { min: 34, max: 39, avg: 36.5 }, '3000lb': { min: 1275, max: 1450, avg: 1362.5 } },
  'king-bricks': { '80lb': { min: 28, max: 33, avg: 30.5 }, '3000lb': { min: 1050, max: 1225, avg: 1137.5 } },
  'utility-bricks': { '80lb': { min: 23, max: 28, avg: 25.5 }, '3000lb': { min: 850, max: 1050, avg: 950 } },
  '4-inch-blocks': { '80lb': { min: 15, max: 17, avg: 16 }, '3000lb': { min: 575, max: 650, avg: 612.5 } },
  '6-inch-blocks': { '80lb': { min: 12, max: 14, avg: 13 }, '3000lb': { min: 475, max: 525, avg: 500 } },
  '8-inch-blocks': { '80lb': { min: 11, max: 13, avg: 12 }, '3000lb': { min: 450, max: 500, avg: 475 } },
  '10-inch-blocks': { '80lb': { min: 11, max: 13, avg: 12 }, '3000lb': { min: 450, max: 500, avg: 475 } },
  '12-inch-blocks': { '80lb': { min: 10, max: 12, avg: 11 }, '3000lb': { min: 375, max: 425, avg: 400 } },
};

const BRICK_TYPES = [
  { value: 'modular-bricks', label: 'Modular Bricks' },
  { value: 'queen-bricks', label: 'Queen Size Bricks' },
  { value: 'king-bricks', label: 'King Size Bricks' },
  { value: 'utility-bricks', label: 'Utility Bricks' },
  { value: '4-inch-blocks', label: '4-inch Blocks' },
  { value: '6-inch-blocks', label: '6-inch Blocks' },
  { value: '8-inch-blocks', label: '8-inch Blocks' },
  { value: '10-inch-blocks', label: '10-inch Blocks' },
  { value: '12-inch-blocks', label: '12-inch Blocks' },
];

const BAG_WEIGHTS = [
  { value: '80lb', label: '80 lb Bag', weightLb: 80, weightKg: 36.29 },
  { value: '3000lb', label: '3,000 lb Bulk', weightLb: 3000, weightKg: 1360.78 },
];

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

export const MortarCalculatorModal = ({ isOpen, onClose }: MortarCalculatorModalProps) => {
  const { currencySymbol } = useCurrency();
  const formatPrice = (price: number) => `${currencySymbol}${price.toFixed(2)}`;
  
  // Input states
  const [numberOfUnits, setNumberOfUnits] = useState<string>("1000");
  const [brickType, setBrickType] = useState<string>("modular-bricks");
  const [bagWeight, setBagWeight] = useState<string>("80lb");
  const [includeBuffer, setIncludeBuffer] = useState(true);
  const [bufferPercent, setBufferPercent] = useState<string>("10");
  const [pricePerBag, setPricePerBag] = useState<string>("8.50");
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');

  // Calculations
  const results = useMemo(() => {
    const units = parseFloat(numberOfUnits) || 0;
    const buffer = parseFloat(bufferPercent) || 10;
    const price = parseFloat(pricePerBag) || 0;

    if (units <= 0) {
      return {
        yieldPerBag: 0,
        yieldRange: '',
        rawBags: 0,
        requiredBags: 0,
        bagsWithBuffer: 0,
        totalWeight: 0,
        totalCost: 0,
        bufferBags: 0,
      };
    }

    const yieldData = YIELD_DATA[brickType as keyof typeof YIELD_DATA][bagWeight as '80lb' | '3000lb'];
    const yieldPerBag = yieldData.avg;
    const yieldRange = `${yieldData.min} - ${yieldData.max}`;

    const rawBags = units / yieldPerBag;
    const requiredBags = Math.ceil(rawBags);
    
    let bagsWithBuffer = requiredBags;
    let bufferBags = 0;
    
    if (includeBuffer) {
      const bufferedAmount = requiredBags * (1 + buffer / 100);
      bagsWithBuffer = Math.ceil(bufferedAmount);
      bufferBags = bagsWithBuffer - requiredBags;
    }

    const bagWeightData = BAG_WEIGHTS.find(b => b.value === bagWeight);
    const totalWeight = unitSystem === 'imperial' 
      ? bagsWithBuffer * (bagWeightData?.weightLb || 80)
      : bagsWithBuffer * (bagWeightData?.weightKg || 36.29);

    const totalCost = bagsWithBuffer * price;

    return {
      yieldPerBag,
      yieldRange,
      rawBags,
      requiredBags,
      bagsWithBuffer,
      totalWeight,
      totalCost,
      bufferBags,
    };
  }, [numberOfUnits, brickType, bagWeight, includeBuffer, bufferPercent, pricePerBag, unitSystem]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Mortar Calculator</DialogTitle>
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
                        Imperial
                      </span>
                      <Switch
                        checked={unitSystem === 'metric'}
                        onCheckedChange={(checked) => setUnitSystem(checked ? 'metric' : 'imperial')}
                      />
                      <span className={unitSystem === 'metric' ? 'font-semibold' : 'text-muted-foreground'}>
                        Metric
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Input Parameters */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Input Parameters</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="numberOfUnits">
                        Number of Bricks/Blocks
                        <InfoTooltip content="Enter the total number of bricks or blocks you plan to use in your project" />
                      </Label>
                      <Input
                        id="numberOfUnits"
                        type="number"
                        value={numberOfUnits}
                        onChange={(e) => setNumberOfUnits(e.target.value)}
                        placeholder="1000"
                        min="0"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="brickType">
                        Brick/Block Type
                        <InfoTooltip content="Select the type and size of brick or block you're using" />
                      </Label>
                      <Select value={brickType} onValueChange={setBrickType}>
                        <SelectTrigger id="brickType" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BRICK_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bagWeight">
                        Bag Type/Weight
                        <InfoTooltip content="Select the bag size you plan to purchase" />
                      </Label>
                      <Select value={bagWeight} onValueChange={setBagWeight}>
                        <SelectTrigger id="bagWeight" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BAG_WEIGHTS.map((weight) => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="pricePerBag">
                        Price per Bag ({currencySymbol})
                        <InfoTooltip content="Enter the cost of one bag of mortar in your local currency" />
                      </Label>
                      <Input
                        id="pricePerBag"
                        type="number"
                        value={pricePerBag}
                        onChange={(e) => setPricePerBag(e.target.value)}
                        placeholder="8.50"
                        min="0"
                        step="0.01"
                        className="mt-1"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeBuffer" className="cursor-pointer">
                          Include Waste Buffer
                          <InfoTooltip content="Add extra mortar to account for waste, spillage, and variations" />
                        </Label>
                        <Switch
                          id="includeBuffer"
                          checked={includeBuffer}
                          onCheckedChange={setIncludeBuffer}
                        />
                      </div>

                      {includeBuffer && (
                        <div>
                          <Label htmlFor="bufferPercent">Buffer Percentage (%)</Label>
                          <Input
                            id="bufferPercent"
                            type="number"
                            value={bufferPercent}
                            onChange={(e) => setBufferPercent(e.target.value)}
                            placeholder="10"
                            min="0"
                            max="50"
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Results */}
                <Card className="p-6 bg-primary/5">
                  <h3 className="text-lg font-semibold mb-4">Results</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Yield per Bag (avg)</p>
                        <p className="text-2xl font-bold">{results.yieldPerBag.toFixed(1)} units</p>
                        <p className="text-xs text-muted-foreground">Range: {results.yieldRange}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Raw Calculation</p>
                        <p className="text-2xl font-bold">{results.rawBags.toFixed(2)} bags</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground">Required Bags (rounded up)</p>
                      <p className="text-3xl font-bold text-primary">{results.requiredBags} bags</p>
                    </div>

                    {includeBuffer && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            With {bufferPercent}% Buffer (+{results.bufferBags} bags)
                          </p>
                          <p className="text-3xl font-bold text-primary">{results.bagsWithBuffer} bags</p>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Weight</p>
                        <p className="text-xl font-semibold">
                          {results.totalWeight.toFixed(2)} {unitSystem === 'imperial' ? 'lbs' : 'kg'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Cost</p>
                        <p className="text-xl font-semibold">{formatPrice(results.totalCost)}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Yield Reference Table */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Mortar Yield Reference Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Brick/Block Type</th>
                          <th className="text-right py-2 px-2">80 lb Bag</th>
                          <th className="text-right py-2 px-2">3,000 lb Bulk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BRICK_TYPES.map((type) => {
                          const data = YIELD_DATA[type.value as keyof typeof YIELD_DATA];
                          return (
                            <tr key={type.value} className="border-b">
                              <td className="py-2 px-2">{type.label}</td>
                              <td className="text-right py-2 px-2">
                                {data['80lb'].min} – {data['80lb'].max}
                              </td>
                              <td className="text-right py-2 px-2">
                                {data['3000lb'].min} – {data['3000lb'].max}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    * Yields represent the approximate number of bricks/blocks that can be laid with one bag
                  </p>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="guide">
            <ScrollArea className="h-[calc(90vh-180px)] pr-4">
              <div className="space-y-6 py-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Understanding Mortar Calculations</h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      The mortar calculator helps you determine how many bags of mortar you need for bricklaying or
                      block-laying projects. The calculation is based on industry-standard yield rates for different
                      brick and block sizes.
                    </p>
                    <img
                      src={cementMixingImg}
                      alt="Mortar mixing ratios"
                      className="w-full rounded-lg my-4"
                    />
                    <h4 className="font-semibold mt-4">How It Works:</h4>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>
                        <strong>Yield per Bag:</strong> Each brick/block type requires a specific amount of mortar.
                        Larger units require more mortar per joint.
                      </li>
                      <li>
                        <strong>Raw Calculation:</strong> Divides your total units by the average yield per bag
                        (Number of Units ÷ Yield per Bag).
                      </li>
                      <li>
                        <strong>Rounding Up:</strong> Always rounds up to the nearest whole bag since you can't
                        purchase partial bags.
                      </li>
                      <li>
                        <strong>Waste Buffer:</strong> Adds extra bags (typically 10%) to account for waste, spillage,
                        and variation in application.
                      </li>
                    </ol>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Bag Types & Sizes</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold">80 lb Bags (Standard)</h4>
                      <p className="text-muted-foreground mt-1">
                        Most common for residential and small commercial projects. Easy to handle and mix on-site.
                        Typical coverage ranges from 10-45 units depending on size.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">3,000 lb Bulk (Large Projects)</h4>
                      <p className="text-muted-foreground mt-1">
                        Used for large commercial projects with mixing equipment. More economical for high-volume work.
                        Coverage ranges from 375-1,675 units depending on size.
                      </p>
                    </div>
                    <img
                      src={cementApplicationsImg}
                      alt="Cement applications"
                      className="w-full rounded-lg my-4"
                    />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Professional Tips</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3">
                      <div className="text-primary font-bold">1.</div>
                      <div>
                        <strong>Always Order Extra:</strong> A 10% buffer is standard, but consider 15-20% for
                        complex projects or if you're inexperienced. Running short mid-project is costly.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-primary font-bold">2.</div>
                      <div>
                        <strong>Joint Thickness Matters:</strong> Standard calculations assume 3/8" to 1/2" joints.
                        Thicker joints require more mortar—adjust your buffer accordingly.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-primary font-bold">3.</div>
                      <div>
                        <strong>Mix Consistency:</strong> Proper water-to-mortar ratio is critical. Too wet and it's
                        weak; too dry and it won't bond properly. Follow manufacturer guidelines.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-primary font-bold">4.</div>
                      <div>
                        <strong>Weather Considerations:</strong> Hot weather increases water evaporation. Cold weather
                        requires special additives. Plan accordingly and keep materials covered.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-primary font-bold">5.</div>
                      <div>
                        <strong>Store Properly:</strong> Keep bags off the ground and protected from moisture. Mortar
                        can harden if exposed to humidity even before mixing.
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-primary font-bold">6.</div>
                      <div>
                        <strong>Bulk vs. Bags:</strong> For projects over 1,000 units, bulk delivery becomes more
                        cost-effective. Requires proper storage and mixing equipment.
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber-600" />
                    Important Notes
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Yields are approximate and can vary based on joint thickness and workmanship</li>
                    <li>• Different mortar types (Type N, S, M) have similar yields but different strengths</li>
                    <li>• Weather conditions affect mortar consumption and working time</li>
                    <li>• Always check manufacturer specifications for exact yield rates</li>
                    <li>• Consider local building codes which may specify joint sizes</li>
                  </ul>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
