import { useState } from "react";
import { ToolCard } from "./ToolCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import volumeMeasurement from "@/assets/calculators/volume-measurement.jpg";
import cementApplications from "@/assets/calculators/cement-applications.jpg";
import metalSteel from "@/assets/calculators/metal-steel.jpg";
import brickMasonry from "@/assets/calculators/brick-masonry.jpg";
import stoneAggregate from "@/assets/calculators/stone-aggregate.jpg";

interface ConverterToolsProps {
  onLaunchLengthConverter: () => void;
  onLaunchAreaConverter: () => void;
  onLaunchVolumeConverter: () => void;
  onLaunchWeightConverter: () => void;
  onLaunchDensityConverter: () => void;
  onLaunchCementBagConverter: () => void;
  onLaunchSteelWeightConverter: () => void;
  onLaunchConcreteVolumeConverter: () => void;
  onLaunchBrickBlockConverter: () => void;
  onLaunchSandAggregateConverter: () => void;
  onLaunchRebarLengthWeightConverter: () => void;
  onLaunchSheetMetalGaugeConverter: () => void;
  onLaunchPipeDiameterConverter: () => void;
  onLaunchTileFlooringConverter: () => void;
  onLaunchPaintPlasterConverter: () => void;
  onLaunchPressureConverter: () => void;
  onLaunchForceConverter: () => void;
  onLaunchTemperatureConverter: () => void;
  onLaunchEnergyConverter: () => void;
  onLaunchPowerConverter: () => void;
  onLaunchCO2EmissionConverter: () => void;
  onLaunchEnergyConsumptionConverter: () => void;
  onLaunchWaterUsageConverter: () => void;
  onLaunchCurrencyConverter: () => void;
  onLaunchUnitCostConverter: () => void;
  onLaunchMaterialCostIndexConverter: () => void;
  onLaunchCoordinateConverter: () => void;
  onLaunchSlopeConverter: () => void;
  onLaunchElevationConverter: () => void;
  onLaunchVoltageConverter: () => void;
  onLaunchCurrentConverter: () => void;
  onLaunchPowerFactorConverter: () => void;
  onLaunchFlowRateConverter: () => void;
  onLaunchAirflowConverter: () => void;
  onLaunchScaleConverter: () => void;
  onLaunchCoordinateUnitConverter: () => void;
  onLaunchAngleConverter: () => void;
  onLaunchTimeConverter: () => void;
  onLaunchFuelConsumptionConverter: () => void;
  onLaunchSpeedConverter: () => void;
}

const categories = [
  { id: "all", name: "All Converters" },
  { id: "basic", name: "Basic Units" },
  { id: "material", name: "Material Quantity" },
  { id: "construction", name: "Construction Measurement" },
  { id: "engineering", name: "Engineering Properties" },
  { id: "environmental", name: "Environmental" },
  { id: "financial", name: "Financial" },
  { id: "geographic", name: "Geographic" },
  { id: "electrical", name: "Electrical & MEP" },
  { id: "design", name: "Design & Drafting" },
  { id: "utility", name: "Utility" },
];

