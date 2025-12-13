import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HoleVolumeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HoleVolumeCalculatorModal = ({ isOpen, onClose }: HoleVolumeCalculatorModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hole Volume Calculator</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <p className="text-muted-foreground">Hole volume calculator functionality coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
