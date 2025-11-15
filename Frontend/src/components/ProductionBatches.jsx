import React, { useState, useEffect } from "react";
import { ClipboardList, PlusCircle, RefreshCw } from "lucide-react";
import axios from "axios";

export default function MachineUsage() {
  const [usages, setUsages] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUsage, setNewUsage] = useState({
    usageId: "",
    machine: "",
    input: "",
    output: "",
    operator: "",
    productionDate: "",
  });

  // ✅ Fetch all machine usages
  const fetchUsages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/machine-usage");
      setUsages(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch machine usages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all machines for dropdown
  const fetchMachines = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/machines");
      setMachines(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch machines.");
    }
  };

  useEffect(() => {
    fetchUsages();
    fetchMachines();
  }, []);

  // ✅ Add new machine usage
  const addUsage = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/machine-usage/add", newUsage);
      await fetchUsages();
      setNewUsage({
        usageId: "",
        machine: "",
        input: "",
        output: "",
        operator: "",
        productionDate: "",
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add machine usage.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-10">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Machine Production Usage</h2>
        </div>
        <button
          onClick={fetchUsages}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </div>

      {/* ---------- ADD NEW USAGE ---------- */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
          <PlusCircle className="w-5 h-5 text-green-600 mr-2" /> Add New Usage
        </h3>

        <form
          onSubmit={addUsage}
          className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Usage ID"
            value={newUsage.usageId}
            onChange={(e) => setNewUsage({ ...newUsage, usageId: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <select
            value={newUsage.machine}
            onChange={(e) => setNewUsage({ ...newUsage, machine: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">Select Machine</option>
            {machines.map((m) => (
              <option key={m._id} value={m._id}>
                {m.machineName} ({m.machineType})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Input Quantity"
            value={newUsage.input}
            onChange={(e) => setNewUsage({ ...newUsage, input: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="number"
            placeholder="Output Quantity"
            value={newUsage.output}
            onChange={(e) => setNewUsage({ ...newUsage, output: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Operator Name"
            value={newUsage.operator}
            onChange={(e) => setNewUsage({ ...newUsage, operator: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="date"
            value={newUsage.productionDate}
            onChange={(e) => setNewUsage({ ...newUsage, productionDate: e.target.value })}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center transition"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add
          </button>
        </form>
      </div>

      {/* ---------- VIEW USAGES TABLE ---------- */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center border-b pb-2">
          <ClipboardList className="w-5 h-5 text-blue-600 mr-2" /> View All Machine Usages
        </h3>

        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading usages...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-6">{error}</p>
        ) : usages.length === 0 ? (
          <p className="text-gray-500 text-center italic py-6">
            No machine usages found. Add one to get started!
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">Usage ID</th>
                  <th className="py-3 px-4">Machine</th>
                  <th className="py-3 px-4">Input</th>
                  <th className="py-3 px-4">Output</th>
                  <th className="py-3 px-4">Wastage</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {usages.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{u.usageId}</td>
                    <td className="py-3 px-4">{u.machine?.machineName} ({u.machine?.machineType})</td>
                    <td className="py-3 px-4">{u.input}</td>
                    <td className="py-3 px-4">{u.output}</td>
                    <td className="py-3 px-4 text-red-500 font-medium">{u.wastage}</td>
                    <td className="py-3 px-4">{u.operator}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(u.productionDate).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
