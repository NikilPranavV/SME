/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";

interface MachineData {
  _id?: string;
  machineName: string;
  machineType: string;
  capacity: string;
  location: string;
}

const MachineForm: React.FC = () => {
  const [machineData, setMachineData] = useState<MachineData>({
    machineName: "",
    machineType: "",
    capacity: "",
    location: "",
  });

  const [machines, setMachines] = useState<MachineData[]>([]);
  const [message, setMessage] = useState<string>("");

  // Fetch all machines
  const fetchMachines = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/machines");
      setMachines(res.data || []);
    } catch (err: any) {
      setMessage("❌ Error fetching machines: " + err.message);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMachineData({ ...machineData, [name]: value });
  };

  const submitMachine = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/machines/add", machineData);
      setMessage(`✅ Machine added: ${res.data.data.machineName}`);
      setMachineData({ machineName: "", machineType: "", capacity: "", location: "" });
      fetchMachines();
    } catch (err: any) {
      setMessage("❌ Error adding machine: " + err.response?.data?.message || err.message);
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/machines/${id}`);
      setMessage("✅ Machine deleted successfully");
      fetchMachines();
    } catch (err: any) {
      setMessage("❌ Error deleting machine: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-8 grid gap-6 md:grid-cols-2">
      {/* ---------- Add Machine Form ---------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">⚙️ Add Machine</h2>
        <form className="grid gap-4" onSubmit={submitMachine}>
          <input
            name="machineName"
            placeholder="Machine Name"
            value={machineData.machineName}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
          <input
            name="machineType"
            placeholder="Machine Type"
            value={machineData.machineType}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            required
          />
          <input
            name="capacity"
            placeholder="Capacity"
            value={machineData.capacity}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
          <input
            name="location"
            placeholder="Location"
            value={machineData.location}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Add Machine
          </button>
        </form>
      </div>

      {/* ---------- Machine List & Delete ---------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">🗂️ Machines</h2>
        {machines.length === 0 ? (
          <p className="text-gray-500">No machines found. Add one!</p>
        ) : (
          <div className="space-y-2">
            {machines.map((m) => (
              <div
                key={m._id}
                className="flex justify-between items-center border p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium">{m.machineName}</p>
                  <p className="text-sm text-gray-500">
                    {m.machineType} | {m.capacity} | {m.location}
                  </p>
                </div>
                <button
                  onClick={() => m._id && deleteMachine(m._id)}
                  className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- Status Message ---------- */}
      {message && (
        <div className="absolute bottom-4 left-8 text-green-600 font-medium">{message}</div>
      )}
    </div>
  );
};

export default MachineForm;
