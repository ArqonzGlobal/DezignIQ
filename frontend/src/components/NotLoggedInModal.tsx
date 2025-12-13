import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface NotLoggedInModalProps {
  open: boolean;
  onClose: () => void;
}

export const NotLoggedInModal = ({ open, onClose }: NotLoggedInModalProps) => {
  const navigate = useNavigate();

  function handleSignIn() {
    navigate("/login");  
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Sign In Required</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          To use this AI tool, you must be signed in.
        </p>

        <DialogFooter>
          <Button onClick={handleSignIn} className="bg-primary hover:bg-primary-light">
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
