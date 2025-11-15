import React from 'react';
import { Package, QrCode, Scan, TrendingUp, AlertTriangle, Users } from 'lucide-react';

const stats = [
  {
    title: 'Total Items',
    value: '1,247',
    change: '+12%',
    changeType: 'positive',
    icon: Package,
    color: 'blue'
  },
  {
    title: 'QR Codes Generated',
    value: '856',
    change: '+8%',
    changeType: 'positive',
    icon: QrCode,
    color: 'green'
  },
  {
    title: 'Scans Today',
    value: '143',
    change: '+23%',
    changeType: 'positive',
    icon: Scan,
    color: 'purple'
  },
  {
    title: 'Low Stock Items',
    value: '12',
    change: '-3',
    changeType: 'negative',
    icon: AlertTriangle,
    color: 'red'
  }
];

const recentActivity = [
  { id: 1, action: 'QR Code Generated', item: 'Laptop Dell XPS 13', time: '2 minutes ago' },
  { id: 2, action: 'Item Scanned', item: 'Office Chair Ergonomic', time: '5 minutes ago' },
  { id: 3, action: 'Stock Updated', item: 'Wireless Mouse Logitech', time: '12 minutes ago' },
  { id: 4, action: 'New Supplier Added', item: 'TechCorp Solutions', time: '1 hour ago' },
  { id: 5, action: 'Inventory Check', item: 'Printer HP LaserJet', time: '2 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your inventory.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
              <QrCode className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Generate QR</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
              <Scan className="w-8 h-8 text-gray-400 group-hover:text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-green-700">Scan QR</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group">
              <Package className="w-8 h-8 text-gray-400 group-hover:text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Add Item</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors group">
              <Users className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Add Supplier</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}