import { useState } from "react";
import { ToolCard } from "./ToolCard";
import { Calculator, DoorClosed } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import calculator images
import cementCalculator from "@/assets/calculators/cement-calculator.png";
import concreteCalculator from "@/assets/calculators/concrete-calculator.png";
import concreteBlockCalculator from "@/assets/calculators/concrete-block-calculator.png";
import concreteBlockFillCalculator from "@/assets/calculators/concrete-block-fill-calculator.png";
import columnCalculator from "@/assets/calculators/column-calculator.png";
import concreteStairsCalculator from "@/assets/calculators/concrete-staircase-calculator.png";
import concreteEstimaterTube from "@/assets/calculators/concrete-estimater-tube.png";
import concreteWeightCalculator from "@/assets/calculators/concrete-weight-calculator.png";
import brickCalculator from "@/assets/calculators/brick-calculator.png";
import groutCalculator from "@/assets/calculators/grout-calculator.png";
import mortarCalculator from "@/assets/calculators/mortar-calculator.png";
import thinsetCalculator from "@/assets/calculators/thinset-calculator.png";
import tileCalculator from "@/assets/calculators/tile-calculator.png";
import boardFoodCalculator from "@/assets/calculators/board-foot-calculator.png";
import cubicyardCalculator from "@/assets/calculators/cubic-yard-calculator.png";
import gallonsPerSquareFootCalculator from "@/assets/calculators/gallons-per-square-foot-calculator.png";
import sealentCalculator from "@/assets/calculators/sealent-calculator.png";
import sizeToWeightCalculator from "@/assets/calculators/size-to-weight-calculator.png";
import squarefeetToCubicYardsCalculator from "@/assets/calculators/squarefeet-to-cubicyard-calculator.png";
import squareFootageCalculator from "@/assets/calculators/squarefootage-calculator.png";
import squaryardCalculator from "@/assets/calculators/squareyard-calculator.png";
import squaryardsCalculator from "@/assets/calculators/squareyards-calculator.png";
import holeVolumeCalculator from "@/assets/calculators/hole-volume-calculator.png";
import tankVolumeCalculator from "@/assets/calculators/tank-volume-calculator.png";
import aluminumWeightCalculator from "@/assets/calculators/aluminum-weight-calculator.png";
import metalSteelCalculator from "@/assets/calculators/metal-steel-calculator.png";
import pipeWeightCalculator from "@/assets/calculators/pipe-weight-calculator.png";
import plateWeightCalculator from "@/assets/calculators/plate-weight-calculator.png";
import steelPlateWeightCalculator from "@/assets/calculators/steel-plate-weight-calculator.png";
import steelWeightCalculator from "@/assets/calculators/steel-weight-calculator.png";
import glassWeightCalculator from "@/assets/calculators/glass-weight-calculator.png";
import stoneWeightCalculator from "@/assets/calculators/stone-weight-calcultor.png";
import logWeightCalculator from "@/assets/calculators/log-weight-calculator.png";
import tonnageCalculator from "@/assets/calculators/tonnage-calculator.png";
import lumberCalculator from "@/assets/calculators/lumber-calculator.png";
import framingCalculator from "@/assets/calculators/framing-calculator.png";
import plywoodCalculator from "@/assets/calculators/plywood-calculator.png";
import boardAndBettenCalculator from "@/assets/calculators/board-batten-calculator.png";
import shiplapCalculator from "@/assets/calculators/shiplap-calculator.png";
import wainscotingCalculator from "@/assets/calculators/wainscoting-calculator.png";
import roofingCalculator from "@/assets/calculators/roofing-calculator.png";
import roofPitchCalculator from "@/assets/calculators/roofptich-calculator.png";
import roofShingleCalculator from "@/assets/calculators/roof-shingle-calculator.png";
import roofTrussCalculator from "@/assets/calculators/roof-truss-calculator.png";
import rafterLeangthCalculator from "@/assets/calculators/rafter-length-calculator.png";
import gambrelRoofCalculator from "@/assets/calculators/gambrel-roof-calculator.png";
import metalRoofCalculator from "@/assets/calculators/metal-roof-cost-calculator.png";
import snowLoadCalculator from "@/assets/calculators/snow-load-calculator.png";
import acTonnageCalculator from "@/assets/calculators/ac-tonnage-calculator.png";
import airChangesPerHourCalculator from "@/assets/calculators/air-changes-per-hour-calculator.png";
import airConditionerBtuCalculator from "@/assets/calculators/airconditioner-btu-calculator.png";
import boilerSizeCalculator from "@/assets/calculators/boiler-size-calculator.png";
import furnaceSizeCalculator from "@/assets/calculators/furnace-size-calculator.png";
import heatLossCalculator from "@/assets/calculators/heat-loss-calculator.png";
import cfmCalculator from "@/assets/calculators/cfm-calculator.png";
import fireFlowCalculator from "@/assets/calculators/fire-flow-calculator.png";
import gallonsPerMinuteCalculator from "@/assets/calculators/gallons-per-minute-calculator.png";
import litersPerMinuteCalculator from "@/assets/calculators/liters-per-minute-calculator.png";
import pondCalculator from "@/assets/calculators/pond-calculator.png";
import poolCalculator from "@/assets/calculators/pool-calculator.png";
import beamDeflectionCalculator from "@/assets/calculators/beam-deflection-calculator.png";
import beamLoadCalculator from "@/assets/calculators/beam-load-calculator.png";
import bendingStressCalculator from "@/assets/calculators/bending-stress-calculator.png";
import DoorHeaderSizeCalculator from "@/assets/calculators/door-header-size-calculator.png";
import floorJoistCalculator from "@/assets/calculators/floor-joist-calculator.png";
import woodBeamSpanCalculator from "@/assets/calculators/wood-beam-span-calculator.png";
import rebarCalculator from "@/assets/calculators/rebar-calculator.png";
import weldingCalculator from "@/assets/calculators/welding-calculator.png";
import balusterCalculator from "@/assets/calculators/baluster-calculator.png";
import boldTorqueCalculator from "@/assets/calculators/bolt-torque-calculator.png";
import deckingCalculator from "@/assets/calculators/decking-calculator.png";
import fenceCalculator from "@/assets/calculators/fence-calculator.png";
import rectangleFencePerimeterCalculator from "@/assets/calculators/rectangle-fence-perimeter-calculator.png";
import fencePostDepthCalculator from "@/assets/calculators/fence-post-depth-calculator.png";
import vinylFencingCalculator from "@/assets/calculators/vinyl-fence-calculator.png";
import gravelCalculator from "@/assets/calculators/gravel-calculator.png";
import limestoneCalculator from "@/assets/calculators/limestone-calculator.png";
import riverrockCalculator from "@/assets/calculators/river-rock-calculator.png";
import ripRapCalculator from "@/assets/calculators/rip-rap-calculator.png";
import sandCalculator from "@/assets/calculators/sand-calculator.png";
import paverCalcualator from "@/assets/calculators/paver-calculator.png";
import paverSandCalculator from "@/assets/calculators/paver-sand-calculator.png";
import asphaltCalculator from "@/assets/calculators/asphalt-calculator.png";
import gravelDrivewayCalculator from "@/assets/calculators/gravel-driveway-calculator.png";
import crushedStoneCalculator from "@/assets/calculators/crushed-stones-calculator.png";
import roadBaseCalculator from "@/assets/calculators/road-base-calculator.png";
import retainingWallCalculator from "@/assets/calculators/retaining-wall-calculator.png";
import frenchDrainCalculator from "@/assets/calculators/french-drain-calculator.png";
import fireGlassCalculator from "@/assets/calculators/fire-glass-calculator.png";
import hoopHouseCalculator from "@/assets/calculators/hoop-house-calculator.png";
import chickenCoopCalculator from "@/assets/calculators/chicken-coop-size-calculator.png";
import carpetCalculator from "@/assets/calculators/carpet-calculator.png";
import flooringCalculator from "@/assets/calculators/flooring-calculator.png";
import drywallCalculator from "@/assets/calculators/drywall-calculator.png";
import paintCalculator from "@/assets/calculators/paint-calculator.png";
import wallpaperCalculator from "@/assets/calculators/wallpaper-calculator.png";
import sidingCalculator from "@/assets/calculators/siding-calculator.png";
import vinylSidingCalculator from "@/assets/calculators/vinyl-siding-calculator.png";
import insulationCalculator from "@/assets/calculators/insulation-calculator.png";
import epoxyCalculator from "@/assets/calculators/epoxy-calculator.png";
import sealantCalculator from "@/assets/calculators/sealant-calculator.png";
import deckStainCalculator from "@/assets/calculators/deck-stain-calculator.png";
import stairCalculator from "@/assets/calculators/stair-calculator.png";
import stairCarpetCalculator from "@/assets/calculators/stair-carpet-calculator.png";
import spiralStaircaseCalculator from "@/assets/calculators/spiral-staircase-calculator.png";
import spindleSpacingCalculator from "@/assets/calculators/spindle-spacing-calculator.png";
import archCalculator from "@/assets/calculators/arch-calculator.png";
import rampCalculator from "@/assets/calculators/ramp-calculator.png";
import ladderAngleCalculator from "@/assets/calculators/ladder-angle-calculator.png";
import diyShedCalculator from "@/assets/calculators/diy-shed-calculator.png";
import floorAreaRatioCalculator from "@/assets/calculators/floor-area-ratio-calculator.png";
import rollingOffsetCalculator from "@/assets/calculators/rolling-offset-calculator.png";
import sagCalculator from "@/assets/calculators/sag-calculator.png";
import boxFillCalculator from "@/assets/calculators/box-fill-calculator.png";
import junctionBoxSizingCalculator from "@/assets/calculators/junction-box-sizing-calculator.png";
import clearanceHoleCalculator from "@/assets/calculators/clearance-hole-calculator.png";
import kfactorCalculator from "@/assets/calculators/k-factor-calculator.png";
import materialRemovalRateCalculator from "@/assets/calculators/material-removal-rate-calculator.png";
import pitchDiameterCalculator from "@/assets/calculators/pitch-diameter-calculator.png";
import punchForceCalculator from "@/assets/calculators/punch-force-calculator.png";
import rivetSizeCalculator from "@/assets/calculators/rivet-size-calculator.png";
import spindleSpeedCalculator from "@/assets/calculators/spindle-speed-calculator.png";
import taperCalculator from "@/assets/calculators/taper-calculator.png";
import threadCalculator from "@/assets/calculators/thread-calculator.png";
import threadPitchCalculator from "@/assets/calculators/thread-pitch-calculator.png";
import truePositionCalculator from "@/assets/calculators/true-position-calculator.png";
import carbonEquivalentCalculator from "@/assets/calculators/carbon-equivalent-calculator.png"; 
import birdsmouthCutCalculator from "@/assets/calculators/birdsmouth-cut-calculator.png";
import concreteDriveWayCostCalculator from "@/assets/calculators/concrete-driveway-calculator.png";
import plumbing from "@/assets/calculators/plumbing.jpg";
import vastuShastra from "@/assets/calculators/vastu-shastra.jpg";

