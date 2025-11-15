import { useState, useEffect } from "react";
import { PlusCircle, Trash2, RefreshCw } from "lucide-react";
import axios from "axios";

export default function RawMaterialPage() {
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [materialName, setMaterialName] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState<number>(0);

  const BASE_URL = "http://localhost:5001/api/materials";

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setRawMaterials(res.data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async () => {
    if (!materialName || materialQuantity <= 0) return;

    try {
      await axios.post(BASE_URL, { name: materialName, quantity: materialQuantity });
      setMaterialName("");
      setMaterialQuantity(0);
      setShowForm(false);
      fetchMaterials();
    } catch (err) {
      console.error("Error adding material:", err);
    }
  };

  const deleteMaterial = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchMaterials();
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Raw Materials</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchMaterials}
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
            <span>Add Raw Material</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white shadow rounded-xl p-6 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Raw Material</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter raw material name"
            />
            <input
              type="number"
              value={materialQuantity}
              onChange={(e) => setMaterialQuantity(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter quantity"
              min="1"
            />
          </div>
          <button
            onClick={handleAddMaterial}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Save Material
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Raw Material</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : rawMaterials.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No raw materials added yet
                </td>
              </tr>
            ) : (
              rawMaterials.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item._id}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteMaterial(item._id)}
                      className="text-red-600 hover:underline flex items-center space-x-1"
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
