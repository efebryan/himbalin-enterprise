import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TrackingHero from "../components/TrackingHero";
import TrackingForm from "../components/TrackingForm";
import OrderSummary from "../components/OrderSummary";
import TrackingTimeline from "../components/TrackingTimeline";
import DeliveryCard from "../components/DeliveryCard";
import OrderItems from "../components/OrderItems";
import MapPlaceholder from "../components/MapPlaceholder";
import SupportSection from "../components/SupportSection";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";
import { AnimatePresence } from "framer-motion";
import { mockOrders } from "../data/orders";
import { getOrders } from "../lib/api";

const buildTimeline = (status) => {
  const steps = [
    { status: "Order Confirmed", description: "Your order has been successfully placed.", date: "20 Jun 2026", completed: true },
    { status: "Payment Received", description: "Payment has been received.", date: "20 Jun 2026", completed: true },
    { status: "Processing", description: "Your furniture is being handcrafted.", date: "22 Jun 2026", completed: false },
    { status: "Ready for Dispatch", description: "Final quality inspection completed.", date: "24 Jun 2026", completed: false },
    { status: "Shipped", description: "Your order has left our warehouse.", date: "25 Jun 2026", completed: false },
    { status: "Out for Delivery", description: "Driver is delivering your furniture.", date: "Today", completed: false },
    { status: "Delivered", description: "Furniture set up in your room.", date: "Pending", completed: false }
  ];

  const s = status.toLowerCase();
  let progressIndex = 1;
  if (s.includes("processing")) progressIndex = 2;
  if (s.includes("dispatch") || s.includes("ready")) progressIndex = 3;
  if (s.includes("shipped")) progressIndex = 4;
  if (s.includes("delivery") || s.includes("out")) progressIndex = 5;
  if (s.includes("delivered") || s.includes("completed")) progressIndex = 6;

  return steps.map((step, idx) => {
    const completed = idx <= progressIndex;
    const isCurrent = idx === progressIndex;
    return {
      ...step,
      completed,
      isCurrent,
      date: isCurrent ? (s.includes("delivery") ? "Today before 6 PM" : "Today") : (completed ? step.date : "Pending")
    };
  });
};

const TrackOrder = () => {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeOrder, setActiveOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      const queryOrderId = searchParams.get("orderId");
      if (queryOrderId) {
        handleTrack(queryOrderId);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleTrack = async (trackingId) => {
    setError("");
    setLoading(true);
    
    try {
      // 1. Fetch real-time orders from Supabase
      const dbOrders = await getOrders().catch(() => []);
      const allOrders = [...mockOrders];

      dbOrders.forEach((order) => {
        const key = `hbl_shipment_${order.id}`;
        let extra = {};
        try {
          const saved = localStorage.getItem(key);
          if (saved) extra = JSON.parse(saved);
        } catch (e) {}

        const orderRef = order.paystack_reference ? `REF-${order.paystack_reference.substring(0, 8)}` : `ORD-${order.id.substring(0, 8)}`;
        const trackingNo = extra.trackingNo || `HBL-${order.id.substring(0, 8).toUpperCase()}`;
        const dbStatus = order.status || "Pending";

        const mappedOrder = {
          orderNumber: orderRef,
          customerName: order.customer_name,
          orderDate: new Date(order.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
          estimatedDelivery: "June 28, 2026",
          deliveryAddress: order.address ? `${order.address}, ${order.city || ""}` : "No Address provided",
          courierName: extra.driverName ? "Himbalin Logistics" : "Standard Shipping",
          trackingNumber: trackingNo,
          currentStatus: dbStatus,
          driver: extra.driverName ? {
            name: extra.driverName,
            vehicle: extra.driverVehicle,
            phone: extra.driverPhone,
            estimatedArrival: "2 Hours",
            condition: "Excellent"
          } : null,
          items: Array.isArray(order.items) ? order.items.map((item) => ({
            id: item.id || Math.random().toString(),
            name: item.name || "Luxury Furniture Item",
            quantity: item.quantity || item.qty || 1,
            price: item.price || 0,
            image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400"
          })) : [],
          timeline: buildTimeline(dbStatus)
        };
        
        allOrders.push(mappedOrder);
      });

      const matched = allOrders.find(
        (o) =>
          o.orderNumber.trim().toLowerCase() === trackingId.trim().toLowerCase() ||
          o.trackingNumber.trim().toLowerCase() === trackingId.trim().toLowerCase()
      );

      if (matched) {
        setActiveOrder(matched);
        setSearchParams({ orderId: trackingId.trim() });
      } else {
        setActiveOrder(null);
        setError("No matching order found. Please check your Tracking Number or Order ID.");
      }
    } catch (err) {
      console.error(err);
      setError("Error retrieving tracking data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setActiveOrder(null);
    setError("");
    setSearchParams({});
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader key="loader" />}
      </AnimatePresence>
      
      <main className="min-h-screen bg-himbalin-beige selection:bg-himbalin-gold selection:text-himbalin-dark antialiased flex flex-col justify-between">
        <div>
          <Navbar />
          <TrackingHero />
          
          <div className="container mx-auto px-6 py-12 max-w-7xl">
            {!activeOrder ? (
              <TrackingForm onTrack={handleTrack} error={error} />
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center -mt-6">
                  <button
                    onClick={handleClear}
                    className="text-xs font-bold uppercase tracking-wider text-himbalin-dark hover:text-himbalin-gold transition-colors flex items-center gap-1"
                  >
                    ← Track Another Order
                  </button>
                  <div className="text-xs text-gray-500 font-medium">
                    Showing details for: <span className="font-bold text-himbalin-dark">{activeOrder.orderNumber}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-8">
                    <TrackingTimeline timeline={activeOrder.timeline} />
                    <MapPlaceholder />
                  </div>

                  <div className="space-y-8">
                    <OrderSummary order={activeOrder} />
                    <OrderItems items={activeOrder.items} />
                    {activeOrder.driver && <DeliveryCard driver={activeOrder.driver} />}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-16">
              <SupportSection />
            </div>
          </div>
        </div>
        
        <Footer />
      </main>
    </>
  );
};

export default TrackOrder;
