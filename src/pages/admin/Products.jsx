import React, { useState, useEffect } from "react";
import OrderStatCard from "../../components/admin/orders/OrderStatCard";
import ProductsTable from "../../components/admin/products/ProductsTable";

import { HiOutlineCube, HiOutlineTag } from "react-icons/hi";
import { BiErrorCircle } from "react-icons/bi";
import { getProducts } from "../../lib/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products for stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate dynamic stats from database
  const totalProducts = products.length;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach((p) => {
    const statusVal = p.availability || p.status || "In Stock";
    if (statusVal === "Out of Stock") outOfStockCount++;
    if (statusVal === "Low Stock") lowStockCount++;
  });
  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
          Products Management
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Manage your catalog, pricing, and inventory.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <OrderStatCard
          title="Total Products"
          value={loading ? "-" : totalProducts.toString()}
          subtitle="Total items in catalog"
          subtitleColor="text-emerald-500"
          icon={<HiOutlineCube />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />
        <OrderStatCard
          title="Low Stock Alerts"
          value={loading ? "-" : lowStockCount.toString()}
          subtitle="Immediate action required"
          subtitleColor="text-orange-500"
          subtitleIcon={<BiErrorCircle className="inline" />}
          icon={<HiOutlineTag />}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-500"
        />
        <OrderStatCard
          title="Out of Stock"
          value={loading ? "-" : outOfStockCount.toString()}
          subtitle="Revenue blocking items"
          subtitleColor="text-red-400"
          icon={<BiErrorCircle />}
          iconBgColor="bg-red-50"
          iconColor="text-red-400"
        />
      </div>

      {/* Products Data Table */}
      <ProductsTable products={products} loading={loading} fetchProducts={fetchProducts} />
    </>
  );
};

export default Products;
