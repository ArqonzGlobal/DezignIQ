import { useState } from "react";
import { Header } from "@/components/Header";
import { ConstructionCalculatorTools } from "@/components/ConstructionCalculatorTools";
import { ConverterTools } from "@/components/ConverterTools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Calculator Modals
import { BrickCalculatorModal } from "@/components/calculators/BrickCalculatorModal";
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
import { VastuCalculatorModal } from "@/components/calculators/VastuCalculatorModal";
import { BoardFootCalculatorModal } from "@/components/calculators/BoardFootCalculatorModal";
import { CubicYardCalculatorModal } from "@/components/calculators/CubicYardCalculatorModal";
import { GallonsPerSquareFootCalculatorModal } from "@/components/calculators/GallonsPerSquareFootCalculatorModal";

// Converter Modals
import { LengthConverterModal } from "@/components/converters/LengthConverterModal";
import { AreaConverterModal } from "@/components/converters/AreaConverterModal";
import { VolumeConverterModal } from "@/components/converters/VolumeConverterModal";
import { WeightConverterModal } from "@/components/converters/WeightConverterModal";
import { DensityConverterModal } from "@/components/converters/DensityConverterModal";
import { CementBagConverterModal } from "@/components/converters/CementBagConverterModal";
import { SteelWeightConverterModal } from "@/components/converters/SteelWeightConverterModal";
import { ConcreteVolumeConverterModal } from "@/components/converters/ConcreteVolumeConverterModal";
import { BrickBlockConverterModal } from "@/components/converters/BrickBlockConverterModal";
import { SandAggregateConverterModal } from "@/components/converters/SandAggregateConverterModal";
import { RebarLengthWeightConverterModal } from "@/components/converters/RebarLengthWeightConverterModal";
import { SheetMetalGaugeConverterModal } from "@/components/converters/SheetMetalGaugeConverterModal";
import { PipeDiameterConverterModal } from "@/components/converters/PipeDiameterConverterModal";
import { TileFlooringConverterModal } from "@/components/converters/TileFlooringConverterModal";
import { PaintPlasterConverterModal } from "@/components/converters/PaintPlasterConverterModal";
import { PressureConverterModal } from "@/components/converters/PressureConverterModal";
import { ForceConverterModal } from "@/components/converters/ForceConverterModal";
import { TemperatureConverterModal } from "@/components/converters/TemperatureConverterModal";
import { EnergyConverterModal } from "@/components/converters/EnergyConverterModal";
import { PowerConverterModal } from "@/components/converters/PowerConverterModal";
import { CO2EmissionConverterModal } from "@/components/converters/CO2EmissionConverterModal";
import { EnergyConsumptionConverterModal } from "@/components/converters/EnergyConsumptionConverterModal";
import { WaterUsageConverterModal } from "@/components/converters/WaterUsageConverterModal";
import { CurrencyConverterModal } from "@/components/converters/CurrencyConverterModal";
import { UnitCostConverterModal } from "@/components/converters/UnitCostConverterModal";
import { MaterialCostIndexConverterModal } from "@/components/converters/MaterialCostIndexConverterModal";
import { CoordinateConverterModal } from "@/components/converters/CoordinateConverterModal";
import { SlopeConverterModal } from "@/components/converters/SlopeConverterModal";
import { ElevationConverterModal } from "@/components/converters/ElevationConverterModal";
import { VoltageConverterModal } from "@/components/converters/VoltageConverterModal";
import { CurrentConverterModal } from "@/components/converters/CurrentConverterModal";
import { PowerFactorConverterModal } from "@/components/converters/PowerFactorConverterModal";
import { FlowRateConverterModal } from "@/components/converters/FlowRateConverterModal";
import { AirflowConverterModal } from "@/components/converters/AirflowConverterModal";
import { ScaleConverterModal } from "@/components/converters/ScaleConverterModal";
import { CoordinateUnitConverterModal } from "@/components/converters/CoordinateUnitConverterModal";
import { AngleConverterModal } from "@/components/converters/AngleConverterModal";
import { TimeConverterModal } from "@/components/converters/TimeConverterModal";
import { FuelConsumptionConverterModal } from "@/components/converters/FuelConsumptionConverterModal";
import { SpeedConverterModal } from "@/components/converters/SpeedConverterModal";

