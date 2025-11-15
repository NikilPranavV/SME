import React, { useEffect, useState } from "react";

export default function LowStockAlerts() {
  const [lowStockItems, setLowStockItems] = useState([]);

  const fetchLowStock = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/materials/:id/low-stock");
      const data = await res.json();
      setLowStockItems(data);
    } catch (err) {
      console.error("Error fetching low stock items:", err);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Low Stock Alerts</h1>
      {lowStockItems.length === 0 ? (
        <p className="text-gray-600">✅ All materials are sufficiently stocked.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Material</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
