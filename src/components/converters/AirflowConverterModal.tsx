import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AirflowConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AirflowUnit = "cfm" | "m3s" | "lps" | "m3hr" | "cmh";

const airflowUnits: { value: AirflowUnit; label: string }[] = [
  { value: "cfm", label: "Cubic feet per minute (CFM)" },
  { value: "m3s", label: "Cubic meters per second (m³/s)" },
  { value: "m3hr", label: "Cubic meters per hour (m³/hr)" },
  { value: "cmh", label: "CMH (same as m³/hr)" },
  { value: "lps", label: "Liters per second (L/s)" },
];

export const AirflowConverterModal = ({ open, onOpenChange }: AirflowConverterModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<AirflowUnit>("cfm");
  const [toUnit, setToUnit] = useState<AirflowUnit>("m3s");

  const convertAirflow = (value: number, from: AirflowUnit, to: AirflowUnit): number => {
    if (from === to) return value;
    
    // Convert to CFM first
    let cfm = value;
    if (from === "m3s") cfm = value * 2118.88;
    if (from === "m3hr" || from === "cmh") cfm = value * 0.588578;
    if (from === "lps") cfm = value * 2.11888;
    
    // Convert from CFM to target unit
    if (to === "cfm") return cfm;
    if (to === "m3s") return cfm / 2118.88;
    if (to === "m3hr" || to === "cmh") return cfm / 0.588578;
    if (to === "lps") return cfm / 2.11888;
    
    return value;
  };

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "0.00";
    return convertAirflow(value, fromUnit, toUnit).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Airflow Converter</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Unit</Label>
              <Select value={fromUnit} onValueChange={(v) => setFromUnit(v as AirflowUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {airflowUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter airflow"
              />
            </div>

            <div className="space-y-2">
              <Label>To Unit</Label>
              <Select value={toUnit} onValueChange={(v) => setToUnit(v as AirflowUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {airflowUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={handleConvert()}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
            <p className="font-semibold">HVAC Airflow Applications:</p>
            <p>• Residential HVAC: 300-2000 CFM</p>
            <p>• Commercial office: 2000-10000 CFM</p>
            <p>• Industrial ventilation: 10000+ CFM</p>
            <p>• 1 CFM ≈ 0.4719 L/s ≈ 1.699 m³/hr</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
