import React, { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../lib/supabase";

const ConsultingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [id, setId] = useState(null);
  const [heroTitle, setHeroTitle] = useState("Consulting Services");
  const [heroDescription, setHeroDescription] = useState(
    "Partner with our award-winning interior design experts to transform your home, office, or commercial space into something extraordinary."
  );
  
  const [services, setServices] = useState([]);
  const [trustPoints, setTrustPoints] = useState([
    { label: "Projects Completed", value: "500+" },
    { label: "Countries Served", value: "12" },
    { label: "Years of Experience", value: "15+" },
    { label: "Client Satisfaction", value: "98%" }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("consulting_content").select("*").limit(1).maybeSingle();
      if (error) throw error;
      
      if (data) {
        setId(data.id);
        if (data.hero_title) setHeroTitle(data.hero_title);
        if (data.hero_description) setHeroDescription(data.hero_description);
        if (data.services) setServices(data.services);
        if (data.trust_points) setTrustPoints(data.trust_points);
      } else {
        // Init default empty state in DB
        const { data: newData, error: insertErr } = await supabase.from("consulting_content").insert([{
          hero_title: heroTitle,
          hero_description: heroDescription,
          services: [],
          trust_points: trustPoints
        }]).select().single();
        if (!insertErr && newData) setId(newData.id);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to load settings.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        hero_title: heroTitle,
        hero_description: heroDescription,
        services,
        trust_points: trustPoints,
        updated_at: new Date()
      };
      
      let err;
      if (id) {
        const { error } = await supabase.from("consulting_content").update(payload).eq("id", id);
        err = error;
      } else {
        const { error } = await supabase.from("consulting_content").insert([payload]);
        err = error;
      }

      if (err) throw err;
      showToast("Consulting page updated successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      icon: "FiHome",
      badge: "",
      name: "New Service",
      description: "",
      price: 0,
      duration: "1 week",
      highlights: ["Highlight 1", "Highlight 2", "Highlight 3"]
    };
    setServices([...services, newService]);
  };

  const handleServiceChange = (id, field, value) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleRemoveService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleHighlightChange = (serviceId, idx, value) => {
    setServices(services.map(s => {
      if (s.id === serviceId) {
        const newHighlights = [...s.highlights];
        newHighlights[idx] = value;
        return { ...s, highlights: newHighlights };
      }
      return s;
    }));
  };

  const handleTrustPointChange = (idx, field, value) => {
    const newPoints = [...trustPoints];
    newPoints[idx][field] = value;
    setTrustPoints(newPoints);
  };

  const inputBase = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/20 focus:border-[#F4A623] transition-all text-sm";

  if (loading) {
    return <div className="p-8 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-8 font-sans max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Consulting Page</h1>
          <p className="text-gray-500 text-sm">Manage the content for the public Consulting page.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] rounded-lg text-sm font-bold shadow-md shadow-[#F4A623]/25 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <FiSave size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {toast.show && (
        <div className={`mb-6 p-4 rounded-xl border ${toast.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {toast.message}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Hero Section</h2>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className={inputBase}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Description</label>
            <textarea
              rows="3"
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className={`${inputBase} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Trust Points */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Trust Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trustPoints.map((tp, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Value</label>
                  <input
                    type="text"
                    value={tp.value}
                    onChange={(e) => handleTrustPointChange(idx, "value", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F4A623]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Label</label>
                  <input
                    type="text"
                    value={tp.label}
                    onChange={(e) => handleTrustPointChange(idx, "label", e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F4A623]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Services</h2>
          <button
            onClick={handleAddService}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all"
          >
            <FiPlus size={14} /> Add Service
          </button>
        </div>

        <div className="space-y-6">
          {services.map((service, index) => (
            <div key={service.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
              <button
                onClick={() => handleRemoveService(service.id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2"
                title="Remove Service"
              >
                <FiTrash2 size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 pr-10">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Service Name</label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(service.id, "name", e.target.value)}
                    className={inputBase}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1.5 block">Icon (FiHome, etc.)</label>
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => handleServiceChange(service.id, "icon", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1.5 block">Badge (Optional)</label>
                    <input
                      type="text"
                      value={service.badge}
                      onChange={(e) => handleServiceChange(service.id, "badge", e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">Description</label>
                <textarea
                  rows="2"
                  value={service.description}
                  onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                  className={`${inputBase} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Price (₦)</label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(service.id, "price", Number(e.target.value))}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Duration</label>
                  <input
                    type="text"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(service.id, "duration", e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Highlights (3 max recommended)</label>
                <div className="space-y-2">
                  {service.highlights.map((h, i) => (
                    <input
                      key={i}
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange(service.id, i, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F4A623]"
                      placeholder={`Highlight ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-medium">
              No services added yet. Click "Add Service" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultingSettings;
