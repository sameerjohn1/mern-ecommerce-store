import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, AreaChart as AreaChartIcon, BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [activeChartType, setActiveChartType] = useState("line");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-emerald-500 to-green-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-cyan-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-emerald-500 to-lime-700"
        />
      </div>
      <motion.div
        className="bg-gray-800/60 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">Sales & Revenue Overview</h2>
          <div className="flex bg-gray-700/50 p-1 rounded-lg border border-gray-600">
            <button
              onClick={() => setActiveChartType("line")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeChartType === "line"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Line
            </button>
            <button
              onClick={() => setActiveChartType("area")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeChartType === "area"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <AreaChartIcon className="h-4 w-4" />
              Area
            </button>
            <button
              onClick={() => setActiveChartType("bar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeChartType === "bar"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Bar
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          {activeChartType === "line" ? (
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#D1D5DB" />
              <YAxis yAxisId="left" stroke="#D1D5DB" />
              <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#10B981"
                activeDot={{ r: 8 }}
                name="Sales"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                activeDot={{ r: 8 }}
                name="Revenue"
              />
            </LineChart>
          ) : activeChartType === "area" ? (
            <AreaChart data={dailySalesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#D1D5DB" />
              <YAxis yAxisId="left" stroke="#D1D5DB" />
              <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorSales)"
                name="Sales"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          ) : (
            <BarChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#D1D5DB" />
              <YAxis yAxisId="left" stroke="#D1D5DB" />
              <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="sales"
                fill="#10B981"
                name="Sales"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#3B82F6"
                name="Revenue"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </motion.div>
);
