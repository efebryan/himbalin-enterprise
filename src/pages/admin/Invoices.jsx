import React, { useState, useEffect, useRef, useCallback } from "react";
import { getOrders } from "../../lib/api";
import { formatPrice } from "../../lib/formatCurrency";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiEye, FiPrinter, FiDownload, FiX,
  FiFileText, FiTruck, FiCheckCircle, FiClock, FiUser,
  FiMapPin, FiPhone, FiMail, FiCalendar
} from "react-icons/fi";
import { useSiteSettings } from "../../context/SiteSettingsContext";

// ── Helpers ───────────────────────────────────────────────────────────────

const getShipmentData = (orderId) => {
  try {
    const saved = localStorage.getItem(`hbl_shipment_${orderId}`);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};

const generateInvoiceNumber = (order) => {
  const date = new Date(order.created_at);
  const year = date.getFullYear();
  const seq = order.id.substring(0, 6).toUpperCase();
  return `INV-${year}-${seq}`;
};

const getStatusColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered") || s.includes("completed")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("delivery") || s.includes("out")) return "bg-orange-50 text-orange-700 border-orange-200";
  if (s.includes("shipped")) return "bg-purple-50 text-purple-700 border-purple-200";
  if (s.includes("processing")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (s.includes("pending")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("cancelled")) return "bg-red-50 text-red-700 border-red-200";
  return "bg-gray-50 text-gray-600 border-gray-200";
};

const formatDate = (ts) => {
  if (!ts) return "N/A";
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });
};

// ── Invoice Print View ────────────────────────────────────────────────────

