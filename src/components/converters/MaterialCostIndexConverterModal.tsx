import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface MaterialCostIndexConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const regions = [
  { name: "National Average (Base)", key: "national", factor: 1.00 },
  { name: "Urban Metro (Tier-1)", key: "urban_metro", factor: 1.20 },
  { name: "Urban (Tier-2)", key: "urban", factor: 1.10 },
  { name: "Semi-Urban", key: "semi_urban", factor: 1.05 },
  { name: "Rural", key: "rural", factor: 0.85 }
];

const inflationYears = [
  { year: "2024", key: "2024", factor: 1.00 },
  { year: "2023", key: "2023", factor: 0.95 },
  { year: "2022", key: "2022", factor: 0.90 },
  { year: "2021", key: "2021", factor: 0.85 },
  { year: "2020", key: "2020", factor: 0.80 }
];

export const MaterialCostIndexConverterModal = ({ isOpen, onClose }: MaterialCostIndexConverterModalProps) => {
  const [baseRegion, setBaseRegion] = useState("national");
  const [targetRegion, setTargetRegion] = useState("urban_metro");
  const [baseYear, setBaseYear] = useState("2023");
  const [targetYear, setTargetYear] = useState("2024");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const baseRegionFactor = regions.find(r => r.key === baseRegion)?.factor || 1;
    const targetRegionFactor = regions.find(r => r.key === targetRegion)?.factor || 1;
    const baseYearFactor = inflationYears.find(y => y.key === baseYear)?.factor || 1;
    const targetYearFactor = inflationYears.find(y => y.key === targetYear)?.factor || 1;

    const resultValue = value * (targetRegionFactor / baseRegionFactor) * (targetYearFactor / baseYearFactor);
    setResult(resultValue.toFixed(2));
  };

  const handleReset = () => {
    setInputValue("");
    setResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Material Cost Index Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Base Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Base Region</Label>
                  <Select value={baseRegion} onValueChange={setBaseRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.key} value={region.key}>{region.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Base Year</Label>
                  <Select value={baseYear} onValueChange={setBaseYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {inflationYears.map(year => (
                        <SelectItem key={year.key} value={year.key}>{year.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <h3 className="font-semibold">Target Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Region</Label>
                  <Select value={targetRegion} onValueChange={setTargetRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.key} value={region.key}>{region.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Year</Label>
                  <Select value={targetYear} onValueChange={setTargetYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {inflationYears.map(year => (
                        <SelectItem key={year.key} value={year.key}>{year.year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Base Cost Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter base cost"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleConvert} className="flex-1">Calculate Adjusted Cost</Button>
                <Button onClick={handleReset} variant="outline">Reset</Button>
              </div>

              {result && (
                <Card className="p-4 bg-muted">
                  <p className="text-lg font-semibold">Adjusted Cost: {result}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Cost adjusted for region and year differences
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Regional Cost Factors</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Urban Metro (Tier-1): 120% of national average</li>
                  <li>Urban (Tier-2): 110% of national average</li>
                  <li>Semi-Urban: 105% of national average</li>
                  <li>Rural: 85% of national average</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Inflation Factors</h3>
                <p className="text-sm text-muted-foreground">
                  Year-over-year factors account for material price inflation. Values are approximate 
                  and based on construction industry indices.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Historical cost data adjustment to current prices</li>
                  <li>Multi-location project cost comparison</li>
                  <li>Budget escalation calculations</li>
                  <li>Tender evaluation across different regions and time periods</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Formula</h3>
                <p className="text-sm">
                  Adjusted Cost = Base Cost × (Target Region Factor / Base Region Factor) × (Target Year Factor / Base Year Factor)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
