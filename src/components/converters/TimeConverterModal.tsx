import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeConverterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimeConverterModal({ open, onOpenChange }: TimeConverterModalProps) {
  const [hours, setHours] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [weeks, setWeeks] = useState<string>("");

  const handleHoursChange = (value: string) => {
    setHours(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setDays((num / 24).toFixed(4));
      setWeeks((num / 168).toFixed(4));
    } else {
      setDays("");
      setWeeks("");
    }
  };

  const handleDaysChange = (value: string) => {
    setDays(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setHours((num * 24).toFixed(2));
      setWeeks((num / 7).toFixed(4));
    } else {
      setHours("");
      setWeeks("");
    }
  };

  const handleWeeksChange = (value: string) => {
    setWeeks(value);
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setHours((num * 168).toFixed(2));
      setDays((num * 7).toFixed(2));
    } else {
      setHours("");
      setDays("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Time Converter</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                placeholder="Enter hours"
                value={hours}
                onChange={(e) => handleHoursChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="days">Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="Enter days"
                value={days}
                onChange={(e) => handleDaysChange(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weeks">Weeks</Label>
              <Input
                id="weeks"
                type="number"
                placeholder="Enter weeks"
                value={weeks}
                onChange={(e) => handleWeeksChange(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Conversion Reference:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1 day = 24 hours</li>
              <li>• 1 week = 7 days = 168 hours</li>
              <li>• 1 month ≈ 4.33 weeks ≈ 730 hours</li>
            </ul>
            <h3 className="font-semibold mt-4">Project Scheduling Use:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Converting labor hours to project duration</li>
              <li>• Estimating project timelines</li>
              <li>• Resource allocation planning</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
