import React, { useState, useEffect } from "react";
import { getOrders } from "../../lib/api";

const COLORS = [
  { bg: "bg-[#F4A623]", text: "text-[#2B1A12]" },
  { bg: "bg-[#2B1A12]", text: "text-[#2B1A12]" },
  { bg: "bg-amber-400", text: "text-[#2B1A12]" },
  { bg: "bg-gray-300", text: "text-gray-500" },
];

const SalesDistribution = () => {
  const [regions, setRegions] = useState([]);
  const [topMarket, setTopMarket] = useState("—");
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getOrders();

        if (!data || data.length === 0) {
          setRegions([]);
          setTotalOrders(0);
          return;
        }

        const cityCounts = {};
        let total = 0;

        data.forEach((order) => {
          const rawCity = (order.city || order.shipping_city || "Unknown").trim();
          const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();
          cityCounts[city] = (cityCounts[city] || 0) + 1;
          total++;
        });

        const sorted = Object.entries(cityCounts)
          .sort((a, b) => b[1] - a[1]);

        let built = [];
        let othersCount = 0;

        sorted.forEach(([city, count], index) => {
          if (index < 3) {
            built.push({
              name: city,
              percentage: Math.round((count / total) * 100),
              ...COLORS[index],
            });
          } else {
            othersCount += count;
          }
        });

        if (othersCount > 0) {
          built.push({
            name: "Other Regions",
            percentage: Math.round((othersCount / total) * 100),
            ...COLORS[3],
          });
        }

        setRegions(built);
        setTopMarket(sorted[0]?.[0] ?? "—");
        setTotalOrders(total);
      } catch (err) {
        console.error("Failed to load sales distribution:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-[#2B1A12]">Sales by Region</h2>
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
          All Time
        </span>
      </div>

      <div className="space-y-5">
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse text-center py-6">Loading...</p>
        ) : regions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No regional data yet.</p>
        ) : (
          regions.map((region) => (
            <div key={region.name}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${region.bg}`}></span>
                  <span className="text-sm font-semibold text-gray-600">{region.name}</span>
                </div>
                <span className="text-sm font-bold text-[#2B1A12]">{region.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${region.bg} rounded-full transition-all duration-700`}
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Row */}
      <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-0.5">Top Market</p>
          <p className="text-base font-bold text-[#2B1A12]">{loading ? "—" : topMarket}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-0.5">Total Orders</p>
          <p className="text-base font-bold text-[#2B1A12]">{loading ? "—" : totalOrders.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesDistribution;
