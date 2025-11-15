import React, { useState, useEffect } from "react";
import { PlusCircle, RefreshCw } from "lucide-react";
import axios from "axios";

export default function SupplyLogs() {
  const [supplies, setSupplies] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: "",
    rawMaterialId: "",
    quantitySupplied: "",
    price: "",
  });

  const SUPPLY_API = "http://localhost:5001/api/supplies";
  const SUPPLIER_API = "http://localhost:5001/api/suppliers";
  const RAWMATERIAL_API = "http://localhost:5001/api/materials";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [suppliesRes, suppliersRes, materialsRes] = await Promise.all([
        axios.get(SUPPLY_API),
        axios.get(SUPPLIER_API),
        axios.get(RAWMATERIAL_API),
      ]);
      setSupplies(suppliesRes.data);
      setSuppliers(suppliersRes.data);
      setRawMaterials(materialsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupply = async () => {
    if (!formData.supplierId || !formData.rawMaterialId || !formData.quantitySupplied || !formData.price) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(SUPPLY_API, formData);
      setFormData({ supplierId: "", rawMaterialId: "", quantitySupplied: "", price: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error("Error adding supply:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Supply Logs</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Supply</span>
          </button>
        </div>
      </div>

      {/* Add Supply Form */}
      {showForm && (
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Supply Log</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Raw Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Raw Material</label>
              <select
                value={formData.rawMaterialId}
                onChange={(e) => setFormData({ ...formData, rawMaterialId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Raw Material</option>
                {rawMaterials.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Supplied</label>
              <input
                type="number"
                min="1"
                value={formData.quantitySupplied}
                onChange={(e) => setFormData({ ...formData, quantitySupplied: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <button
            onClick={handleAddSupply}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Supply
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Raw Material</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Date Supplied</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : supplies.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No supply logs found
                </td>
              </tr>
            ) : (
              supplies.map((supply) => (
                <tr key={supply._id} className="border-t">
                  <td className="px-4 py-3">{supply._id}</td>
                  <td className="px-4 py-3">{supply.supplier.name}</td>
                  <td className="px-4 py-3">{supply.rawMaterial.name}</td>
                  <td className="px-4 py-3">{supply.quantitySupplied}</td>
                  <td className="px-4 py-3">{supply.price}</td>
                  <td className="px-4 py-3">{new Date(supply.dateSupplied).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
