import React from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  Scan, 
  Package, 
  History, 
  Truck,
  ChevronRight,
  BoxesIcon,
  AlertTriangle,
  Factory,     // 🏭 Production Icons
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'qr-generator', label: 'QR Generator', icon: QrCode },
  { id: 'qr-scanner', label: 'QR Scanner', icon: Scan },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'history', label: 'History', icon: History },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'raw-materials', label: 'Raw Materials', icon: BoxesIcon },
  { id: 'supply-logs', label: 'Supply Logs', icon: Package },
  { id: 'alerts', label: 'Low Stock Alerts', icon: AlertTriangle },

  // 🏭 Production Modules
  { id: 'production-batches', label: 'Production Batches', icon: Factory },
  { id: 'efficiency', label: 'Efficiency Analytics', icon: BarChart3 },
  { id: 'production-reports', label: 'Production Reports', icon: History },
  { id: 'batch-machine-form', label: 'Add Batch/Machine', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col z-50">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">QR Inventory</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      {/* Scrollable Menu Section */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          © 2025 QR Inventory System
        </div>
      </div>
    </div>
  );
}
