import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies = [
  { unit: "USD - US Dollar", key: "usd", factor: 1 },
  { unit: "EUR - Euro", key: "eur", factor: 0.92 },
  { unit: "GBP - British Pound", key: "gbp", factor: 0.79 },
  { unit: "INR - Indian Rupee", key: "inr", factor: 83.12 },
  { unit: "JPY - Japanese Yen", key: "jpy", factor: 149.50 },
  { unit: "CNY - Chinese Yuan", key: "cny", factor: 7.24 },
  { unit: "AUD - Australian Dollar", key: "aud", factor: 1.53 },
  { unit: "CAD - Canadian Dollar", key: "cad", factor: 1.36 }
];

export const CurrencyConverterModal = ({ isOpen, onClose }: CurrencyConverterModalProps) => {
  const [fromCurrency, setFromCurrency] = useState("usd");
  const [toCurrency, setToCurrency] = useState("inr");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const fromFactor = currencies.find(c => c.key === fromCurrency)?.factor || 1;
    const toFactor = currencies.find(c => c.key === toCurrency)?.factor || 1;

    const resultValue = (value * toFactor) / fromFactor;
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
          <DialogTitle>Currency Converter</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="guide">Guide & Info</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Currency</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.key} value={currency.key}>{currency.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Currency</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.key} value={currency.key}>{currency.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConvert} className="flex-1">Convert</Button>
              <Button onClick={handleReset} variant="outline">Reset</Button>
            </div>

            {result && (
              <Card className="p-4 bg-muted">
                <p className="text-lg font-semibold">Result: {result} {currencies.find(c => c.key === toCurrency)?.key.toUpperCase()}</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Note on Exchange Rates</h3>
                <p className="text-sm text-muted-foreground">
                  The exchange rates used in this converter are approximate and for reference only. 
                  For accurate, real-time rates, please consult financial institutions or currency exchange services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Applications</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>International project budgeting and cost estimation</li>
                  <li>Cross-border material procurement</li>
                  <li>Global tendering and contract negotiations</li>
                  <li>Multi-currency financial reporting</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Supported Currencies</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>USD, EUR, GBP - Major global currencies</li>
                  <li>INR, JPY, CNY - Asian market currencies</li>
                  <li>AUD, CAD - Commonwealth currencies</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
