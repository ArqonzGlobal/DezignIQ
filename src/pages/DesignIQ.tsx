import { useState } from "react";
import { Header } from "@/components/Header";
import { ToolsOverview } from "@/components/ToolsOverview";
import { ConstructionCalculatorTools } from "@/components/ConstructionCalculatorTools";
import { ImageHistory } from "@/components/ImageHistory";
import { useImageHistory } from "@/hooks/useImageHistory";

// AI Tool Modals
import { InteriorAIModal } from "@/components/InteriorAIModal";
import { ExteriorAIModal } from "@/components/ExteriorAIModal";
import { SketchToImageModal } from "@/components/SketchToImageModal";
import { StyleTransferModal } from "@/components/StyleTransferModal";
import { RenderEnhancerModal } from "@/components/RenderEnhancerModal";
import { VirtualStagingModal } from "@/components/VirtualStagingModal";
import { ImagineAIModal } from "@/components/ImagineAIModal";
import { InpaintingAIModal } from "@/components/InpaintingAIModal";
import { AIEraserModal } from "@/components/AIEraserModal";
import { FourKUpscalerModal } from "@/components/FourKUpscalerModal";
import { VideoAIModal } from "@/components/VideoAIModal";
import { PromptGeneratorModal } from "@/components/PromptGeneratorModal";

// Calculator Modals
import { CementCalculatorModal } from "@/components/calculators/CementCalculatorModal";
import { ConcreteCalculatorModal } from "@/components/calculators/ConcreteCalculatorModal";
import { ConcreteBlockCalculatorModal } from "@/components/calculators/ConcreteBlockCalculatorModal";
import { ConcreteBlockFillCalculatorModal } from "@/components/calculators/ConcreteBlockFillCalculatorModal";
import { ConcreteColumnCalculatorModal } from "@/components/calculators/ConcreteColumnCalculatorModal";
import { ConcreteStairsCalculatorModal } from "@/components/calculators/ConcreteStairsCalculatorModal";
import { ConcreteEstimatorTubeModal } from "@/components/calculators/ConcreteEstimatorTubeModal";
import { ConcreteWeightCalculatorModal } from "@/components/calculators/ConcreteWeightCalculatorModal";
import { ConcreteTypeWeightCalculatorModal } from "@/components/calculators/ConcreteTypeWeightCalculatorModal";
import { GroutCalculatorModal } from "@/components/calculators/GroutCalculatorModal";
import { HoleVolumeCalculatorModal } from "@/components/calculators/HoleVolumeCalculatorModal";
import { MortarCalculatorModal } from "@/components/calculators/MortarCalculatorModal";
import { ThinsetCalculatorModal } from "@/components/calculators/ThinsetCalculatorModal";
import { BrickCalculatorModal } from "@/components/calculators/BrickCalculatorModal";
import { VastuCalculatorModal } from "@/components/calculators/VastuCalculatorModal";
import { BoardFootCalculatorModal } from "@/components/calculators/BoardFootCalculatorModal";

