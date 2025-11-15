import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, RefreshCw } from "lucide-react";
import axios from "axios";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  const BASE_URL = "http://localhost:5001/api/suppliers";

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!formData.name || !formData.contact || !formData.email || !formData.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(BASE_URL, formData);
      setFormData({ name: "", contact: "", email: "", address: "" });
      setShowForm(false);
      fetchSuppliers();
    } catch (err) {
      console.error("Error adding supplier:", err);
    }
  };

  const deleteSupplier = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchSuppliers}
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
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Supplier</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter supplier name"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Info
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter phone/email"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter email"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 resize-none"
                placeholder="Enter address"
              />
            </div>
          </div>
          <button
            onClick={handleAddSupplier}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Supplier
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Supplier ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No suppliers added yet
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier._id} className="border-t">
                  <td className="px-4 py-3">{supplier._id}</td>
                  <td className="px-4 py-3">{supplier.name}</td>
                  <td className="px-4 py-3">{supplier.contact}</td>
                  <td className="px-4 py-3">{supplier.email}</td>
                  <td className="px-4 py-3">{supplier.address}</td>
                  <td className="px-4 py-3">
                    {new Date(supplier.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteSupplier(supplier._id)}
                      className="flex items-center space-x-1 text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
