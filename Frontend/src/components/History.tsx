import React, { useState } from 'react';
import { History as HistoryIcon, Calendar, Filter, Download, Search } from 'lucide-react';

const historyData = [
  {
    id: 1,
    action: 'QR Code Generated',
    item: 'Laptop Dell XPS 13',
    sku: 'DELL-XPS13-001',
    user: 'John Doe',
    timestamp: '2025-01-08 14:30:25',
    details: 'Generated QR code for new inventory item'
  },
  {
    id: 2,
    action: 'Item Scanned',
    item: 'Office Chair Ergonomic',
    sku: 'CHAIR-ERG-002',
    user: 'Jane Smith',
    timestamp: '2025-01-08 14:25:10',
    details: 'Scanned for inventory check'
  },
  {
    id: 3,
    action: 'Stock Updated',
    item: 'Wireless Mouse Logitech',
    sku: 'LOG-MOUSE-003',
    user: 'Mike Johnson',
    timestamp: '2025-01-08 14:18:45',
    details: 'Quantity updated from 5 to 3'
  },
  {
    id: 4,
    action: 'Item Added',
    item: 'Printer HP LaserJet',
    sku: 'HP-LASER-004',
    user: 'Sarah Wilson',
    timestamp: '2025-01-08 13:45:20',
    details: 'New item added to inventory'
  },
  {
    id: 5,
    action: 'Supplier Updated',
    item: 'Raw Material Steel',
    sku: 'STEEL-RAW-005',
    user: 'David Brown',
    timestamp: '2025-01-08 13:30:15',
    details: 'Supplier information updated'
  }
];

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [dateRange, setDateRange] = useState('today');

  const filteredHistory = historyData.filter(entry => {
    const matchesSearch = entry.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = !selectedAction || entry.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'QR Code Generated':
        return 'bg-blue-100 text-blue-800';
      case 'Item Scanned':
        return 'bg-green-100 text-green-800';
      case 'Stock Updated':
        return 'bg-yellow-100 text-yellow-800';
      case 'Item Added':
        return 'bg-purple-100 text-purple-800';
      case 'Supplier Updated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity History</h1>
          <p className="text-gray-600 mt-2">Track all inventory activities and changes</p>
        </div>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Export History</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">All Actions</option>
              <option value="QR Code Generated">QR Code Generated</option>
              <option value="Item Scanned">Item Scanned</option>
              <option value="Stock Updated">Stock Updated</option>
              <option value="Item Added">Item Added</option>
              <option value="Supplier Updated">Supplier Updated</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{entry.item}</p>
                      <p className="text-sm text-gray-500 font-mono">{entry.sku}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{entry.user}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-mono text-sm">{entry.timestamp}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{entry.details}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No activity found matching your criteria</p>
        </div>
      )}
    </div>
  );
}