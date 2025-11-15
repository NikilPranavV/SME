import React, { useState, useEffect } from "react";
import { TrendingUp, Percent, Trash2 } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MachineUsage {
  _id: string;
  machine: string;
  input: number;
  output: number;
  wastage: number;
  operator: string;
  productionDate: string;
}

const Efficiency: React.FC = () => {
  const [usages, setUsages] = useState<MachineUsage[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  // Fetch usage data
  const fetchUsages = async () => {
    try {
      setLoading(true);
      const res = await axios.get<MachineUsage[]>("http://localhost:5001/api/machine-usage");
      setUsages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsages();
  }, []);

  // Calculate metrics
  const totalInput = usages.reduce((sum, u) => sum + u.input, 0);
  const totalOutput = usages.reduce((sum, u) => sum + u.output, 0);
  const totalWastage = usages.reduce((sum, u) => sum + u.wastage, 0);
  const yieldPercent = totalInput ? ((totalOutput / totalInput) * 100).toFixed(2) : "0";
  const wastagePercent = totalInput ? ((totalWastage / totalInput) * 100).toFixed(2) : "0";
  const efficiencyIndex = ((parseFloat(yieldPercent) - parseFloat(wastagePercent))).toFixed(2);

  // Prepare monthly data for chart
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData = months.map((_, i) => {
    const monthUsages = usages.filter(u => new Date(u.productionDate).getMonth() === i);
    const input = monthUsages.reduce((sum, u) => sum + u.input, 0);
    const output = monthUsages.reduce((sum, u) => sum + u.output, 0);
    return input ? ((output / input) * 100).toFixed(2) : 0;
  });

  // Weekly data (last 4 weeks)
  const today = new Date();
  const weeklyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const weeklyData = weeklyLabels.map((_, i) => {
    const start = new Date(today);
    start.setDate(today.getDate() - (i+1)*7);
    const end = new Date(today);
    end.setDate(today.getDate() - i*7);
    const weekUsages = usages.filter(u => {
      const d = new Date(u.productionDate);
      return d >= start && d <= end;
    });
    const input = weekUsages.reduce((sum, u) => sum + u.input, 0);
    const output = weekUsages.reduce((sum, u) => sum + u.output, 0);
    return input ? ((output / input) * 100).toFixed(2) : 0;
  }).reverse(); // reverse to show oldest week first

  // Operator-wise efficiency
  const operators = Array.from(new Set(usages.map(u => u.operator)));
  const operatorData = operators.map(op => {
    const opUsages = usages.filter(u => u.operator === op);
    const input = opUsages.reduce((sum, u) => sum + u.input, 0);
    const output = opUsages.reduce((sum, u) => sum + u.output, 0);
    return input ? ((output / input) * 100).toFixed(2) : 0;
  });

  const stats = [
    { id: 1, metric: "Yield %", value: `${yieldPercent}%`, icon: TrendingUp, color: "text-green-600" },
    { id: 2, metric: "Wastage %", value: `${wastagePercent}%`, icon: Trash2, color: "text-red-600" },
    { id: 3, metric: "Efficiency Index", value: `${efficiencyIndex}%`, icon: Percent, color: "text-blue-600" },
  ];

  return (
    <div className="p-6 bg-gray-50 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Yield & Efficiency Analysis</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`w-6 h-6 ${s.color}`} />
                <h3 className="text-lg font-medium text-gray-700">{s.metric}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly efficiency chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Monthly Yield %</h3>
        <Bar
          data={{
            labels: months,
            datasets: [{ label: "Yield %", data: monthlyData, backgroundColor: "rgba(59, 130, 246, 0.7)" }]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>

      {/* Weekly efficiency chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Yield % (Last 4 Weeks)</h3>
        <Line
          data={{
            labels: weeklyLabels,
            datasets: [{ label: "Yield %", data: weeklyData, borderColor: "rgba(34,197,94,0.8)", backgroundColor: "rgba(34,197,94,0.3)" }]
          }}
          options={{ responsive: true }}
        />
      </div>

      {/* Operator-wise efficiency */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Operator-wise Efficiency %</h3>
        <Bar
          data={{
            labels: operators,
            datasets: [{ label: "Yield %", data: operatorData, backgroundColor: "rgba(249,115,22,0.7)" }]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
    </div>
  );
};

export default Efficiency;
