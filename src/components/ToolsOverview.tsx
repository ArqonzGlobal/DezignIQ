import { useState } from "react";
import { NavigationTabs } from "./NavigationTabs";
import { ToolCard } from "./ToolCard";
import { useUser } from "@/contexts/UserContext";
import { NotLoggedInModal } from "@/components/NotLoggedInModal";
import exteriorPreview from "@/assets/exterior-ai-preview.jpg";
import interiorPreview from "@/assets/interior-ai-preview.jpg";
import renderPreview from "@/assets/render-enhancer-preview.jpg";
import stylePreview from "@/assets/style-transfer-preview.jpg";
import sketchToImagePreview from "@/assets/sketch-to-image-preview.png";
import fourKUpscalerImg from "@/assets/DezignIQ/4KUpscaler.png";
import aiEraserImg from "@/assets/DezignIQ/AIEraser.png";
import imagineAIImg from "@/assets/DezignIQ/ImagineAI.png";
import inpaintingAIImg from "@/assets/DezignIQ/InpaintingAI.png";
import promptGeneratorImg from "@/assets/DezignIQ/PromptGenerator.png";
import videoAIImg from "@/assets/DezignIQ/VideoAI.png";
import virtualStagingImg from "@/assets/DezignIQ/VirtualStaging.png";

interface ToolsOverviewProps {
  onLaunchInteriorAI: () => void;
  onLaunchExteriorAI: () => void;
  onLaunchSketchToImage: () => void;
  onLaunchInpaintingAI: () => void;
  onLaunchImagineAI: () => void;
  onLaunchStyleTransfer: () => void;
  onLaunchRenderEnhancer: () => void;
  onLaunchVirtualStaging: () => void;
  onLaunchAIEraser: () => void;
  onLaunchFourKUpscaler: () => void;
  onLaunchPromptGenerator: () => void;
  onLaunchVideoAI: () => void;
  searchQuery: string;
}

const tools = [
  {
    id: 'interior-ai',
    title: 'Interior AI',
    description: 'Upload a sketch or model to redesign your interior space with more than 30 unique styles.',
    image: interiorPreview,
    credits: 1,
    category: 'ai-enhancements',
  },
  {
    id: 'exterior-ai',
    title: 'Exterior AI',
    description: 'Render or redesign your exterior design in seconds. Just upload a photo or sketch and see the magic in action.',
    image: exteriorPreview,
    credits: 1,
    category: 'ai-enhancements',
  },
  {
    id: 'sketch-to-image',
    title: 'Sketch to Image',
    description: 'Convert architectural sketches into photorealistic renders with AI technology.',
    image: sketchToImagePreview,
    credits: 1,
    category: 'image-tools',
  },
  {
    id: 'imagine-ai',
    title: 'Imagine AI',
    description: 'Transform your architectural concepts into stunning visualizations with AI-powered imagination.',
    image: imagineAIImg,
    credits: 1,
    category: 'concept-tools',
  },
  {
    id: 'style-transfer',
    title: 'Style Transfer',
    description: 'Apply different architectural styles to your renders and designs with AI precision.',
    image: stylePreview,
    credits: 1,
    category: 'ai-enhancements',
  },
  {
    id: 'render-enhancer',
    title: 'Render Enhancer',
    description: 'Enhance Lumion, enscape, vray, sketchup, revit renders and upscale quality renders upon 8k.',
    image: renderPreview,
    credits: 1,
    category: 'ai-enhancements',
  },
  {
    id: 'virtual-staging',
    title: 'Virtual Staging',
    description: 'Stage empty spaces with furniture and decor using AI to showcase potential layouts.',
    image: virtualStagingImg,
    credits: 1,
    category: 'concept-tools',
  },
  {
    id: 'ai-eraser',
    title: 'AI Eraser',
    description: 'Remove unwanted objects from your architectural images with intelligent AI filling.',
    image: aiEraserImg,
    credits: 1,
    category: 'edit-modify',
  },
  {
    id: '4k-upscaler',
    title: '4K Upscaler',
    description: 'Enhance image resolution up to 4K while maintaining architectural details and quality.',
    image: fourKUpscalerImg,
    credits: 1,
    category: 'image-tools',
  },
  {
    id: 'inpainting-ai',
    title: 'Inpainting AI',
    description: 'Fill missing parts of images or modify specific areas with AI-powered inpainting.',
    image: inpaintingAIImg,
    credits: 1,
    category: 'edit-modify',
  },
  {
    id: 'prompt-generator',
    title: 'Prompt Generator',
    description: 'Analyze architectural images and generate detailed prompts for AI models.',
    image: promptGeneratorImg,
    credits: 1,
    category: 'ai-enhancements',
  },
  {
    id: 'video-ai',
    title: 'Video AI',
    description: 'Transform static architectural images into dynamic video animations with AI.',
    image: videoAIImg,
    credits: 1,
    category: 'concept-tools',
  },
];

export const ToolsOverview = ({ onLaunchInteriorAI, onLaunchExteriorAI, onLaunchSketchToImage, onLaunchInpaintingAI, onLaunchImagineAI, onLaunchStyleTransfer, onLaunchRenderEnhancer, onLaunchVirtualStaging, onLaunchAIEraser, onLaunchFourKUpscaler, onLaunchPromptGenerator, onLaunchVideoAI, searchQuery }: ToolsOverviewProps) => {
  const [activeTab, setActiveTab] = useState('all-tools');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { isLoggedIn } = useUser();

  const handleLaunchTool = (toolId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    console.log("is logged in:"+ isLoggedIn);

    switch (toolId) {
      case 'interior-ai':
        onLaunchInteriorAI();
        break;
      case 'exterior-ai':
        onLaunchExteriorAI();
        break;
      case 'sketch-to-image':
        onLaunchSketchToImage();
        break;
      case 'inpainting-ai':
        onLaunchInpaintingAI();
        break;
      case 'imagine-ai':
        onLaunchImagineAI();
        break;
      case 'style-transfer':
        onLaunchStyleTransfer();
        break;
      case 'render-enhancer':
        onLaunchRenderEnhancer();
        break;
      case 'virtual-staging':
        onLaunchVirtualStaging();
        break;
      case 'ai-eraser':
        onLaunchAIEraser();
        break;
      case '4k-upscaler':
        onLaunchFourKUpscaler();
        break;
      case 'prompt-generator':
        onLaunchPromptGenerator();
        break;
      case 'video-ai':
        onLaunchVideoAI();
        break;
      default:
        // For demo - show coming soon for other tools
        alert(`${tools.find(t => t.id === toolId)?.title} - Coming Soon!`);
    }
  };

   const filteredTools = tools.filter(tool => {
      const matchesTab =
        activeTab === "all-tools" || tool.category === activeTab;

      const matchesSearch =
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <NotLoggedInModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">DesignIQ</h1>
          
          <NavigationTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              image={tool.image}
              credits={tool.credits}
              onLaunch={() => handleLaunchTool(tool.id)}
            />
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools available...</p>
          </div>
        )}
      </div>
    </div>
  );
};