const converters = [
  // Basic Unit Converters
  { id: 'length', title: 'Length Converter', description: 'Convert mm ↔ cm ↔ m ↔ ft ↔ inch ↔ yard', image: volumeMeasurement, category: 'basic' },
  { id: 'area', title: 'Area Converter', description: 'Convert sqft ↔ sqm ↔ acre ↔ hectare', image: volumeMeasurement, category: 'basic' },
  { id: 'volume', title: 'Volume Converter', description: 'Convert cum ↔ cft ↔ liter ↔ gallon', image: volumeMeasurement, category: 'basic' },
  { id: 'weight', title: 'Weight/Mass Converter', description: 'Convert kg ↔ ton ↔ lb ↔ quintal', image: volumeMeasurement, category: 'basic' },
  { id: 'density', title: 'Density Converter', description: 'Convert kg/m³ ↔ lb/ft³', image: volumeMeasurement, category: 'basic' },
  
  // Material Quantity Converters
  { id: 'cement-bag', title: 'Cement Bag Converter', description: 'Convert weight ↔ volume ↔ number of bags', image: cementApplications, category: 'material' },
  { id: 'steel-weight', title: 'Steel Weight Converter', description: 'Convert diameter ↔ length ↔ weight (e.g., 12mm bar)', image: metalSteel, category: 'material' },
  { id: 'concrete-volume', title: 'Concrete Volume Converter', description: 'Convert mix ratio ↔ bag count ↔ volume', image: cementApplications, category: 'material' },
  { id: 'brick-block', title: 'Brick/Block Converter', description: 'Convert quantity ↔ area ↔ volume', image: brickMasonry, category: 'material' },
  { id: 'sand-aggregate', title: 'Sand & Aggregate Converter', description: 'Convert volume ↔ weight ↔ truckload', image: stoneAggregate, category: 'material' },
  
  // Construction Measurement Converters
  { id: 'rebar-length-weight', title: 'Rebar Length ↔ Weight Converter', description: 'Convert rebar length to weight', image: metalSteel, category: 'construction' },
  { id: 'sheet-metal-gauge', title: 'Sheet Metal Gauge ↔ Thickness', description: 'Convert gauge to thickness', image: metalSteel, category: 'construction' },
  { id: 'pipe-diameter', title: 'Pipe Diameter Converter', description: 'nominal bore ↔ outside diameter ↔ schedule', image: volumeMeasurement, category: 'construction' },
  { id: 'tile-flooring', title: 'Tile / Flooring Converter', description: 'area ↔ tile count ↔ box count', image: volumeMeasurement, category: 'construction' },
  { id: 'paint-plaster', title: 'Paint / Plaster Coverage', description: 'area ↔ liters ↔ coats', image: volumeMeasurement, category: 'construction' },
  
  // Engineering Property Converters
  { id: 'pressure', title: 'Pressure Converter', description: 'Pa ↔ bar ↔ psi ↔ kg/cm²', image: volumeMeasurement, category: 'engineering' },
  { id: 'force', title: 'Force Converter', description: 'N ↔ kN ↔ kgf ↔ lbf', image: volumeMeasurement, category: 'engineering' },
  { id: 'temperature', title: 'Temperature Converter', description: '°C ↔ °F ↔ K', image: volumeMeasurement, category: 'engineering' },
  { id: 'energy', title: 'Energy Converter', description: 'J ↔ kWh ↔ BTU', image: volumeMeasurement, category: 'engineering' },
  { id: 'power', title: 'Power Converter', description: 'W ↔ kW ↔ HP', image: volumeMeasurement, category: 'engineering' },
  
  // Environmental & Sustainability Converters
  { id: 'co2-emission', title: 'CO₂ Emission Converter', description: 'tons ↔ kg ↔ equivalent trees offset', image: volumeMeasurement, category: 'environmental' },
  { id: 'energy-consumption', title: 'Energy Consumption Converter', description: 'kWh ↔ MJ ↔ BTU', image: volumeMeasurement, category: 'environmental' },
  { id: 'water-usage', title: 'Water Usage Converter', description: 'liters ↔ gallons ↔ cubic meters', image: volumeMeasurement, category: 'environmental' },
  
  // Financial & Commercial Converters
  { id: 'currency', title: 'Currency Converter', description: 'Real-time exchange rates for global projects', image: volumeMeasurement, category: 'financial' },
  { id: 'unit-cost', title: 'Unit Cost Converter', description: 'cost per sqft ↔ cost per sqm ↔ cost per unit', image: volumeMeasurement, category: 'financial' },
  { id: 'material-cost-index', title: 'Material Cost Index Converter', description: 'Adjust for region/year (inflation/location)', image: volumeMeasurement, category: 'financial' },
  
  // Geographic & Surveying Converters
  { id: 'coordinate', title: 'Coordinate Converter', description: 'GPS ↔ UTM ↔ local grid', image: volumeMeasurement, category: 'geographic' },
  { id: 'slope', title: 'Slope / Gradient Converter', description: 'degree ↔ % ↔ ratio (1:X)', image: volumeMeasurement, category: 'geographic' },
  { id: 'elevation', title: 'Elevation Converter', description: 'm ↔ ft ↔ datum reference', image: volumeMeasurement, category: 'geographic' },
  
  // Electrical & MEP Converters
  { id: 'voltage', title: 'Voltage Converter', description: 'V ↔ kV', image: volumeMeasurement, category: 'electrical' },
  { id: 'current', title: 'Current Converter', description: 'A ↔ mA ↔ kA', image: volumeMeasurement, category: 'electrical' },
  { id: 'power-factor', title: 'Power Factor Converter', description: 'kW ↔ kVA ↔ kVAR', image: volumeMeasurement, category: 'electrical' },
  { id: 'flow-rate', title: 'Flow Rate Converter', description: 'L/min ↔ m³/hr ↔ gpm', image: volumeMeasurement, category: 'electrical' },
  { id: 'airflow', title: 'Airflow Converter', description: 'CFM ↔ m³/s ↔ L/s', image: volumeMeasurement, category: 'electrical' },
  
  // Design & Drafting Converters
  { id: 'scale', title: 'Scale Converter', description: 'Real dimension ↔ drawing scale (1:50, 1:100)', image: volumeMeasurement, category: 'design' },
  { id: 'coordinate-unit', title: 'Coordinate Unit Converter', description: 'Inches ↔ millimeters (CAD imports/exports)', image: volumeMeasurement, category: 'design' },
  { id: 'angle', title: 'Angle Converter', description: 'Degrees ↔ radians ↔ slope %', image: volumeMeasurement, category: 'design' },
  
  // Miscellaneous / Utility Converters
  { id: 'time', title: 'Time Converter', description: 'Hours ↔ days ↔ weeks (for scheduling)', image: volumeMeasurement, category: 'utility' },
  { id: 'fuel-consumption', title: 'Fuel Consumption Converter', description: 'L/100km ↔ mpg', image: volumeMeasurement, category: 'utility' },
  { id: 'speed', title: 'Speed Converter', description: 'm/s ↔ km/h ↔ ft/s', image: volumeMeasurement, category: 'utility' },
];

