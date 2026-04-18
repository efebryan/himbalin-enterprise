import React from "react";
import OrderStatCard from "../../components/admin/orders/OrderStatCard";
import ProductsTable from "../../components/admin/products/ProductsTable";

import { HiOutlineCube, HiOutlineTag } from "react-icons/hi";
import { BiErrorCircle } from "react-icons/bi";

const Products = () => {
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
          value="124"
          subtitle="+6 added this month"
          subtitleColor="text-emerald-500"
          icon={<HiOutlineCube />}
          iconBgColor="bg-[#F4A623]/10"
          iconColor="text-[#F4A623]"
        />
        <OrderStatCard
          title="Low Stock Alerts"
          value="12"
          subtitle="Immediate action required"
          subtitleColor="text-orange-500"
          subtitleIcon={<BiErrorCircle className="inline" />}
          icon={<HiOutlineTag />}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-500"
        />
        <OrderStatCard
          title="Out of Stock"
          value="5"
          subtitle="Revenue blocking items"
          subtitleColor="text-red-400"
          icon={<BiErrorCircle />}
          iconBgColor="bg-red-50"
          iconColor="text-red-400"
        />
      </div>

      {/* Products Data Table */}
      <ProductsTable />
    </>
  );
};

export default Products;
