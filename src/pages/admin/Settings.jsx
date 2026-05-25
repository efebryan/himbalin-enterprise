import React, { useState, useEffect } from "react";
import {
  FiUser, FiLock, FiMail, FiBell, FiGlobe, FiShield,
  FiSave, FiCamera, FiEye, FiEyeOff, FiCheck, FiList, FiPlus, FiEdit2, FiTrash2, FiX
} from "react-icons/fi";
import Toast from "../../components/admin/products/Toast";
import { 
  getSiteSettings, 
  updateSiteSettings, 
  uploadBrandAsset, 
  updateAdminProfile,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from "../../lib/api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useSiteSettings } from "../../context/SiteSettingsContext";

const TABS = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "security", label: "Security", icon: FiLock },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "store", label: "Store", icon: FiGlobe },
  { id: "categories", label: "Categories", icon: FiList },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState(null);

  // Categories States
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  
  const { admin, updateLocalAdmin } = useAdminAuth();

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await getCategories();
      setCategoriesList(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      showToast("Failed to load categories", "draft");
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "categories") {
      loadCategories();
    }
  }, [activeTab]);
  const { fetchSettings } = useSiteSettings();

  // ── Profile State ──
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    bio: "",
  });

  // ── Security State ──
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFactor, setTwoFactor] = useState(false);

  // ── Notification State ──
  const [notifications, setNotifications] = useState({
    emailNewOrder: true,
    emailLowStock: true,
    emailCustomerSignup: false,
    emailWeeklyReport: true,
    pushNewOrder: true,
    pushLowStock: false,
    pushCustomerSignup: false,
    pushWeeklyReport: false,
  });

  // ── Store State ──
  const [store, setStore] = useState({
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    currency: "NGN (₦)",
    taxRate: "0",
    minOrderAmount: "50000",
    freeShippingThreshold: "500000",
    storeLogo: "",
    faviconUrl: "",
  });

  // ── Load settings from Supabase on mount ──
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSettingsId(data.id);
          setProfile({
            firstName: data.admin_first_name || "",
            lastName: data.admin_last_name || "",
            email: data.admin_email || "",
            phone: data.admin_phone || "",
            role: data.admin_role || "",
            bio: data.admin_bio || "",
          });
          setStore({
            storeName: data.store_name || "",
            storeEmail: data.store_email || "",
            storePhone: data.store_phone || "",
            storeAddress: data.store_address || "",
            currency: data.currency || "NGN (₦)",
            taxRate: "0",
            minOrderAmount: String(data.min_order_amount || "50000"),
            freeShippingThreshold: String(data.free_shipping_threshold || "500000"),
            storeLogo: data.store_logo || "",
            faviconUrl: data.favicon_url || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // ── Upload Handlers ──
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !admin?.id) return;
    showToast("Uploading photo...", "success");
    try {
      const publicUrl = await uploadBrandAsset(file);
      await updateAdminProfile(admin.id, { avatar_url: publicUrl });
      updateLocalAdmin({ avatar_url: publicUrl });
      showToast("Profile photo updated!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      showToast(`Failed to upload photo: ${err.message || err}`, "error");
    }
  };

  const handleStoreAssetUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast(`Uploading image...`, "success");
    try {
      const publicUrl = await uploadBrandAsset(file);
      setStore((prev) => ({ ...prev, [type]: publicUrl }));
      showToast(`Image uploaded! Don't forget to save.`, "success");
    } catch (err) {
      console.error("Store asset upload error:", err);
      showToast(`Failed to upload image: ${err.message || err}`, "error");
    }
  };

  // ── Save profile to Supabase ──
  const saveProfile = async () => {
    if (!settingsId) return;
    setSaving(true);
    try {
      await updateSiteSettings(settingsId, {
        admin_first_name: profile.firstName,
        admin_last_name: profile.lastName,
        admin_email: profile.email,
        admin_phone: profile.phone,
        admin_role: profile.role,
        admin_bio: profile.bio,
      });
      showToast("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showToast("Failed to save profile.", "draft");
    } finally {
      setSaving(false);
    }
  };

  // ── Save store settings to Supabase ──
  const saveStore = async () => {
    if (!settingsId) return;
    setSaving(true);
    try {
      await updateSiteSettings(settingsId, {
        store_name: store.storeName,
        store_email: store.storeEmail,
        store_phone: store.storePhone,
        store_address: store.storeAddress,
        currency: store.currency,
        tax_rate: 0,
        min_order_amount: parseFloat(store.minOrderAmount) || 50000,
        free_shipping_threshold: parseFloat(store.freeShippingThreshold) || 500000,
        store_logo: store.storeLogo,
        favicon_url: store.faviconUrl,
      });
      // Refresh the global SiteSettingsContext so the logo propagates sitewide
      await fetchSettings();
      showToast("Store settings saved!");
    } catch (err) {
      console.error("Failed to save store settings:", err);
      showToast("Failed to save store settings.", "draft");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
  };

  const inputBase =
    "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#2B1A12] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/30 focus:border-[#F4A623] transition-all";

  // ── Toggle Component ──
  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        enabled ? "bg-[#F4A623]" : "bg-gray-200"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#F4A623] border-t-transparent"></div>
      </div>
    );
  }

  // ──────────────────────────────────────────
  // Tab: Profile
  // ──────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative group">
          <img
            src={admin?.avatar_url || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-[#F4A623]/20 object-cover"
          />
          <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <FiCamera className="text-white text-lg" />
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#2B1A12]">{profile.firstName} {profile.lastName}</h3>
          <p className="text-sm text-[#F4A623] font-semibold">{profile.role}</p>
          <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className={inputBase}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className={inputBase}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Email Address</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className={inputBase}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Phone Number</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className={inputBase}
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          maxLength={300}
          rows={3}
          className={`${inputBase} resize-none`}
        />
        <p className="text-[10px] text-gray-400 mt-1 text-right">{profile.bio.length}/300</p>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] rounded-lg text-sm font-bold shadow-md shadow-[#F4A623]/25 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <FiSave className="text-sm" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  // ──────────────────────────────────────────
  // Tab: Security
  // ──────────────────────────────────────────
  const renderSecurity = () => (
    <div className="space-y-8">
      {/* Change Password */}
      <div>
        <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
          <FiLock className="text-[#F4A623]" /> Change Password
        </h3>
        <div className="space-y-4 max-w-md">
          {[
            { key: "current", label: "Current Password", field: "currentPassword" },
            { key: "new", label: "New Password", field: "newPassword" },
            { key: "confirm", label: "Confirm New Password", field: "confirmPassword" },
          ].map(({ key, label, field }) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">{label}</label>
              <div className="relative">
                <input
                  type={showPasswords[key] ? "text" : "password"}
                  value={security[field]}
                  onChange={(e) => setSecurity({ ...security, [field]: e.target.value })}
                  placeholder="••••••••"
                  className={`${inputBase} pr-10`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords[key] ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-start mt-5">
          <button
            onClick={() => {
              if (!security.currentPassword || !security.newPassword) {
                showToast("Please fill all password fields.", "draft");
                return;
              }
              if (security.newPassword !== security.confirmPassword) {
                showToast("Passwords do not match.", "draft");
                return;
              }
              setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
              showToast("Password changed successfully!");
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2B1A12] hover:bg-[#3d2518] text-white rounded-lg text-sm font-bold transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Two-Factor Auth */}
      <div>
        <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
          <FiShield className="text-[#F4A623]" /> Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-5 border border-gray-100 max-w-md">
          <div>
            <p className="text-sm font-bold text-[#2B1A12]">
              {twoFactor ? "2FA is enabled" : "2FA is disabled"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Toggle enabled={twoFactor} onChange={(v) => {
            setTwoFactor(v);
            showToast(v ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
          }} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Active Sessions */}
      <div>
        <h3 className="text-sm font-bold text-[#2B1A12] mb-4">Active Sessions</h3>
        <div className="space-y-3 max-w-lg">
          {[
            { device: "Chrome · Windows", location: "Lagos, Nigeria", current: true, time: "Active now" },
            { device: "Safari · iPhone", location: "Lagos, Nigeria", current: false, time: "2 hours ago" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div>
                <p className="text-sm font-bold text-[#2B1A12] flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {session.location} · {session.time}
                </p>
              </div>
              {!session.current && (
                <button
                  onClick={() => showToast("Session revoked.")}
                  className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ──────────────────────────────────────────
  // Tab: Notifications
  // ──────────────────────────────────────────
  const renderNotifications = () => {
    const sections = [
      {
        title: "Email Notifications",
        icon: FiMail,
        items: [
          { key: "emailNewOrder", label: "New Order", desc: "Get notified when a new order is placed." },
          { key: "emailLowStock", label: "Low Stock Alert", desc: "Receive alerts for low inventory items." },
          { key: "emailCustomerSignup", label: "New Customer Signup", desc: "Get notified when a customer signs up." },
          { key: "emailWeeklyReport", label: "Weekly Report", desc: "Receive a summary report every Monday." },
        ],
      },
      {
        title: "Push Notifications",
        icon: FiBell,
        items: [
          { key: "pushNewOrder", label: "New Order", desc: "In-app notification for new orders." },
          { key: "pushLowStock", label: "Low Stock Alert", desc: "In-app alert for low stock items." },
          { key: "pushCustomerSignup", label: "New Customer Signup", desc: "In-app alert for signups." },
          { key: "pushWeeklyReport", label: "Weekly Report", desc: "In-app weekly summary." },
        ],
      },
    ];

    return (
      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
              <section.icon className="text-[#F4A623]" /> {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-[#2B1A12]">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle
                    enabled={notifications[item.key]}
                    onChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={() => showToast("Notification preferences saved!")}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] rounded-lg text-sm font-bold shadow-md shadow-[#F4A623]/25 transition-all"
          >
            <FiSave className="text-sm" /> Save Preferences
          </button>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────
  // Tab: Store
  // ──────────────────────────────────────────
  const renderStore = () => (
    <div className="space-y-8">
      {/* Store Info */}
      <div>
        <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
          <FiGlobe className="text-[#F4A623]" /> Store Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Store Name</label>
            <input
              type="text"
              value={store.storeName}
              onChange={(e) => setStore({ ...store, storeName: e.target.value })}
              className={inputBase}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Store Email</label>
            <input
              type="email"
              value={store.storeEmail}
              onChange={(e) => setStore({ ...store, storeEmail: e.target.value })}
              className={inputBase}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Store Phone</label>
            <input
              type="text"
              value={store.storePhone}
              onChange={(e) => setStore({ ...store, storePhone: e.target.value })}
              className={inputBase}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Currency</label>
            <select
              value={store.currency}
              onChange={(e) => setStore({ ...store, currency: e.target.value })}
              className={inputBase}
            >
              <option>NGN (₦)</option>
              <option>USD ($)</option>
              <option>GBP (£)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="mt-5">
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Store Address</label>
          <textarea
            value={store.storeAddress}
            onChange={(e) => setStore({ ...store, storeAddress: e.target.value })}
            rows={2}
            className={`${inputBase} resize-none`}
          />
        </div>

        {/* Brand Assets */}
        <div className="mt-8">
          <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
            <FiCamera className="text-[#F4A623]" /> Brand Assets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Store Logo</label>
              <div className="flex items-center gap-4">
                {store.storeLogo ? (
                  <img src={store.storeLogo} alt="Logo" className="h-12 w-auto object-contain bg-gray-50 rounded border border-gray-100 p-1" />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">None</div>
                )}
                <label className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                  Upload Logo
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleStoreAssetUpload(e, 'storeLogo')} />
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Favicon</label>
              <div className="flex items-center gap-4">
                {store.faviconUrl ? (
                  <img src={store.faviconUrl} alt="Favicon" className="h-12 w-12 object-contain bg-gray-50 rounded border border-gray-100 p-1" />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">None</div>
                )}
                <label className="cursor-pointer px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
                  Upload Favicon
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleStoreAssetUpload(e, 'faviconUrl')} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Financial Settings */}
      <div>
        <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
          <FiShield className="text-[#F4A623]" /> Financial Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Min Order Amount (₦)</label>
            <input
              type="number"
              value={store.minOrderAmount}
              onChange={(e) => setStore({ ...store, minOrderAmount: e.target.value })}
              className={inputBase}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1.5 block">Free Shipping Above (₦)</label>
            <input
              type="number"
              value={store.freeShippingThreshold}
              onChange={(e) => setStore({ ...store, freeShippingThreshold: e.target.value })}
              className={inputBase}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={saveStore}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] rounded-lg text-sm font-bold shadow-md shadow-[#F4A623]/25 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <FiSave className="text-sm" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );

  const renderCategories = () => {
    const handleAdd = async (e) => {
      e.preventDefault();
      if (!newCatName.trim()) return;
      setSaving(true);
      try {
        await addCategory(newCatName.trim());
        setNewCatName("");
        showToast("Category added successfully!");
        loadCategories();
      } catch (err) {
        console.error("Failed to add category:", err);
        showToast(err.message || "Failed to add category", "draft");
      } finally {
        setSaving(false);
      }
    };

    const handleStartEdit = (cat) => {
      setEditCatId(cat.id);
      setEditCatName(cat.name);
    };

    const handleCancelEdit = () => {
      setEditCatId(null);
      setEditCatName("");
    };

    const handleSaveEdit = async (cat) => {
      if (!editCatName.trim()) return;
      if (editCatName.trim() === cat.name) {
        setEditCatId(null);
        return;
      }
      setSaving(true);
      try {
        await updateCategory(cat.id, cat.name, editCatName.trim());
        showToast("Category updated successfully!");
        setEditCatId(null);
        setEditCatName("");
        loadCategories();
      } catch (err) {
        console.error("Failed to update category:", err);
        showToast(err.message || "Failed to update category", "draft");
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = async (cat) => {
      if (window.confirm(`Are you sure you want to delete "${cat.name}"? Products using this category will be changed to "Other".`)) {
        setSaving(true);
        try {
          await deleteCategory(cat.id, cat.name);
          showToast("Category deleted successfully!");
          loadCategories();
        } catch (err) {
          console.error("Failed to delete category:", err);
          showToast(err.message || "Failed to delete category", "draft");
        } finally {
          setSaving(false);
        }
      }
    };

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-bold text-[#2B1A12] mb-4 flex items-center gap-2">
            <FiList className="text-[#F4A623]" /> Product Categories
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Add, update, or remove product categories. Changes are immediately cascaded to all products.
          </p>

          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="flex gap-3 max-w-md mb-8">
            <input
              type="text"
              placeholder="e.g. Lighting, Cushions"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className={inputBase}
              disabled={saving}
            />
            <button
              type="submit"
              disabled={saving || !newCatName.trim()}
              className={`flex items-center gap-1 px-5 py-2.5 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] rounded-lg text-sm font-bold shadow-md shadow-[#F4A623]/25 transition-all ${
                saving || !newCatName.trim() ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FiPlus /> Add
            </button>
          </form>

          {/* Categories List */}
          <div className="max-w-xl border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
            {categoriesLoading ? (
              <div className="p-8 text-center text-sm font-medium text-gray-500">
                Loading categories...
              </div>
            ) : categoriesList.length === 0 ? (
              <div className="p-8 text-center text-sm font-medium text-gray-500">
                No categories found. Add one above.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 bg-white">
                {categoriesList.map((cat) => {
                  const isEditing = editCatId === cat.id;
                  return (
                    <div key={cat.id} className="flex items-center justify-between p-4 group transition-colors hover:bg-gray-50">
                      {isEditing ? (
                        <div className="flex-1 flex gap-2 mr-4">
                          <input
                            type="text"
                            value={editCatName}
                            onChange={(e) => setEditCatName(e.target.value)}
                            className={`${inputBase} py-1.5`}
                            autoFocus
                            disabled={saving}
                          />
                          <button
                            onClick={() => handleSaveEdit(cat)}
                            disabled={saving || !editCatName.trim()}
                            title="Save Changes"
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FiCheck className="text-base" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={saving}
                            title="Cancel"
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <FiX className="text-base" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-semibold text-[#2B1A12]">{cat.name}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEdit(cat)}
                              title="Rename Category"
                              className="p-2 text-gray-400 hover:text-[#F4A623] hover:bg-[#F4A623]/10 rounded-lg transition-all"
                            >
                              <FiEdit2 className="text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat)}
                              title="Delete Category"
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ──────────────────────────────────────────
  // Render active tab
  // ──────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile": return renderProfile();
      case "security": return renderSecurity();
      case "notifications": return renderNotifications();
      case "store": return renderStore();
      case "categories": return renderCategories();
      default: return renderProfile();
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2B1A12] mb-1">
          Settings
        </h1>
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          Manage your account, security, and store preferences.
        </p>
      </div>

      {/* Tab Navigation + Content */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-8">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-4 md:px-6">
          <div className="flex overflow-x-auto hide-scrollbar -mb-px">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-5 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                    active
                      ? "border-[#F4A623] text-[#2B1A12]"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <tab.icon className={`text-base ${active ? "text-[#F4A623]" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 md:p-8">
          {renderTabContent()}
        </div>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default Settings;