export const ConverterTools = ({ 
  onLaunchLengthConverter,
  onLaunchAreaConverter,
  onLaunchVolumeConverter,
  onLaunchWeightConverter,
  onLaunchDensityConverter,
  onLaunchCementBagConverter,
  onLaunchSteelWeightConverter,
  onLaunchConcreteVolumeConverter,
  onLaunchBrickBlockConverter,
  onLaunchSandAggregateConverter,
  onLaunchRebarLengthWeightConverter,
  onLaunchSheetMetalGaugeConverter,
  onLaunchPipeDiameterConverter,
  onLaunchTileFlooringConverter,
  onLaunchPaintPlasterConverter,
  onLaunchPressureConverter,
  onLaunchForceConverter,
  onLaunchTemperatureConverter,
  onLaunchEnergyConverter,
  onLaunchPowerConverter,
  onLaunchCO2EmissionConverter,
  onLaunchEnergyConsumptionConverter,
  onLaunchWaterUsageConverter,
  onLaunchCurrencyConverter,
  onLaunchUnitCostConverter,
  onLaunchMaterialCostIndexConverter,
  onLaunchCoordinateConverter,
  onLaunchSlopeConverter,
  onLaunchElevationConverter,
  onLaunchVoltageConverter,
  onLaunchCurrentConverter,
  onLaunchPowerFactorConverter,
  onLaunchFlowRateConverter,
  onLaunchAirflowConverter,
  onLaunchScaleConverter,
  onLaunchCoordinateUnitConverter,
  onLaunchAngleConverter,
  onLaunchTimeConverter,
  onLaunchFuelConsumptionConverter,
  onLaunchSpeedConverter
}: ConverterToolsProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const handleConverterClick = (id: string) => {
    switch (id) {
      case 'length':
        onLaunchLengthConverter();
        break;
      case 'area':
        onLaunchAreaConverter();
        break;
      case 'volume':
        onLaunchVolumeConverter();
        break;
      case 'weight':
        onLaunchWeightConverter();
        break;
      case 'density':
        onLaunchDensityConverter();
        break;
      case 'cement-bag':
        onLaunchCementBagConverter();
        break;
      case 'steel-weight':
        onLaunchSteelWeightConverter();
        break;
      case 'concrete-volume':
        onLaunchConcreteVolumeConverter();
        break;
      case 'brick-block':
        onLaunchBrickBlockConverter();
        break;
      case 'sand-aggregate':
        onLaunchSandAggregateConverter();
        break;
      case 'rebar-length-weight':
        onLaunchRebarLengthWeightConverter();
        break;
      case 'sheet-metal-gauge':
        onLaunchSheetMetalGaugeConverter();
        break;
      case 'pipe-diameter':
        onLaunchPipeDiameterConverter();
        break;
      case 'tile-flooring':
        onLaunchTileFlooringConverter();
        break;
      case 'paint-plaster':
        onLaunchPaintPlasterConverter();
        break;
      case 'pressure':
        onLaunchPressureConverter();
        break;
      case 'force':
        onLaunchForceConverter();
        break;
      case 'temperature':
        onLaunchTemperatureConverter();
        break;
      case 'energy':
        onLaunchEnergyConverter();
        break;
      case 'power':
        onLaunchPowerConverter();
        break;
      case 'co2-emission':
        onLaunchCO2EmissionConverter();
        break;
      case 'energy-consumption':
        onLaunchEnergyConsumptionConverter();
        break;
      case 'water-usage':
        onLaunchWaterUsageConverter();
        break;
      case 'currency':
        onLaunchCurrencyConverter();
        break;
      case 'unit-cost':
        onLaunchUnitCostConverter();
        break;
      case 'material-cost-index':
        onLaunchMaterialCostIndexConverter();
        break;
      case 'coordinate':
        onLaunchCoordinateConverter();
        break;
      case 'slope':
        onLaunchSlopeConverter();
        break;
      case 'elevation':
        onLaunchElevationConverter();
        break;
      case 'voltage':
        onLaunchVoltageConverter();
        break;
      case 'current':
        onLaunchCurrentConverter();
        break;
      case 'power-factor':
        onLaunchPowerFactorConverter();
        break;
      case 'flow-rate':
        onLaunchFlowRateConverter();
        break;
      case 'airflow':
        onLaunchAirflowConverter();
        break;
      case 'scale':
        onLaunchScaleConverter();
        break;
      case 'coordinate-unit':
        onLaunchCoordinateUnitConverter();
        break;
      case 'angle':
        onLaunchAngleConverter();
        break;
      case 'time':
        onLaunchTimeConverter();
        break;
      case 'fuel-consumption':
        onLaunchFuelConsumptionConverter();
        break;
      case 'speed':
        onLaunchSpeedConverter();
        break;
    }
  };

  const filteredConverters = selectedCategory === "all" 
    ? converters 
    : converters.filter(converter => converter.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Unit Converters</h2>
        <p className="text-muted-foreground">Professional unit conversion tools for AEC professionals</p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto justify-start gap-2 bg-muted/50 p-2">
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

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredConverters.map((converter) => (
              <ToolCard
                key={converter.id}
                title={converter.title}
                description={converter.description}
                image={converter.image}
                credits={0}
                onLaunch={() => handleConverterClick(converter.id)}
                compact={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
