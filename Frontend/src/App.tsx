import React, { useState, FC } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import QRGenerator from "./components/QRGenerator";
import QRScanner from "./components/QRScanner";
import Inventory from "./components/Inventory";
import History from "./components/History";
import Suppliers from "./components/Suppliers";
import RawMaterialPage from "./components/RawMaterial";
import SupplyLogs from "./components/SupplyLogs";
import LowStockAlerts from "./components/LowStockAlerts";
import ProductionBatches from "./components/ProductionBatches";
import Efficiency from "./components/EfficiencyAnalytics.tsx";
import ProductionReports from "./components/ProductionReports.tsx";
import BatchAndMachineForm from "./components/Machine.tsx";

// Define all section types for safety
type Section =
  | "dashboard"
  | "qr-generator"
  | "qr-scanner"
  | "inventory"
  | "history"
  | "suppliers"
  | "raw-materials"
  | "supply-logs"
  | "alerts"
  | "production-batches"
  | "machine-tracking"
  | "efficiency"
  | "production-reports"
  | "batch-machine-form";

// Define sidebar props type if needed
interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

// ✅ Main App Component
const App: FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");

  const renderContent = (): JSX.Element => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "qr-generator":
        return <QRGenerator />;
      case "qr-scanner":
        return <QRScanner />;
      case "inventory":
        return <Inventory />;
      case "history":
        return <History />;
      case "suppliers":
        return <Suppliers />;
      case "raw-materials":
        return <RawMaterialPage />;
      case "supply-logs":
        return <SupplyLogs />;
      case "alerts":
        return <LowStockAlerts />;
      case "production-batches":
        return <ProductionBatches />;
      case "efficiency":
        return <Efficiency />;
      case "production-reports":
        return <ProductionReports />;
      case "batch-machine-form":
        return <BatchAndMachineForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
