import React, { useState, useEffect } from "react";
import { getOrders } from "../../../lib/api";

const COLORS = [
  "bg-[#F4A623]", // Orange
  "bg-[#2B1A12]", // Dark brown
  "bg-amber-400", // Light orange
  "bg-emerald-500", // Green
  "bg-gray-400"   // Gray
];

const GeographicInsights = () => {
  const [regions, setRegions] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeographicData = async () => {
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

        data.forEach(order => {
          // Capitalize and clean up city names
          const rawCity = (order.city || "Unknown").trim();
          const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();
          
          cityCounts[city] = (cityCounts[city] || 0) + 1;
          total++;
        });

        // Convert to array and sort by count descending
        const sortedCities = Object.entries(cityCounts)
          .map(([city, count]) => ({
            city,
            orders: count,
            percentage: Math.round((count / total) * 100)
          }))
          .sort((a, b) => b.orders - a.orders);

        // Group top 4 individually, rest goes into "Others"
        let finalRegions = [];
        let othersCount = 0;

        sortedCities.forEach((item, index) => {
          if (index < 4) {
            finalRegions.push({
               ...item,
               color: COLORS[index]
            });
          } else {
            othersCount += item.orders;
          }
        });

        if (othersCount > 0) {
           finalRegions.push({
             city: "Others",
             orders: othersCount,
             percentage: Math.round((othersCount / total) * 100),
             color: COLORS[4]
           });
        }

        setRegions(finalRegions);
        setTotalOrders(total);
      } catch (error) {
        console.error("Failed to load geographic insights:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeographicData();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold text-[#2B1A12]">
          Order Geographic Insights
        </h3>
        <span className="text-xs font-bold text-gray-400 border border-gray-100 bg-gray-50 px-3 py-1.5 rounded-full tracking-wider uppercase">
          By City
        </span>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse text-center py-8">Loading insights...</p>
        ) : regions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No order data available yet.</p>
        ) : (
          regions.map((region) => (
            <div key={region.city}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-sm ${region.color}`}></span>
                  <span className="text-sm font-semibold text-gray-700">{region.city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400">{region.orders} orders</span>
                  <span className="text-sm font-bold text-[#2B1A12] w-10 text-right">{region.percentage}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${region.color} rounded-full transition-all duration-700`}
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400 font-medium">
          Total: <span className="font-bold text-[#2B1A12]">{loading ? "-" : totalOrders.toLocaleString()} orders</span>
        </p>
        <p className="text-xs text-gray-400 font-medium">
          Last updated: <span className="text-[#F4A623] font-semibold">Live</span>
        </p>
      </div>
    </div>
  );
};

export default GeographicInsights;