const InvoiceModal = ({ invoice, onClose, settings }) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', sans-serif; 
              color: #2B1A12; 
              background: #fff; 
              -webkit-print-color-adjust: exact; 
              print-color-adjust: exact; 
            }
            .invoice-wrap { max-width: 800px; margin: 0 auto; padding: 40px; }
            h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif !important; }
          </style>
        </head>
        <body>
          <div class="invoice-wrap">${content}</div>
          <script>
            // Wait for Tailwind to process the classes before printing
            setTimeout(() => {
              window.print();
              window.close();
            }, 800);
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const subtotal = invoice.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || i.qty || 1), 0);
  const shippingFee = 0;
  const total = Number(invoice.order.total) || subtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto z-10 flex flex-col"
      >
        {/* Sticky Top Bar */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2B1A12]">Invoice Preview</h3>
            <span className="text-xs text-gray-400 font-mono">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2B1A12] text-white rounded-xl text-xs font-bold hover:bg-[#3d261b] transition-colors"
            >
              <FiPrinter className="text-sm" />
              Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-[#F4A623] rounded-lg flex items-center justify-center shrink-0">
                  <span className="font-serif font-bold text-[#2B1A12] text-lg">H</span>
                </div>
                <span className="font-serif text-xl font-bold text-[#2B1A12]">
                  {settings?.store_name || "Himbalin Enterprise"}
                </span>
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                {settings?.store_address || "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria"}
              </p>
              <p className="text-xs text-gray-500 mt-1">{settings?.store_email || "info@himbalin.com"}</p>
            </div>
            <div className="text-right">
              <h1 className="font-serif text-3xl font-bold text-[#2B1A12] mb-1">INVOICE</h1>
              <p className="text-xs font-mono text-[#F4A623] font-bold">{invoice.invoiceNumber}</p>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <div><span className="font-semibold text-gray-700">Issue Date:</span> {formatDate(invoice.order.created_at)}</div>
                <div><span className="font-semibold text-gray-700">Tracking No:</span> <span className="font-mono text-[#F4A623]">{invoice.trackingNo}</span></div>
              </div>
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 gap-6 mb-8 p-5 bg-[#FDFCFB] rounded-xl border border-gray-100">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Bill To</h3>
              <p className="font-bold text-sm text-[#2B1A12]">{invoice.order.customer_name}</p>
              <p className="text-xs text-gray-500 mt-1">{invoice.order.customer_email}</p>
              {invoice.order.phone && <p className="text-xs text-gray-500">{invoice.order.phone}</p>}
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Ship To</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {invoice.order.address || "—"}{invoice.order.city ? `, ${invoice.order.city}` : ""}
              </p>
              {invoice.shipment.driverName && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Courier</p>
                  <p className="text-xs text-gray-600">{invoice.shipment.driverName}</p>
                  {invoice.shipment.driverVehicle && <p className="text-xs text-gray-400">{invoice.shipment.driverVehicle}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#2B1A12] text-[#F5F1EC]">
                  <th className="p-3.5 pl-4 text-left text-[10px] font-bold uppercase tracking-widest">Item</th>
                  <th className="p-3.5 text-center text-[10px] font-bold uppercase tracking-widest">Qty</th>
                  <th className="p-3.5 text-right text-[10px] font-bold uppercase tracking-widest">Unit Price</th>
                  <th className="p-3.5 pr-4 text-right text-[10px] font-bold uppercase tracking-widest">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => {
                    const qty = item.quantity || item.qty || 1;
                    const price = Number(item.price || 0);
                    return (
                      <tr key={idx} className="hover:bg-[#FDFCFB]">
                        <td className="p-3.5 pl-4 font-medium">{item.name || `Furniture Item #${idx + 1}`}</td>
                        <td className="p-3.5 text-center text-gray-500">{qty}</td>
                        <td className="p-3.5 text-right text-gray-500 font-mono text-xs">{formatPrice(price)}</td>
                        <td className="p-3.5 pr-4 text-right font-bold font-mono text-xs">{formatPrice(price * qty)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400 text-xs italic">
                      No itemized breakdown available for this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium font-mono text-xs">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-medium font-mono text-xs text-emerald-600">{shippingFee === 0 ? "Included" : formatPrice(shippingFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-[#2B1A12]">Total</span>
                <span className="font-serif font-bold text-lg text-[#2B1A12]">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Status Banner */}
          <div className="p-4 rounded-xl border border-[#F4A623]/30 bg-[#F4A623]/5 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Shipment Status</p>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(invoice.order.status)}`}>
                  {invoice.order.status || "Pending"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Tracking Reference</p>
                <span className="font-mono font-bold text-sm text-[#F4A623]">{invoice.trackingNo}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-gray-100 pt-6 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              Thank you for choosing <span className="font-bold text-[#2B1A12]">{settings?.store_name || "Himbalin Enterprise"}</span> for your luxury furniture needs.
              For any queries regarding this invoice, please contact {settings?.store_email || "info@himbalin.com"}.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Invoices Page ────────────────────────────────────────────────────

const Invoices = () => {
  const { settings } = useSiteSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to load invoices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build enriched invoice objects
  const invoices = orders.map((order) => {
    const shipment = getShipmentData(order.id);
    const trackingNo = shipment.trackingNo || `HBL-${order.id.substring(0, 8).toUpperCase()}`;
    const invoiceNumber = generateInvoiceNumber(order);
    const items = Array.isArray(order.items) ? order.items : [];
    return { order, shipment, trackingNo, invoiceNumber, items };
  });

  // Filtering
  const filtered = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      inv.invoiceNumber.toLowerCase().includes(term) ||
      inv.trackingNo.toLowerCase().includes(term) ||
      (inv.order.customer_name || "").toLowerCase().includes(term) ||
      (inv.order.customer_email || "").toLowerCase().includes(term) ||
      (inv.order.id || "").toLowerCase().includes(term)
    );
  });

  const kpi = {
    total: invoices.length,
    paid: invoices.filter(i => ["paid","processing","shipped","out for delivery","delivered","completed"].includes((i.order.status||"").toLowerCase())).length,
    pending: invoices.filter(i => ["pending"].includes((i.order.status||"").toLowerCase())).length,
    delivered: invoices.filter(i => ["delivered","completed"].includes((i.order.status||"").toLowerCase())).length,
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
          Invoice Management
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Generate and review invoices for all customer orders with full delivery details.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F4A623]/10 flex items-center justify-center text-[#F4A623]">
            <FiFileText className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Invoices</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{loading ? "—" : kpi.total}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <FiCheckCircle className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Paid Orders</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{loading ? "—" : kpi.paid}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FiClock className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{loading ? "—" : kpi.pending}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#2B1A12]/5 flex items-center justify-center text-[#2B1A12]">
            <FiTruck className="text-xl" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivered</span>
            <h3 className="text-2xl font-bold text-[#2B1A12]">{loading ? "—" : kpi.delivered}</h3>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><FiSearch /></span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Invoice No., Tracking No., or Customer..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:border-[#F4A623] rounded-xl text-sm focus:outline-none"
              />
            </div>
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-9 w-9 rounded-full border-4 border-[#F4A623] border-t-transparent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FDFCFB] border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  <th className="p-4 pl-6">Invoice No.</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Tracking No.</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-400 text-sm">
                      No invoices found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => (
                    <tr key={inv.order.id} className="hover:bg-[#FDFCFB]/50 transition-colors text-sm">
                      <td className="p-4 pl-6">
                        <span className="font-mono font-bold text-xs text-[#2B1A12]">{inv.invoiceNumber}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[#2B1A12]">{inv.order.customer_name}</div>
                        <span className="text-[10px] text-gray-400 block">{inv.order.customer_email}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-gray-600">{formatDate(inv.order.created_at)}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-[#F4A623]">{inv.trackingNo}</span>
                      </td>
                      <td className="p-4">
                        <div className="max-w-[160px] text-xs text-gray-500 truncate">
                          {inv.order.address || "—"}{inv.order.city ? `, ${inv.order.city}` : ""}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-serif font-bold text-sm text-[#2B1A12]">
                          {formatPrice(inv.order.total)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(inv.order.status)}`}>
                          {inv.order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#2B1A12] text-white rounded-xl text-[11px] font-bold hover:bg-[#3d261b] transition-colors ml-auto"
                        >
                          <FiEye className="text-xs" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceModal
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            settings={settings}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Invoices;