const Tools = () => {
  const [isCementCalculatorOpen, setIsCementCalculatorOpen] = useState(false);
  const [isConcreteCalculatorOpen, setIsConcreteCalculatorOpen] = useState(false);
  const [isConcreteBlockCalculatorOpen, setIsConcreteBlockCalculatorOpen] = useState(false);
  const [isConcreteBlockFillCalculatorOpen, setIsConcreteBlockFillCalculatorOpen] = useState(false);
  const [isConcreteColumnCalculatorOpen, setIsConcreteColumnCalculatorOpen] = useState(false);
  const [isConcreteStairsCalculatorOpen, setIsConcreteStairsCalculatorOpen] = useState(false);
  const [isConcreteEstimatorTubeOpen, setIsConcreteEstimatorTubeOpen] = useState(false);
  const [isConcreteWeightCalculatorOpen, setIsConcreteWeightCalculatorOpen] = useState(false);
  const [isConcreteDrivewayCostCalculatorOpen, setIsConcreteDrivewayCostCalculatorOpen] = useState(false);
  const [isGroutCalculatorOpen, setIsGroutCalculatorOpen] = useState(false);
  const [isHoleVolumeCalculatorOpen, setIsHoleVolumeCalculatorOpen] = useState(false);
  const [isMortarCalculatorOpen, setIsMortarCalculatorOpen] = useState(false);
  const [isThinsetCalculatorOpen, setIsThinsetCalculatorOpen] = useState(false);
  const [isBrickCalculatorOpen, setIsBrickCalculatorOpen] = useState(false);
  const [isVastuCalculatorOpen, setIsVastuCalculatorOpen] = useState(false);
  const [isBoardFootCalculatorOpen, setIsBoardFootCalculatorOpen] = useState(false);
  const [isCubicYardCalculatorOpen, setIsCubicYardCalculatorOpen] = useState(false);
  const [isGallonsPerSquareFootCalculatorOpen, setIsGallonsPerSquareFootCalculatorOpen] = useState(false);
  
  // Converter states
  const [isLengthConverterOpen, setIsLengthConverterOpen] = useState(false);
  const [isAreaConverterOpen, setIsAreaConverterOpen] = useState(false);
  const [isVolumeConverterOpen, setIsVolumeConverterOpen] = useState(false);
  const [isWeightConverterOpen, setIsWeightConverterOpen] = useState(false);
  const [isDensityConverterOpen, setIsDensityConverterOpen] = useState(false);
  const [isCementBagConverterOpen, setIsCementBagConverterOpen] = useState(false);
  const [isSteelWeightConverterOpen, setIsSteelWeightConverterOpen] = useState(false);
  const [isConcreteVolumeConverterOpen, setIsConcreteVolumeConverterOpen] = useState(false);
  const [isBrickBlockConverterOpen, setIsBrickBlockConverterOpen] = useState(false);
  const [isSandAggregateConverterOpen, setIsSandAggregateConverterOpen] = useState(false);
  const [isRebarLengthWeightConverterOpen, setIsRebarLengthWeightConverterOpen] = useState(false);
  const [isSheetMetalGaugeConverterOpen, setIsSheetMetalGaugeConverterOpen] = useState(false);
  const [isPipeDiameterConverterOpen, setIsPipeDiameterConverterOpen] = useState(false);
  const [isTileFlooringConverterOpen, setIsTileFlooringConverterOpen] = useState(false);
  const [isPaintPlasterConverterOpen, setIsPaintPlasterConverterOpen] = useState(false);
  const [isPressureConverterOpen, setIsPressureConverterOpen] = useState(false);
  const [isForceConverterOpen, setIsForceConverterOpen] = useState(false);
  const [isTemperatureConverterOpen, setIsTemperatureConverterOpen] = useState(false);
  const [isEnergyConverterOpen, setIsEnergyConverterOpen] = useState(false);
  const [isPowerConverterOpen, setIsPowerConverterOpen] = useState(false);
  const [isCO2EmissionConverterOpen, setIsCO2EmissionConverterOpen] = useState(false);
  const [isEnergyConsumptionConverterOpen, setIsEnergyConsumptionConverterOpen] = useState(false);
  const [isWaterUsageConverterOpen, setIsWaterUsageConverterOpen] = useState(false);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState(false);
  const [isUnitCostConverterOpen, setIsUnitCostConverterOpen] = useState(false);
  const [isMaterialCostIndexConverterOpen, setIsMaterialCostIndexConverterOpen] = useState(false);
  const [isCoordinateConverterOpen, setIsCoordinateConverterOpen] = useState(false);
  const [isSlopeConverterOpen, setIsSlopeConverterOpen] = useState(false);
  const [isElevationConverterOpen, setIsElevationConverterOpen] = useState(false);
  const [isVoltageConverterOpen, setIsVoltageConverterOpen] = useState(false);
  const [isCurrentConverterOpen, setIsCurrentConverterOpen] = useState(false);
  const [isPowerFactorConverterOpen, setIsPowerFactorConverterOpen] = useState(false);
  const [isFlowRateConverterOpen, setIsFlowRateConverterOpen] = useState(false);
  const [isAirflowConverterOpen, setIsAirflowConverterOpen] = useState(false);
  const [isScaleConverterOpen, setIsScaleConverterOpen] = useState(false);
  const [isCoordinateUnitConverterOpen, setIsCoordinateUnitConverterOpen] = useState(false);
  const [isAngleConverterOpen, setIsAngleConverterOpen] = useState(false);
  const [isTimeConverterOpen, setIsTimeConverterOpen] = useState(false);
  const [isFuelConsumptionConverterOpen, setIsFuelConsumptionConverterOpen] = useState(false);
  const [isSpeedConverterOpen, setIsSpeedConverterOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <Tabs defaultValue="calculators" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="calculators">Calculators</TabsTrigger>
              <TabsTrigger value="converters">Converters</TabsTrigger>
            </TabsList>

            <TabsContent value="calculators">
              <ConstructionCalculatorTools
          onLaunchCementCalculator={() => setIsCementCalculatorOpen(true)}
          onLaunchConcreteCalculator={() => setIsConcreteCalculatorOpen(true)}
          onLaunchConcreteBlockCalculator={() => setIsConcreteBlockCalculatorOpen(true)}
          onLaunchConcreteBlockFillCalculator={() => setIsConcreteBlockFillCalculatorOpen(true)}
          onLaunchConcreteColumnCalculator={() => setIsConcreteColumnCalculatorOpen(true)}
          onLaunchConcreteStairsCalculator={() => setIsConcreteStairsCalculatorOpen(true)}
          onLaunchConcreteEstimatorTube={() => setIsConcreteEstimatorTubeOpen(true)}
          onLaunchConcreteWeightCalculator={() => setIsConcreteWeightCalculatorOpen(true)}
          onLaunchConcreteDrivewayCostCalculator={() => setIsConcreteDrivewayCostCalculatorOpen(true)}
          onLaunchGroutCalculator={() => setIsGroutCalculatorOpen(true)}
          onLaunchHoleVolumeCalculator={() => setIsHoleVolumeCalculatorOpen(true)}
          onLaunchMortarCalculator={() => setIsMortarCalculatorOpen(true)}
          onLaunchThinsetCalculator={() => setIsThinsetCalculatorOpen(true)}
          onLaunchBrickCalculator={() => setIsBrickCalculatorOpen(true)}
          onLaunchVastuCalculator={() => setIsVastuCalculatorOpen(true)}
          onLaunchBoardFootCalculator={() => setIsBoardFootCalculatorOpen(true)}
          onLaunchCubicYardCalculator={() => setIsCubicYardCalculatorOpen(true)}
          onLaunchGallonsPerSquareFootCalculator={() => setIsGallonsPerSquareFootCalculatorOpen(true)}
              />
            </TabsContent>

            <TabsContent value="converters">
              <ConverterTools
                onLaunchLengthConverter={() => setIsLengthConverterOpen(true)}
                onLaunchAreaConverter={() => setIsAreaConverterOpen(true)}
                onLaunchVolumeConverter={() => setIsVolumeConverterOpen(true)}
                onLaunchWeightConverter={() => setIsWeightConverterOpen(true)}
                onLaunchDensityConverter={() => setIsDensityConverterOpen(true)}
                onLaunchCementBagConverter={() => setIsCementBagConverterOpen(true)}
                onLaunchSteelWeightConverter={() => setIsSteelWeightConverterOpen(true)}
                onLaunchConcreteVolumeConverter={() => setIsConcreteVolumeConverterOpen(true)}
                onLaunchBrickBlockConverter={() => setIsBrickBlockConverterOpen(true)}
                onLaunchSandAggregateConverter={() => setIsSandAggregateConverterOpen(true)}
                onLaunchRebarLengthWeightConverter={() => setIsRebarLengthWeightConverterOpen(true)}
                onLaunchSheetMetalGaugeConverter={() => setIsSheetMetalGaugeConverterOpen(true)}
                onLaunchPipeDiameterConverter={() => setIsPipeDiameterConverterOpen(true)}
                onLaunchTileFlooringConverter={() => setIsTileFlooringConverterOpen(true)}
                onLaunchPaintPlasterConverter={() => setIsPaintPlasterConverterOpen(true)}
                onLaunchPressureConverter={() => setIsPressureConverterOpen(true)}
                onLaunchForceConverter={() => setIsForceConverterOpen(true)}
                onLaunchTemperatureConverter={() => setIsTemperatureConverterOpen(true)}
                onLaunchEnergyConverter={() => setIsEnergyConverterOpen(true)}
                onLaunchPowerConverter={() => setIsPowerConverterOpen(true)}
                onLaunchCO2EmissionConverter={() => setIsCO2EmissionConverterOpen(true)}
                onLaunchEnergyConsumptionConverter={() => setIsEnergyConsumptionConverterOpen(true)}
                onLaunchWaterUsageConverter={() => setIsWaterUsageConverterOpen(true)}
                onLaunchCurrencyConverter={() => setIsCurrencyConverterOpen(true)}
                onLaunchUnitCostConverter={() => setIsUnitCostConverterOpen(true)}
                onLaunchMaterialCostIndexConverter={() => setIsMaterialCostIndexConverterOpen(true)}
                onLaunchCoordinateConverter={() => setIsCoordinateConverterOpen(true)}
                onLaunchSlopeConverter={() => setIsSlopeConverterOpen(true)}
                onLaunchElevationConverter={() => setIsElevationConverterOpen(true)}
                onLaunchVoltageConverter={() => setIsVoltageConverterOpen(true)}
                onLaunchCurrentConverter={() => setIsCurrentConverterOpen(true)}
                onLaunchPowerFactorConverter={() => setIsPowerFactorConverterOpen(true)}
                onLaunchFlowRateConverter={() => setIsFlowRateConverterOpen(true)}
                onLaunchAirflowConverter={() => setIsAirflowConverterOpen(true)}
                onLaunchScaleConverter={() => setIsScaleConverterOpen(true)}
                onLaunchCoordinateUnitConverter={() => setIsCoordinateUnitConverterOpen(true)}
                onLaunchAngleConverter={() => setIsAngleConverterOpen(true)}
                onLaunchTimeConverter={() => setIsTimeConverterOpen(true)}
                onLaunchFuelConsumptionConverter={() => setIsFuelConsumptionConverterOpen(true)}
                onLaunchSpeedConverter={() => setIsSpeedConverterOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </main>

        {/* Calculator Modals */}
      <CementCalculatorModal
        isOpen={isCementCalculatorOpen}
        onClose={() => setIsCementCalculatorOpen(false)}
      />
      <ConcreteCalculatorModal
        isOpen={isConcreteCalculatorOpen}
        onClose={() => setIsConcreteCalculatorOpen(false)}
      />
      <ConcreteBlockCalculatorModal
        isOpen={isConcreteBlockCalculatorOpen}
        onClose={() => setIsConcreteBlockCalculatorOpen(false)}
      />
      <ConcreteBlockFillCalculatorModal
        isOpen={isConcreteBlockFillCalculatorOpen}
        onClose={() => setIsConcreteBlockFillCalculatorOpen(false)}
      />
      <ConcreteColumnCalculatorModal
        isOpen={isConcreteColumnCalculatorOpen}
        onClose={() => setIsConcreteColumnCalculatorOpen(false)}
      />
      <ConcreteStairsCalculatorModal
        isOpen={isConcreteStairsCalculatorOpen}
        onClose={() => setIsConcreteStairsCalculatorOpen(false)}
      />
      <ConcreteEstimatorTubeModal
        isOpen={isConcreteEstimatorTubeOpen}
        onClose={() => setIsConcreteEstimatorTubeOpen(false)}
      />
      <ConcreteWeightCalculatorModal
        isOpen={isConcreteWeightCalculatorOpen}
        onClose={() => setIsConcreteWeightCalculatorOpen(false)}
      />
      <ConcreteTypeWeightCalculatorModal
        isOpen={isConcreteDrivewayCostCalculatorOpen}
        onClose={() => setIsConcreteDrivewayCostCalculatorOpen(false)}
      />
      <GroutCalculatorModal
        isOpen={isGroutCalculatorOpen}
        onClose={() => setIsGroutCalculatorOpen(false)}
      />
      <HoleVolumeCalculatorModal
        isOpen={isHoleVolumeCalculatorOpen}
        onClose={() => setIsHoleVolumeCalculatorOpen(false)}
      />
      <MortarCalculatorModal
        isOpen={isMortarCalculatorOpen}
        onClose={() => setIsMortarCalculatorOpen(false)}
      />
      <ThinsetCalculatorModal
        isOpen={isThinsetCalculatorOpen}
        onClose={() => setIsThinsetCalculatorOpen(false)}
      />
      <BrickCalculatorModal
        isOpen={isBrickCalculatorOpen}
        onClose={() => setIsBrickCalculatorOpen(false)}
      />
      <VastuCalculatorModal
        isOpen={isVastuCalculatorOpen}
        onClose={() => setIsVastuCalculatorOpen(false)}
      />
      <BoardFootCalculatorModal
        isOpen={isBoardFootCalculatorOpen}
        onClose={() => setIsBoardFootCalculatorOpen(false)}
      />
      <CubicYardCalculatorModal
        isOpen={isCubicYardCalculatorOpen}
        onClose={() => setIsCubicYardCalculatorOpen(false)}
      />
      <GallonsPerSquareFootCalculatorModal
        isOpen={isGallonsPerSquareFootCalculatorOpen}
        onClose={() => setIsGallonsPerSquareFootCalculatorOpen(false)}
      />
      
      {/* Converter Modals */}
      <LengthConverterModal
        isOpen={isLengthConverterOpen}
        onClose={() => setIsLengthConverterOpen(false)}
      />
      <AreaConverterModal
        isOpen={isAreaConverterOpen}
        onClose={() => setIsAreaConverterOpen(false)}
      />
      <VolumeConverterModal
        isOpen={isVolumeConverterOpen}
        onClose={() => setIsVolumeConverterOpen(false)}
      />
      <WeightConverterModal
        isOpen={isWeightConverterOpen}
        onClose={() => setIsWeightConverterOpen(false)}
      />
      <DensityConverterModal
        isOpen={isDensityConverterOpen}
        onClose={() => setIsDensityConverterOpen(false)}
      />
      <CementBagConverterModal
        isOpen={isCementBagConverterOpen}
        onClose={() => setIsCementBagConverterOpen(false)}
      />
      <SteelWeightConverterModal
        isOpen={isSteelWeightConverterOpen}
        onClose={() => setIsSteelWeightConverterOpen(false)}
      />
      <ConcreteVolumeConverterModal
        isOpen={isConcreteVolumeConverterOpen}
        onClose={() => setIsConcreteVolumeConverterOpen(false)}
      />
      <BrickBlockConverterModal
        isOpen={isBrickBlockConverterOpen}
        onClose={() => setIsBrickBlockConverterOpen(false)}
      />
      <SandAggregateConverterModal
        isOpen={isSandAggregateConverterOpen}
        onClose={() => setIsSandAggregateConverterOpen(false)}
      />
      <RebarLengthWeightConverterModal
        isOpen={isRebarLengthWeightConverterOpen}
        onClose={() => setIsRebarLengthWeightConverterOpen(false)}
      />
      <SheetMetalGaugeConverterModal
        isOpen={isSheetMetalGaugeConverterOpen}
        onClose={() => setIsSheetMetalGaugeConverterOpen(false)}
      />
      <PipeDiameterConverterModal
        isOpen={isPipeDiameterConverterOpen}
        onClose={() => setIsPipeDiameterConverterOpen(false)}
      />
      <TileFlooringConverterModal
        isOpen={isTileFlooringConverterOpen}
        onClose={() => setIsTileFlooringConverterOpen(false)}
      />
      <PaintPlasterConverterModal
        isOpen={isPaintPlasterConverterOpen}
        onClose={() => setIsPaintPlasterConverterOpen(false)}
      />
      <PressureConverterModal
        isOpen={isPressureConverterOpen}
        onClose={() => setIsPressureConverterOpen(false)}
      />
      <ForceConverterModal
        isOpen={isForceConverterOpen}
        onClose={() => setIsForceConverterOpen(false)}
      />
      <TemperatureConverterModal
        isOpen={isTemperatureConverterOpen}
        onClose={() => setIsTemperatureConverterOpen(false)}
      />
      <EnergyConverterModal
        isOpen={isEnergyConverterOpen}
        onClose={() => setIsEnergyConverterOpen(false)}
      />
      <PowerConverterModal
        isOpen={isPowerConverterOpen}
        onClose={() => setIsPowerConverterOpen(false)}
      />
      <CO2EmissionConverterModal
        isOpen={isCO2EmissionConverterOpen}
        onClose={() => setIsCO2EmissionConverterOpen(false)}
      />
      <EnergyConsumptionConverterModal
        isOpen={isEnergyConsumptionConverterOpen}
        onClose={() => setIsEnergyConsumptionConverterOpen(false)}
      />
      <WaterUsageConverterModal
        isOpen={isWaterUsageConverterOpen}
        onClose={() => setIsWaterUsageConverterOpen(false)}
      />
      <CurrencyConverterModal
        isOpen={isCurrencyConverterOpen}
        onClose={() => setIsCurrencyConverterOpen(false)}
      />
      <UnitCostConverterModal
        isOpen={isUnitCostConverterOpen}
        onClose={() => setIsUnitCostConverterOpen(false)}
      />
      <MaterialCostIndexConverterModal
        isOpen={isMaterialCostIndexConverterOpen}
        onClose={() => setIsMaterialCostIndexConverterOpen(false)}
      />
      <CoordinateConverterModal
        open={isCoordinateConverterOpen}
        onOpenChange={setIsCoordinateConverterOpen}
      />
      <SlopeConverterModal
        open={isSlopeConverterOpen}
        onOpenChange={setIsSlopeConverterOpen}
      />
      <ElevationConverterModal
        open={isElevationConverterOpen}
        onOpenChange={setIsElevationConverterOpen}
      />
      <VoltageConverterModal
        open={isVoltageConverterOpen}
        onOpenChange={setIsVoltageConverterOpen}
      />
      <CurrentConverterModal
        open={isCurrentConverterOpen}
        onOpenChange={setIsCurrentConverterOpen}
      />
      <PowerFactorConverterModal
        open={isPowerFactorConverterOpen}
        onOpenChange={setIsPowerFactorConverterOpen}
      />
      <FlowRateConverterModal
        open={isFlowRateConverterOpen}
        onOpenChange={setIsFlowRateConverterOpen}
      />
      <AirflowConverterModal
        open={isAirflowConverterOpen}
        onOpenChange={setIsAirflowConverterOpen}
      />
      <ScaleConverterModal
        open={isScaleConverterOpen}
        onOpenChange={setIsScaleConverterOpen}
      />
      <CoordinateUnitConverterModal
        open={isCoordinateUnitConverterOpen}
        onOpenChange={setIsCoordinateUnitConverterOpen}
      />
      <AngleConverterModal
        open={isAngleConverterOpen}
        onOpenChange={setIsAngleConverterOpen}
      />
      <TimeConverterModal
        open={isTimeConverterOpen}
        onOpenChange={setIsTimeConverterOpen}
      />
      <FuelConsumptionConverterModal
        open={isFuelConsumptionConverterOpen}
        onOpenChange={setIsFuelConsumptionConverterOpen}
      />
      <SpeedConverterModal
        open={isSpeedConverterOpen}
        onOpenChange={setIsSpeedConverterOpen}
      />
      </div>
      
      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ARQONZ.COM. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Tools;