interface ConstructionCalculatorToolsProps {
  onLaunchCementCalculator: () => void;
  onLaunchConcreteCalculator: () => void;
  onLaunchConcreteBlockCalculator: () => void;
  onLaunchConcreteBlockFillCalculator: () => void;
  onLaunchConcreteColumnCalculator: () => void;
  onLaunchConcreteStairsCalculator: () => void;
  onLaunchConcreteEstimatorTube: () => void;
  onLaunchConcreteWeightCalculator: () => void;
  onLaunchConcreteDrivewayCostCalculator: () => void;
  onLaunchGroutCalculator: () => void;
  onLaunchHoleVolumeCalculator: () => void;
  onLaunchMortarCalculator: () => void;
  onLaunchThinsetCalculator: () => void;
  onLaunchBrickCalculator: () => void;
  onLaunchVastuCalculator: () => void;
  onLaunchBoardFootCalculator: () => void;
  onLaunchCubicYardCalculator: () => void;
  onLaunchGallonsPerSquareFootCalculator: () => void;
}

const categories = [
  { id: "all", name: "All Calculators" },
  { id: "concrete", name: "Concrete & Cement" },
  { id: "masonry", name: "Masonry & Mortar" },
  { id: "volume", name: "Volume & Measurement" },
  { id: "weight", name: "Weight Calculators" },
  { id: "lumber", name: "Lumber & Wood" },
  { id: "roofing", name: "Roofing" },
  { id: "hvac", name: "HVAC & Climate" },
  { id: "plumbing", name: "Plumbing & Water" },
  { id: "structural", name: "Structural Engineering" },
  { id: "outdoor", name: "Outdoor & Landscaping" },
  { id: "finishing", name: "Interior Finishing" },
  { id: "vastu", name: "Vaastu Shastra" },
];