const DesignIQ = () => {
  const [showCalculators, setShowCalculators] = useState(false);
  const [isInteriorAIOpen, setIsInteriorAIOpen] = useState(false);
  const [isExteriorAIOpen, setIsExteriorAIOpen] = useState(false);
  const [isSketchToImageOpen, setIsSketchToImageOpen] = useState(false);
  const [isStyleTransferOpen, setIsStyleTransferOpen] = useState(false);
  const [isRenderEnhancerOpen, setIsRenderEnhancerOpen] = useState(false);
  const [isVirtualStagingOpen, setIsVirtualStagingOpen] = useState(false);
  const [isImagineAIOpen, setIsImagineAIOpen] = useState(false);
  const [isInpaintingAIOpen, setIsInpaintingAIOpen] = useState(false);
  const [isAIEraserOpen, setIsAIEraserOpen] = useState(false);
  const [is4KUpscalerOpen, setIs4KUpscalerOpen] = useState(false);
  const [isVideoAIOpen, setIsVideoAIOpen] = useState(false);
  const [isPromptGeneratorOpen, setIsPromptGeneratorOpen] = useState(false);

  // Calculator modals
  const [showCementCalculator, setShowCementCalculator] = useState(false);
  const [showConcreteCalculator, setShowConcreteCalculator] = useState(false);
  const [showConcreteBlockCalculator, setShowConcreteBlockCalculator] = useState(false);
  const [showConcreteBlockFillCalculator, setShowConcreteBlockFillCalculator] = useState(false);
  const [showConcreteColumnCalculator, setShowConcreteColumnCalculator] = useState(false);
  const [showConcreteStairsCalculator, setShowConcreteStairsCalculator] = useState(false);
  const [showConcreteEstimatorTube, setShowConcreteEstimatorTube] = useState(false);
  const [showConcreteWeightCalculator, setShowConcreteWeightCalculator] = useState(false);
  const [showConcreteDrivewayCostCalculator, setShowConcreteDrivewayCostCalculator] = useState(false);
  const [showGroutCalculator, setShowGroutCalculator] = useState(false);
  const [showHoleVolumeCalculator, setShowHoleVolumeCalculator] = useState(false);
  const [showMortarCalculator, setShowMortarCalculator] = useState(false);
  const [showThinsetCalculator, setShowThinsetCalculator] = useState(false);
  const [showBrickCalculator, setShowBrickCalculator] = useState(false);
  const [showVastuCalculator, setShowVastuCalculator] = useState(false);
  const [showBoardFootCalculator, setShowBoardFootCalculator] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { history, addToHistory, removeFromHistory, clearHistory } = useImageHistory();

  const handleImageGenerated = (item: { imageUrl: string; toolName: string; prompt?: string }) => {
    addToHistory(item);
  };

  return (
    <div className="min-h-screen bg-background">
       <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main>
        {!showCalculators ? (
          <ToolsOverview
            onLaunchInteriorAI={() => setIsInteriorAIOpen(true)}
            onLaunchExteriorAI={() => setIsExteriorAIOpen(true)}
            onLaunchSketchToImage={() => setIsSketchToImageOpen(true)}
            onLaunchStyleTransfer={() => setIsStyleTransferOpen(true)}
            onLaunchRenderEnhancer={() => setIsRenderEnhancerOpen(true)}
            onLaunchVirtualStaging={() => setIsVirtualStagingOpen(true)}
            onLaunchImagineAI={() => setIsImagineAIOpen(true)}
            onLaunchInpaintingAI={() => setIsInpaintingAIOpen(true)}
            onLaunchAIEraser={() => setIsAIEraserOpen(true)}
            onLaunchFourKUpscaler={() => setIs4KUpscalerOpen(true)}
            onLaunchVideoAI={() => setIsVideoAIOpen(true)}
            onLaunchPromptGenerator={() => setIsPromptGeneratorOpen(true)}
            searchQuery={searchQuery}
          />
        ) : (
          <ConstructionCalculatorTools
            onLaunchCementCalculator={() => setShowCementCalculator(true)}
            onLaunchConcreteCalculator={() => setShowConcreteCalculator(true)}
            onLaunchConcreteBlockCalculator={() => setShowConcreteBlockCalculator(true)}
            onLaunchConcreteBlockFillCalculator={() => setShowConcreteBlockFillCalculator(true)}
            onLaunchConcreteColumnCalculator={() => setShowConcreteColumnCalculator(true)}
            onLaunchConcreteStairsCalculator={() => setShowConcreteStairsCalculator(true)}
            onLaunchConcreteEstimatorTube={() => setShowConcreteEstimatorTube(true)}
            onLaunchConcreteWeightCalculator={() => setShowConcreteWeightCalculator(true)}
            onLaunchConcreteDrivewayCostCalculator={() => setShowConcreteDrivewayCostCalculator(true)}
            onLaunchGroutCalculator={() => setShowGroutCalculator(true)}
            onLaunchHoleVolumeCalculator={() => setShowHoleVolumeCalculator(true)}
            onLaunchMortarCalculator={() => setShowMortarCalculator(true)}
            onLaunchThinsetCalculator={() => setShowThinsetCalculator(true)}
            onLaunchBrickCalculator={() => setShowBrickCalculator(true)}
            onLaunchVastuCalculator={() => setShowVastuCalculator(true)}
            onLaunchBoardFootCalculator={() => setShowBoardFootCalculator(true)}
            onLaunchCubicYardCalculator={() => {}}
            onLaunchGallonsPerSquareFootCalculator={() => {}}
          />
        )}
      </main>

      {/* AI Tool Modals */}
      <InteriorAIModal
        isOpen={isInteriorAIOpen}
        onClose={() => setIsInteriorAIOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <ExteriorAIModal
        isOpen={isExteriorAIOpen}
        onClose={() => setIsExteriorAIOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <SketchToImageModal
        isOpen={isSketchToImageOpen}
        onClose={() => setIsSketchToImageOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <StyleTransferModal
        isOpen={isStyleTransferOpen}
        onClose={() => setIsStyleTransferOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <RenderEnhancerModal
        isOpen={isRenderEnhancerOpen}
        onClose={() => setIsRenderEnhancerOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <VirtualStagingModal
        isOpen={isVirtualStagingOpen}
        onClose={() => setIsVirtualStagingOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <ImagineAIModal
        isOpen={isImagineAIOpen}
        onClose={() => setIsImagineAIOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <InpaintingAIModal
        isOpen={isInpaintingAIOpen}
        onClose={() => setIsInpaintingAIOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <AIEraserModal
        isOpen={isAIEraserOpen}
        onClose={() => setIsAIEraserOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <FourKUpscalerModal
        isOpen={is4KUpscalerOpen}
        onClose={() => setIs4KUpscalerOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
      <VideoAIModal
        isOpen={isVideoAIOpen}
        onClose={() => setIsVideoAIOpen(false)}
      />
      <PromptGeneratorModal
        isOpen={isPromptGeneratorOpen}
        onClose={() => setIsPromptGeneratorOpen(false)}
      />

      {/* Calculator Modals */}
      <CementCalculatorModal 
        isOpen={showCementCalculator}
        onClose={() => setShowCementCalculator(false)}
      />
      
      <ConcreteCalculatorModal 
        isOpen={showConcreteCalculator}
        onClose={() => setShowConcreteCalculator(false)}
      />
      
      <ConcreteBlockCalculatorModal 
        isOpen={showConcreteBlockCalculator}
        onClose={() => setShowConcreteBlockCalculator(false)}
      />
      
      <ConcreteBlockFillCalculatorModal 
        isOpen={showConcreteBlockFillCalculator}
        onClose={() => setShowConcreteBlockFillCalculator(false)}
      />
      
      <ConcreteColumnCalculatorModal 
        isOpen={showConcreteColumnCalculator}
        onClose={() => setShowConcreteColumnCalculator(false)}
      />
      
      <ConcreteStairsCalculatorModal 
        isOpen={showConcreteStairsCalculator}
        onClose={() => setShowConcreteStairsCalculator(false)}
      />
      
      <ConcreteEstimatorTubeModal 
        isOpen={showConcreteEstimatorTube}
        onClose={() => setShowConcreteEstimatorTube(false)}
      />
      
      <ConcreteWeightCalculatorModal 
        isOpen={showConcreteWeightCalculator}
        onClose={() => setShowConcreteWeightCalculator(false)}
      />
      
      <ConcreteTypeWeightCalculatorModal 
        isOpen={showConcreteDrivewayCostCalculator}
        onClose={() => setShowConcreteDrivewayCostCalculator(false)}
      />
      
      <GroutCalculatorModal
        isOpen={showGroutCalculator}
        onClose={() => setShowGroutCalculator(false)}
      />
      
      <HoleVolumeCalculatorModal 
        isOpen={showHoleVolumeCalculator}
        onClose={() => setShowHoleVolumeCalculator(false)}
      />
      
      <MortarCalculatorModal 
        isOpen={showMortarCalculator}
        onClose={() => setShowMortarCalculator(false)}
      />
      
      <ThinsetCalculatorModal 
        isOpen={showThinsetCalculator}
        onClose={() => setShowThinsetCalculator(false)}
      />
      
      <BrickCalculatorModal 
        isOpen={showBrickCalculator}
        onClose={() => setShowBrickCalculator(false)}
      />
      
      <VastuCalculatorModal 
        isOpen={showVastuCalculator}
        onClose={() => setShowVastuCalculator(false)}
      />
      
      <BoardFootCalculatorModal 
        isOpen={showBoardFootCalculator}
        onClose={() => setShowBoardFootCalculator(false)}
      />

      <ImageHistory
        history={history}
        onRemove={removeFromHistory}
        onClear={clearHistory}
      />
    </div>
  );
};

export default DesignIQ;
