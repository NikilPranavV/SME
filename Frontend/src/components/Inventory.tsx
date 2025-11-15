import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Layers,
} from "lucide-react";
import axios from "axios";

// ✅ Hardcoded Finished Goods
const finishedGoods = [
  {
    id: "fg-1",
    name: "Laptop Dell XPS 13",
    sku: "DELL-XPS13-001",
    category: "Electronics",
    quantity: 15,
    location: "Warehouse A - Shelf 3B",
    status: "In Stock",
    lastUpdated: "2025-01-08",
  },
  {
    id: "fg-2",
    name: "Office Chair Ergonomic",
    sku: "CHAIR-ERG-002",
    category: "Furniture",
    quantity: 8,
    location: "Warehouse B - Section 1",
    status: "In Stock",
    lastUpdated: "2025-01-07",
  },
  {
    id: "fg-3",
    name: "Wireless Mouse Logitech",
    sku: "LOG-MOUSE-003",
    category: "Electronics",
    quantity: 3,
    location: "Warehouse A - Shelf 1A",
    status: "Low Stock",
    lastUpdated: "2025-01-06",
  },
  {
    id: "fg-4",
    name: "Printer Paper A4",
    sku: "PAPER-A4-004",
    category: "Office Supplies",
    quantity: 0,
    location: "Warehouse C - Storage",
    status: "Out of Stock",
    lastUpdated: "2025-01-05",
  },
];

export default function Inventory() {
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch raw materials from backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/materials")
      .then((res) => {
        setRawMaterials(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching materials:", err);
        setRawMaterials([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Finished Goods filter
  const filteredFinishedGoods = finishedGoods.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ Raw Materials filter
  const filteredRawMaterials = rawMaterials
    .map((mat: any) => ({
      id: mat._id || `raw-${Math.random()}`,
      name: mat.name || "Unnamed Material",
      sku: mat.sku || `RAW-${(mat._id || "").toString().slice(-4)}`,
      category: "Raw Materials",
      quantity: mat.quantity ?? 0,
      location: mat.location || "Warehouse A",
      status:
        (mat.quantity ?? 0) > 10
          ? "In Stock"
          : (mat.quantity ?? 0) > 0
          ? "Low Stock"
          : "Out of Stock",
      lastUpdated: mat.updatedAt
        ? new Date(mat.updatedAt).toLocaleDateString()
        : "N/A",
    }))
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  // ✅ Badge color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";
      case "Out of Stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-8 h-8 text-blue-600" />
            Inventory Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Track raw materials and finished goods in real time
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Raw Materials">Raw Materials</option>
          </select>
        </div>
      </div>

      {/* ✅ Raw Materials Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Raw Materials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRawMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Quantity:</span>{" "}
                  {item.quantity}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Location:</span>{" "}
                  {item.location}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Last Updated:</span>{" "}
                  {item.lastUpdated}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredRawMaterials.length === 0 && (
          <p className="text-gray-500 mt-4">No raw materials found</p>
        )}
      </section>

      {/* ✅ Finished Goods Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Finished Goods
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFinishedGoods.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  {item.category}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Quantity:</span>{" "}
                  {item.quantity}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Location:</span>{" "}
                  {item.location}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Last Updated:</span>{" "}
                  {item.lastUpdated}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredFinishedGoods.length === 0 && (
          <p className="text-gray-500 mt-4">No finished goods found</p>
        )}
      </section>
    </div>
  );
}