const calculators = [
  // Concrete & Cement Calculators
  {
    id: "cement-calculator",
    title: "Cement Calculator",
    description: "Calculate the amount of cement needed for your construction project with precision.",
    image: cementCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-calculator",
    title: "Concrete Calculator",
    description: "Determine the exact volume of concrete required for slabs, footings, and foundations.",
    image: concreteCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-block-calculator",
    title: "Concrete Block Calculator",
    description: "Calculate the number of concrete blocks needed for walls and structures.",
    image: concreteBlockCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-block-fill-calculator",
    title: "Concrete Block Fill Calculator",
    description: "Estimate the amount of concrete needed to fill hollow concrete blocks.",
    image: concreteBlockFillCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-column-calculator",
    title: "Concrete Column Calculator",
    description: "Calculate concrete volume for cylindrical or rectangular columns.",
    image: columnCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-stairs-calculator",
    title: "Concrete Stairs Calculator",
    description: "Determine the concrete needed for stairs including treads and risers.",
    image: concreteStairsCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-estimator-tube",
    title: "Concrete Estimator - Tube",
    description: "Calculate concrete required for tubular or cylindrical structures.",
    image: concreteEstimaterTube,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-weight-calculator",
    title: "Concrete Weight Calculator",
    description: "Calculate the total weight of concrete based on volume and density.",
    image: concreteWeightCalculator,
    credits: 0,
    category: "concrete",
  },
  {
    id: "concrete-driveway-cost-calculator",
    title: "Concrete Driveway Cost Calculator",
    description: "Estimate the total cost for concrete driveway installation.",
    image: concreteDriveWayCostCalculator,
    credits: 0,
    category: "concrete",
  },

  // Masonry & Mortar Calculators
  {
    id: "brick-calculator",
    title: "Brick Calculator",
    description: "Calculate the number of bricks needed for walls and structures.",
    image: brickCalculator,
    credits: 0,
    category: "masonry",
  },
  {
    id: "grout-calculator",
    title: "Grout Calculator",
    description: "Estimate the amount of grout needed for tile installation and masonry work.",
    image: groutCalculator,
    credits: 0,
    category: "masonry",
  },
  {
    id: "mortar-calculator",
    title: "Mortar Calculator",
    description: "Determine the amount of mortar needed for bricklaying and masonry.",
    image: mortarCalculator,
    credits: 0,
    category: "masonry",
  },
  {
    id: "thinset-calculator",
    title: "Thinset Calculator",
    description: "Calculate thinset mortar required for tile installation projects.",
    image: thinsetCalculator,
    credits: 0,
    category: "masonry",
  },
  {
    id: "tile-calculator",
    title: "Tile Calculator",
    description: "Calculate the number of tiles needed for floors, walls, and backsplashes.",
    image: tileCalculator,
    credits: 0,
    category: "finishing",
  },

  // Volume & Measurement Calculators
  {
    id: "board-foot-calculator",
    title: "Board Foot Calculator",
    description: "Calculate board feet for lumber purchasing and cost estimation.",
    image: boardFoodCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "cubic-yard-calculator",
    title: "Cubic Yard Calculator",
    description: "Convert measurements to cubic yards for material estimation.",
    image: cubicyardCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "gallons-per-square-foot-calculator",
    title: "Gallons per Square Foot Calculator",
    description: "Calculate liquid coverage per square foot for coatings and sealants.",
    image: gallonsPerSquareFootCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "size-to-weight-calculator",
    title: "Size to Weight Calculator",
    description: "Convert dimensions of rectangular boxes to weight estimates.",
    image: sizeToWeightCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "square-feet-to-cubic-yards-calculator",
    title: "Square Feet to Cubic Yards Calculator",
    description: "Convert area measurements to volume for material orders.",
    image: squarefeetToCubicYardsCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "square-footage-calculator",
    title: "Square Footage Calculator",
    description: "Calculate the square footage of rooms, floors, and surfaces.",
    image: squareFootageCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "square-yards-calculator",
    title: "Square Yards Calculator",
    description: "Convert and calculate square yard measurements for materials.",
    image: squaryardCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "square-yard-calculator",
    title: "Square Yard Calculator",
    description: "Determine square yard coverage for flooring and carpeting.",
    image: squaryardsCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "hole-volume-calculator",
    title: "Hole Volume Calculator",
    description: "Calculate the volume of cylindrical holes for posts and footings.",
    image: holeVolumeCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "tank-volume-calculator",
    title: "Tank Volume Calculator",
    description: "Calculate storage tank capacity and volume.",
    image: tankVolumeCalculator,
    credits: 0,
    category: "volume",
  },
  {
    id: "pipe-volume-calculator",
    title: "Pipe Volume Calculator",
    description: "Calculate the volume of pipes for plumbing and HVAC systems.",
    image: plumbing,
    credits: 0,
    category: "plumbing",
  },

  // Weight Calculators
  {
    id: "aluminum-weight-calculator",
    title: "Aluminum Weight Calculator",
    description: "Calculate the weight of aluminum materials based on dimensions.",
    image: aluminumWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "metal-weight-calculator",
    title: "Metal Weight Calculator",
    description: "Determine the weight of various metal materials and shapes.",
    image: metalSteelCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "pipe-weight-calculator",
    title: "Pipe Weight Calculator",
    description: "Calculate the weight of pipes based on material and dimensions.",
    image: pipeWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "plate-weight-calculator",
    title: "Plate Weight Calculator",
    description: "Determine the weight of metal plates for structural applications.",
    image: plateWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "steel-plate-weight-calculator",
    title: "Steel Plate Weight Calculator",
    description: "Calculate the weight of steel plates based on size and thickness.",
    image: steelPlateWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "steel-weight-calculator",
    title: "Steel Weight Calculator",
    description: "Determine the weight of steel beams, bars, and structural elements.",
    image: steelWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "glass-weight-calculator",
    title: "Glass Weight Calculator",
    description: "Calculate the weight of glass panels for windows and glazing.",
    image: glassWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "stone-weight-calculator",
    title: "Stone Weight Calculator",
    description: "Determine the weight of natural stone materials.",
    image: stoneWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "log-weight-calculator",
    title: "Log Weight Calculator",
    description: "Calculate the weight of logs based on species and dimensions.",
    image: logWeightCalculator,
    credits: 0,
    category: "weight",
  },
  {
    id: "tonnage-calculator",
    title: "Tonnage Calculator",
    description: "Convert weights to tonnage for large-scale material orders.",
    image: tonnageCalculator,
    credits: 0,
    category: "weight",
  },

  // Lumber & Wood Calculators
  {
    id: "lumber-calculator",
    title: "Lumber Calculator",
    description: "Calculate lumber requirements for framing and construction projects.",
    image: lumberCalculator,
    credits: 0,
    category: "lumber",
  },
  {
    id: "framing-calculator",
    title: "Framing Calculator",
    description: "Determine the amount of framing lumber needed for walls and structures.",
    image: framingCalculator,
    credits: 0,
    category: "lumber",
  },
  {
    id: "plywood-calculator",
    title: "Plywood Calculator",
    description: "Calculate the number of plywood sheets needed for your project.",
    image: plywoodCalculator,
    credits: 0,
    category: "lumber",
  },
  {
    id: "board-and-batten-calculator",
    title: "Board and Batten Calculator",
    description: "Calculate materials needed for board and batten siding or wainscoting.",
    image: boardAndBettenCalculator,
    credits: 0,
    category: "lumber",
  },
  {
    id: "shiplap-calculator",
    title: "Shiplap Calculator",
    description: "Calculate the amount of shiplap needed for walls or ceilings.",
    image: shiplapCalculator,
    credits: 0,
    category: "lumber",
  },
  {
    id: "wainscoting-calculator",
    title: "Wainscoting Calculator",
    description: "Determine materials needed for wainscoting installation.",
    image: wainscotingCalculator,
    credits: 0,
    category: "finishing",
  },

  // Roofing Calculators
  {
    id: "roofing-calculator",
    title: "Roofing Calculator",
    description: "Calculate roofing materials needed including shingles and underlayment.",
    image: roofingCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "roof-pitch-calculator",
    title: "Roof Pitch Calculator",
    description: "Calculate roof pitch and slope for proper drainage and aesthetics.",
    image: roofPitchCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "roof-shingle-calculator",
    title: "Roof Shingle Calculator",
    description: "Determine the number of shingle bundles needed for your roof.",
    image: roofShingleCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "roof-truss-calculator",
    title: "Roof Truss Calculator",
    description: "Calculate roof truss dimensions and spacing requirements.",
    image: roofTrussCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "rafter-length-calculator",
    title: "Rafter Length Calculator",
    description: "Calculate rafter length based on roof pitch and span.",
    image: rafterLeangthCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "gambrel-roof-calculator",
    title: "Gambrel Roof Calculator",
    description: "Calculate materials and dimensions for gambrel roof construction.",
    image: gambrelRoofCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "metal-roof-cost-calculator",
    title: "Metal Roof Cost Calculator",
    description: "Estimate the cost of metal roofing installation.",
    image: metalRoofCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "snow-load-calculator",
    title: "Snow Load Calculator",
    description: "Calculate snow load capacity for roof structural design.",
    image: snowLoadCalculator,
    credits: 0,
    category: "roofing",
  },

  // HVAC & Climate Calculators
  {
    id: "ac-tonnage-calculator",
    title: "AC Tonnage Calculator",
    description: "Calculate the required AC tonnage for your space.",
    image: acTonnageCalculator,
    credits: 0,
    category: "hvac",
  },
  {
    id: "air-changes-per-hour-calculator",
    title: "Air Changes per Hour Calculator",
    description: "Calculate air changes per hour for proper ventilation.",
    image: airChangesPerHourCalculator,
    credits: 0,
    category: "hvac",
  },
  {
    id: "air-conditioner-btu-calculator",
    title: "Air Conditioner BTU Calculator",
    description: "Calculate BTU requirements for air conditioning systems.",
    image: airConditionerBtuCalculator,
    credits: 0,
    category: "hvac",
  },
  {
    id: "boiler-size-calculator",
    title: "Boiler Size Calculator",
    description: "Calculate the appropriate boiler size for your heating needs.",
    image: boilerSizeCalculator,
    credits: 0,
    category: "hvac",
  },
  {
    id: "furnace-size-calculator",
    title: "Furnace Size Calculator",
    description: "Determine the correct furnace size for your home.",
    image: furnaceSizeCalculator,
    credits: 0,
    category: "hvac",
  },
  {
    id: "heat-loss-calculator",
    title: "Heat Loss Calculator",
    description: "Calculate heat loss to determine heating requirements.",
    image: heatLossCalculator,
    credits: 0,
    category: "hvac",
  },
  {
    id: "cfm-calculator",
    title: "CFM Calculator",
    description: "Calculate cubic feet per minute for ventilation systems.",
    image: cfmCalculator,
    credits: 0,
    category: "hvac",
  },

  // Plumbing & Water Calculators
  {
    id: "fire-flow-calculator",
    title: "Fire Flow Calculator",
    description: "Calculate fire flow requirements for fire protection systems.",
    image: fireFlowCalculator,
    credits: 0,
    category: "plumbing",
  },
  {
    id: "gallons-per-minute-calculator",
    title: "Gallons Per Minute Calculator",
    description: "Calculate flow rate in gallons per minute for plumbing systems.",
    image: gallonsPerMinuteCalculator,
    credits: 0,
    category: "plumbing",
  },
  {
    id: "liters-per-minute-calculator",
    title: "Liters per Minute Calculator",
    description: "Calculate flow rate in liters per minute for water systems.",
    image: litersPerMinuteCalculator,
    credits: 0,
    category: "plumbing",
  },
  {
    id: "pond-calculator",
    title: "Pond Calculator",
    description: "Calculate pond volume and liner size requirements.",
    image: pondCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "pool-calculator",
    title: "Pool Calculator",
    description: "Calculate pool volume, chemical requirements, and maintenance needs.",
    image: poolCalculator,
    credits: 0,
    category: "outdoor",
  },

  // Structural Engineering Calculators
  {
    id: "beam-deflection-calculator",
    title: "Beam Deflection Calculator",
    description: "Calculate beam deflection under various load conditions.",
    image: beamDeflectionCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "beam-load-calculator",
    title: "Beam Load Calculator",
    description: "Calculate load capacity and requirements for structural beams.",
    image: beamLoadCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "bending-stress-calculator",
    title: "Bending Stress Calculator",
    description: "Calculate bending stress in structural members.",
    image: bendingStressCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "bolt-torque-calculator",
    title: "Bolt Torque Calculator",
    description: "Calculate proper bolt torque specifications.",
    image: boldTorqueCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "door-header-size-calculator",
    title: "Door Header Size Calculator",
    description: "Calculate the required header size for door openings.",
    image: DoorHeaderSizeCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "floor-joist-calculator",
    title: "Floor Joist Calculator",
    description: "Calculate floor joist size and spacing requirements.",
    image: floorJoistCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "wood-beam-span-calculator",
    title: "Wood Beam Span Calculator",
    description: "Calculate maximum span for wood beams.",
    image: woodBeamSpanCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "rebar-calculator",
    title: "Rebar Calculator",
    description: "Calculate rebar requirements for concrete reinforcement.",
    image: rebarCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "welding-calculator",
    title: "Welding Calculator",
    description: "Calculate welding parameters and requirements.",
    image: weldingCalculator,
    credits: 0,
    category: "structural",
  },

  // Outdoor & Landscaping Calculators
  {
    id: "baluster-calculator",
    title: "Baluster Calculator",
    description: "Calculate the number of balusters needed for railings.",
    image: balusterCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "decking-calculator",
    title: "Decking Calculator",
    description: "Calculate decking materials needed for outdoor deck construction.",
    image: deckingCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "fence-calculator",
    title: "Fence Calculator",
    description: "Calculate fencing materials including posts, rails, and pickets.",
    image: fenceCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "rectangle-fence-perimeter-calculator",
    title: "Rectangle Fence Perimeter Calculator",
    description: "Calculate the perimeter for rectangular fence layouts.",
    image: rectangleFencePerimeterCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "fence-post-depth-calculator",
    title: "Fence Post Depth Calculator",
    description: "Determine the proper depth for fence post installation.",
    image: fencePostDepthCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "vinyl-fence-calculator",
    title: "Vinyl Fence Calculator",
    description: "Calculate materials needed for vinyl fence installation.",
    image: vinylFencingCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "gravel-calculator",
    title: "Gravel Calculator",
    description: "Calculate the amount of gravel needed for driveways and paths.",
    image: gravelCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "limestone-calculator",
    title: "Limestone Calculator",
    description: "Calculate limestone requirements for landscaping and construction.",
    image: limestoneCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "river-rock-calculator",
    title: "River Rock Calculator",
    description: "Calculate river rock needed for landscaping projects.",
    image: riverrockCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "rip-rap-calculator",
    title: "Rip Rap Calculator",
    description: "Calculate rip rap stone needed for erosion control.",
    image: ripRapCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "sand-calculator",
    title: "Sand Calculator",
    description: "Calculate sand requirements for various construction and landscaping needs.",
    image: sandCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "paver-calculator",
    title: "Paver Calculator",
    description: "Calculate the number of pavers needed for patios and walkways.",
    image: paverCalcualator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "paver-sand-calculator",
    title: "Paver Sand Calculator",
    description: "Calculate sand needed as base for paver installation.",
    image: paverSandCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "asphalt-calculator",
    title: "Asphalt Calculator",
    description: "Calculate asphalt requirements for driveway paving.",
    image: asphaltCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "gravel-driveway-calculator",
    title: "Gravel Driveway Calculator",
    description: "Calculate gravel needed for driveway construction.",
    image: gravelDrivewayCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "crushed-stone-calculator",
    title: "Crushed Stone Calculator",
    description: "Calculate crushed stone requirements for base and drainage.",
    image: crushedStoneCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "road-base-calculator",
    title: "Road Base Calculator",
    description: "Calculate road base material for driveway and road construction.",
    image: roadBaseCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "retaining-wall-calculator",
    title: "Retaining Wall Calculator",
    description: "Calculate materials needed for retaining wall construction.",
    image: retainingWallCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "french-drain-calculator",
    title: "French Drain Calculator",
    description: "Calculate materials needed for French drain installation.",
    image: frenchDrainCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "fire-glass-calculator",
    title: "Fire Glass Calculator",
    description: "Calculate the amount of fire glass needed for fire pits.",
    image: fireGlassCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "hoop-house-calculator",
    title: "Hoop House Calculator",
    description: "Calculate materials for greenhouse hoop house construction.",
    image: hoopHouseCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "chicken-coop-size-calculator",
    title: "Chicken Coop Size Calculator",
    description: "Calculate the appropriate size for a chicken coop.",
    image: chickenCoopCalculator,
    credits: 0,
    category: "outdoor",
  },

  // Interior Finishing Calculators
  {
    id: "carpet-calculator",
    title: "Carpet Calculator",
    description: "Calculate carpet requirements for flooring projects.",
    image: carpetCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "flooring-calculator",
    title: "Flooring Calculator",
    description: "Calculate flooring materials needed for various floor types.",
    image: flooringCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "drywall-calculator",
    title: "Drywall Calculator",
    description: "Calculate drywall sheets and joint compound needed.",
    image: drywallCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "paint-calculator",
    title: "Paint Calculator",
    description: "Calculate paint requirements for walls and ceilings.",
    image: paintCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "wallpaper-calculator",
    title: "Wallpaper Calculator",
    description: "Calculate wallpaper rolls needed for room decoration.",
    image: wallpaperCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "siding-calculator",
    title: "Siding Calculator",
    description: "Calculate exterior siding materials needed.",
    image: sidingCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "vinyl-siding-calculator",
    title: "Vinyl Siding Calculator",
    description: "Calculate vinyl siding requirements for exterior walls.",
    image: vinylSidingCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "wall-square-footage-calculator",
    title: "Wall Square Footage Calculator",
    description: "Calculate wall area for material estimation.",
    image: snowLoadCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "insulation-calculator",
    title: "Insulation Calculator",
    description: "Calculate insulation requirements for energy efficiency.",
    image: insulationCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "epoxy-calculator",
    title: "Epoxy Calculator",
    description: "Calculate epoxy resin needed for floor coatings.",
    image: epoxyCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "sealant-calculator",
    title: "Sealant Calculator",
    description: "Calculate sealant or caulk needed for joints and gaps.",
    image: sealantCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "deck-stain-calculator",
    title: "Deck Stain Calculator",
    description: "Calculate deck stain or sealer requirements.",
    image: deckStainCalculator,
    credits: 0,
    category: "finishing",
  },

  // Stairs & Architectural Calculators
  {
    id: "stair-calculator",
    title: "Stair Calculator",
    description: "Calculate stair dimensions including rise, run, and stringers.",
    image: stairCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "stair-carpet-calculator",
    title: "Stair Carpet Calculator",
    description: "Calculate carpet needed for stair covering.",
    image: stairCarpetCalculator,
    credits: 0,
    category: "finishing",
  },
  {
    id: "spiral-staircase-calculator",
    title: "Spiral Staircase Calculator",
    description: "Calculate dimensions and materials for spiral staircases.",
    image: spiralStaircaseCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "spindle-spacing-calculator",
    title: "Spindle Spacing Calculator",
    description: "Calculate proper spindle spacing for stair railings.",
    image: spindleSpacingCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "arch-calculator",
    title: "Arch Calculator",
    description: "Calculate dimensions and materials for architectural arches.",
    image: archCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "ramp-calculator",
    title: "Ramp Calculator",
    description: "Calculate ramp dimensions for ADA compliance.",
    image: rampCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "ladder-angle-calculator",
    title: "Ladder Angle Calculator",
    description: "Calculate safe ladder angle and placement.",
    image: ladderAngleCalculator,
    credits: 0,
    category: "structural",
  },

  // Miscellaneous Calculators
  {
    id: "diy-shed-cost-calculator",
    title: "DIY Shed Cost Calculator",
    description: "Estimate the cost of building a DIY shed.",
    image: diyShedCalculator,
    credits: 0,
    category: "outdoor",
  },
  {
    id: "floor-area-ratio-calculator",
    title: "Floor Area Ratio Calculator",
    description: "Calculate floor area ratio for building code compliance.",
    image: floorAreaRatioCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "rolling-offset-calculator",
    title: "Rolling Offset Calculator",
    description: "Calculate rolling offset for pipe and conduit installation.",
    image: rollingOffsetCalculator,
    credits: 0,
    category: "plumbing",
  },
  {
    id: "sag-calculator",
    title: "SAG Calculator",
    description: "Calculate sag in cables and wire installations.",
    image: sagCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "box-fill-calculator",
    title: "Box Fill Calculator",
    description: "Calculate electrical box fill capacity.",
    image: boxFillCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "junction-box-sizing-calculator",
    title: "Junction Box Sizing Calculator",
    description: "Calculate proper junction box size for electrical work.",
    image: junctionBoxSizingCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "clearance-hole-calculator",
    title: "Clearance Hole Calculator",
    description: "Calculate clearance hole sizes for fasteners.",
    image: clearanceHoleCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "k-factor-calculator",
    title: "K-Factor Calculator",
    description: "Calculate K-factor for sheet metal bending.",
    image: kfactorCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "material-removal-rate-calculator",
    title: "Material Removal Rate Calculator",
    description: "Calculate material removal rate for machining operations.",
    image: materialRemovalRateCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "pitch-diameter-calculator",
    title: "Pitch Diameter Calculator",
    description: "Calculate pitch diameter for threaded fasteners.",
    image: pitchDiameterCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "punch-force-calculator",
    title: "Punch Force Calculator",
    description: "Calculate force required for punching operations.",
    image: punchForceCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "rivet-size-calculator",
    title: "Rivet Size Calculator",
    description: "Calculate appropriate rivet size for joining materials.",
    image: rivetSizeCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "spindle-speed-calculator",
    title: "Spindle Speed Calculator",
    description: "Calculate spindle speed for machining operations.",
    image: spindleSpeedCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "taper-calculator",
    title: "Taper Calculator",
    description: "Calculate taper dimensions and angles.",
    image: taperCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "thread-calculator",
    title: "Thread Calculator",
    description: "Calculate thread specifications and dimensions.",
    image: threadCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "thread-pitch-calculator",
    title: "Thread Pitch Calculator",
    description: "Calculate thread pitch for fastener specifications.",
    image: threadPitchCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "true-position-calculator",
    title: "True Position Calculator",
    description: "Calculate true position for GD&T applications.",
    image: truePositionCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "carbon-equivalent-calculator",
    title: "Carbon Equivalent Calculator",
    description: "Calculate carbon equivalent for welding applications.",
    image: carbonEquivalentCalculator,
    credits: 0,
    category: "structural",
  },
  {
    id: "birdsmouth-cut-calculator",
    title: "Birdsmouth Cut Calculator",
    description: "Calculate birdsmouth cut dimensions for rafter installation.",
    image: birdsmouthCutCalculator,
    credits: 0,
    category: "roofing",
  },
  {
    id: "vastu-calculator",
    title: "Vaastu Calculator",
    description: "Analyze your property for Vaastu compliance and get personalized recommendations.",
    image: vastuShastra,
    credits: 0,
    category: "vastu",
  },
];

