import React, { useState, useEffect } from "react";
import { BarChart3, Download } from "lucide-react";
import axios from "axios";

interface MachineUsage {
  _id: string;
  machine: string | { _id: string; machineName: string };
  input: number;
  output: number;
  wastage: number;
  operator: string;
  productionDate: string;
}

interface Machine {
  _id: string;
  machineName: string;
}

interface Filter {
  machine: string;
  operator: string;
  startDate: string;
  endDate: string;
}

const ProductionReports: React.FC = () => {
  const [usages, setUsages] = useState<MachineUsage[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<Filter>({
    machine: "all",
    operator: "all",
    startDate: "",
    endDate: "",
  });

  const fetchMachines = async () => {
    try {
      const res = await axios.get<Machine[]>("http://localhost:5001/api/machines");
      setMachines(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch machines.");
    }
  };

  const fetchUsages = async () => {
    try {
      setLoading(true);
      const res = await axios.get<MachineUsage[]>("http://localhost:5001/api/machine-usage");
      setUsages(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch production data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchUsages();
  }, []);

  const filteredUsages = usages.filter((u) => {
    const machineId = typeof u.machine === "object" ? u.machine._id : u.machine;
    const machineMatch = filter.machine === "all" || machineId === filter.machine;
    const operatorMatch = filter.operator === "all" || u.operator === filter.operator;
    const dateMatch =
      (!filter.startDate || new Date(u.productionDate) >= new Date(filter.startDate)) &&
      (!filter.endDate || new Date(u.productionDate) <= new Date(filter.endDate));
    return machineMatch && operatorMatch && dateMatch;
  });

  // CSV Download Logic
  const downloadCSV = () => {
    if (filteredUsages.length === 0) return;

    const headers = ["Machine", "Operator", "Input", "Output", "Wastage", "Date"];
    const rows = filteredUsages.map((u) => [
      typeof u.machine === "object"
        ? u.machine.machineName
        : machines.find((m) => m._id === u.machine)?.machineName || u.machine,
      u.operator,
      u.input,
      u.output,
      u.wastage,
      new Date(u.productionDate).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "production_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* HEADER */}
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Production Reports</h2>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4">
        <select
          value={filter.machine}
          onChange={(e) => setFilter({ ...filter, machine: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="all">All Machines</option>
          {machines.map((m) => (
            <option key={m._id} value={m._id}>
              {m.machineName}
            </option>
          ))}
        </select>

        <select
          value={filter.operator}
          onChange={(e) => setFilter({ ...filter, operator: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="all">All Operators</option>
          {[...new Set(usages.map((u) => u.operator))].map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg"
        />
        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
          className="border border-gray-300 p-2 rounded-lg"
        />

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      {/* REPORT TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 text-center py-6">Loading data...</p>
        ) : error ? (
          <p className="text-red-600 text-center py-6">{error}</p>
        ) : filteredUsages.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No data available.</p>
        ) : (
          <table className="w-full text-left text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Machine</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Input</th>
                <th className="py-3 px-4">Output</th>
                <th className="py-3 px-4">Wastage</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsages.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    {typeof u.machine === "object"
                      ? u.machine.machineName
                      : machines.find((m) => m._id === u.machine)?.machineName || u.machine}
                  </td>
                  <td className="py-3 px-4">{u.operator}</td>
                  <td className="py-3 px-4">{u.input}</td>
                  <td className="py-3 px-4">{u.output}</td>
                  <td className="py-3 px-4 text-red-500 font-medium">{u.wastage}</td>
                  <td className="py-3 px-4">{new Date(u.productionDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductionReports;
