import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface TemperatureConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemperatureConverterModal = ({ isOpen, onClose }: TemperatureConverterModalProps) => {
  const [fromUnit, setFromUnit] = useState("celsius");
  const [toUnit, setToUnit] = useState("fahrenheit");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string>("");

  const convertTemperature = (value: number, from: string, to: string): number => {
    let celsius: number;
    
    // Convert to Celsius first
    switch (from) {
      case "celsius":
        celsius = value;
        break;
      case "fahrenheit":
        celsius = (value - 32) * 5/9;
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }
    
    // Convert from Celsius to target unit
    switch (to) {
      case "celsius":
        return celsius;
      case "fahrenheit":
        return (celsius * 9/5) + 32;
      case "kelvin":
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      const resultValue = convertTemperature(value, fromUnit, toUnit);
      setResult(resultValue.toFixed(2));
    }
  };

  const handleReset = () => {
    setInputValue("");
    setResult("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Temperature Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Formulas</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From Unit</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">°C (Celsius)</SelectItem>
                      <SelectItem value="fahrenheit">°F (Fahrenheit)</SelectItem>
                      <SelectItem value="kelvin">K (Kelvin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>To Unit</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">°C (Celsius)</SelectItem>
                      <SelectItem value="fahrenheit">°F (Fahrenheit)</SelectItem>
                      <SelectItem value="kelvin">K (Kelvin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter temperature value"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleConvert}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                  Convert
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-md border border-input hover:bg-accent"
                >
                  Reset
                </button>
              </div>

              {result && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        {result}°{toUnit === "kelvin" ? "K" : toUnit === "celsius" ? "C" : "F"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {inputValue}°{fromUnit === "kelvin" ? "K" : fromUnit === "celsius" ? "C" : "F"} = {result}°{toUnit === "kelvin" ? "K" : toUnit === "celsius" ? "C" : "F"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <h3>Conversion Formulas</h3>
              <ul>
                <li><strong>°C to °F:</strong> (°C × 9/5) + 32</li>
                <li><strong>°F to °C:</strong> (°F - 32) × 5/9</li>
                <li><strong>°C to K:</strong> °C + 273.15</li>
                <li><strong>K to °C:</strong> K - 273.15</li>
                <li><strong>°F to K:</strong> (°F - 32) × 5/9 + 273.15</li>
                <li><strong>K to °F:</strong> (K - 273.15) × 9/5 + 32</li>
              </ul>

              <h3>Reference Points</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">°C</th>
                      <th className="border p-2">°F</th>
                      <th className="border p-2">K</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Absolute Zero</td>
                      <td className="border p-2">-273.15</td>
                      <td className="border p-2">-459.67</td>
                      <td className="border p-2">0</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Water Freezing</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">32</td>
                      <td className="border p-2">273.15</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Room Temperature</td>
                      <td className="border p-2">20</td>
                      <td className="border p-2">68</td>
                      <td className="border p-2">293.15</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Water Boiling</td>
                      <td className="border p-2">100</td>
                      <td className="border p-2">212</td>
                      <td className="border p-2">373.15</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