export const ConstructionCalculatorTools = ({
  onLaunchCementCalculator,
  onLaunchConcreteCalculator,
  onLaunchConcreteBlockCalculator,
  onLaunchConcreteBlockFillCalculator,
  onLaunchConcreteColumnCalculator,
  onLaunchConcreteStairsCalculator,
  onLaunchConcreteEstimatorTube,
  onLaunchConcreteWeightCalculator,
  onLaunchConcreteDrivewayCostCalculator,
  onLaunchGroutCalculator,
  onLaunchHoleVolumeCalculator,
  onLaunchMortarCalculator,
  onLaunchThinsetCalculator,
  onLaunchBrickCalculator,
  onLaunchVastuCalculator,
  onLaunchBoardFootCalculator,
  onLaunchCubicYardCalculator,
  onLaunchGallonsPerSquareFootCalculator,
}: ConstructionCalculatorToolsProps) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleLaunchCalculator = (calculatorId: string) => {
    const calculator = calculators.find((c) => c.id === calculatorId);
    const calculatorTitle = calculator?.title || "Calculator";

    switch (calculatorId) {
      case "cement-calculator":
        onLaunchCementCalculator();
        break;
      case "concrete-calculator":
        onLaunchConcreteCalculator();
        break;
      case "concrete-block-calculator":
        onLaunchConcreteBlockCalculator();
        break;
      case "concrete-block-fill-calculator":
        onLaunchConcreteBlockFillCalculator();
        break;
      case "concrete-column-calculator":
        onLaunchConcreteColumnCalculator();
        break;
      case "concrete-stairs-calculator":
        onLaunchConcreteStairsCalculator();
        break;
      case "concrete-estimator-tube":
        onLaunchConcreteEstimatorTube();
        break;
      case "concrete-weight-calculator":
        onLaunchConcreteWeightCalculator();
        break;
      case "concrete-driveway-cost-calculator":
        onLaunchConcreteDrivewayCostCalculator();
        break;
      case "grout-calculator":
        onLaunchGroutCalculator();
        break;
      case "hole-volume-calculator":
        onLaunchHoleVolumeCalculator();
        break;
      case "mortar-calculator":
        onLaunchMortarCalculator();
        break;
      case "thinset-calculator":
        onLaunchThinsetCalculator();
        break;
      case "brick-calculator":
        onLaunchBrickCalculator();
        break;
      case "vastu-calculator":
        onLaunchVastuCalculator();
        break;
      case "board-foot-calculator":
        onLaunchBoardFootCalculator();
        break;
      case "cubic-yard-calculator":
        onLaunchCubicYardCalculator();
        break;
      case "gallons-per-square-foot-calculator":
        onLaunchGallonsPerSquareFootCalculator();
        break;
      default:
        alert(`${calculatorTitle} - Coming Soon!`);
    }
  };

  const filteredCalculators =
    activeCategory === "all" ? calculators : calculators.filter((calc) => calc.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-center space-y-2">
            <Calculator className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Construction Calculators</h1>
            <p className="text-muted-foreground">
              Professional construction calculators for accurate material estimation and project planning.
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-2 bg-muted/30 p-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCalculators.map((calculator) => (
                  <ToolCard
                    key={calculator.id}
                    title={calculator.title}
                    description={calculator.description}
                    image={calculator.image}
                    credits={calculator.credits}
                    onLaunch={() => handleLaunchCalculator(calculator.id)}
                    compact={true}
                  />
                ))}
              </div>
              {filteredCalculators.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No calculators available in this category yet.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
