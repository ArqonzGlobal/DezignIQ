import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PowerFactorConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PowerFactorConverterModal = ({ open, onOpenChange }: PowerFactorConverterModalProps) => {
  const [kw, setKw] = useState<string>("");
  const [kva, setKva] = useState<string>("");
  const [kvar, setKvar] = useState<string>("");
  const [powerFactor, setPowerFactor] = useState<string>("0.85");

  const calculateFromKW = (kwValue: number, pf: number) => {
    const kvaValue = kwValue / pf;
    const kvarValue = Math.sqrt(kvaValue * kvaValue - kwValue * kwValue);
    setKva(kvaValue.toFixed(2));
    setKvar(kvarValue.toFixed(2));
  };

  const calculateFromKVA = (kvaValue: number, pf: number) => {
    const kwValue = kvaValue * pf;
    const kvarValue = Math.sqrt(kvaValue * kvaValue - kwValue * kwValue);
    setKw(kwValue.toFixed(2));
    setKvar(kvarValue.toFixed(2));
  };

  const calculateFromKVAR = (kvarValue: number, pf: number) => {
    const kwValue = kvarValue / Math.tan(Math.acos(pf));
    const kvaValue = Math.sqrt(kwValue * kwValue + kvarValue * kvarValue);
    setKw(kwValue.toFixed(2));
    setKva(kvaValue.toFixed(2));
  };

  const handleKWChange = (value: string) => {
    setKw(value);
    const kwValue = parseFloat(value);
    const pf = parseFloat(powerFactor);
    if (!isNaN(kwValue) && !isNaN(pf) && pf > 0 && pf <= 1) {
      calculateFromKW(kwValue, pf);
    }
  };

  const handleKVAChange = (value: string) => {
    setKva(value);
    const kvaValue = parseFloat(value);
    const pf = parseFloat(powerFactor);
    if (!isNaN(kvaValue) && !isNaN(pf) && pf > 0 && pf <= 1) {
      calculateFromKVA(kvaValue, pf);
    }
  };

  const handleKVARChange = (value: string) => {
    setKvar(value);
    const kvarValue = parseFloat(value);
    const pf = parseFloat(powerFactor);
    if (!isNaN(kvarValue) && !isNaN(pf) && pf > 0 && pf <= 1) {
      calculateFromKVAR(kvarValue, pf);
    }
  };

  const handlePFChange = (value: string) => {
    setPowerFactor(value);
    const pf = parseFloat(value);
    const kwValue = parseFloat(kw);
    if (!isNaN(kwValue) && !isNaN(pf) && pf > 0 && pf <= 1) {
      calculateFromKW(kwValue, pf);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Power Factor Converter (kW ↔ kVA ↔ kVAR)</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Power Factor (PF)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={powerFactor}
              onChange={(e) => handlePFChange(e.target.value)}
              placeholder="Enter power factor (0-1)"
            />
            <p className="text-xs text-muted-foreground">Typical range: 0.7-0.95 for industrial loads</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Real Power (kW)</Label>
              <Input
                type="number"
                value={kw}
                onChange={(e) => handleKWChange(e.target.value)}
                placeholder="Enter kW"
              />
            </div>

            <div className="space-y-2">
              <Label>Apparent Power (kVA)</Label>
              <Input
                type="number"
                value={kva}
                onChange={(e) => handleKVAChange(e.target.value)}
                placeholder="Enter kVA"
              />
            </div>

            <div className="space-y-2">
              <Label>Reactive Power (kVAR)</Label>
              <Input
                type="number"
                value={kvar}
                onChange={(e) => handleKVARChange(e.target.value)}
                placeholder="Enter kVAR"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-semibold">Power Triangle Formulas:</p>
            <p>• kW = kVA × PF (Real Power)</p>
            <p>• kVA = √(kW² + kVAR²) (Apparent Power)</p>
            <p>• kVAR = √(kVA² - kW²) (Reactive Power)</p>
            <p>• PF = kW / kVA (Power Factor)</p>
            <p className="text-muted-foreground italic mt-2">Enter any value to calculate the others</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
