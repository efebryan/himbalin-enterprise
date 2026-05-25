import React, { useState, useRef, useEffect } from "react";
import { FiX, FiUploadCloud, FiTrash2 } from "react-icons/fi";
import { RiCloseLine } from "react-icons/ri";

const CATEGORIES = ["Furniture", "Rugs", "Office", "Artificial Grass", "Other"];
const PRICE_UNITS = ["per piece", "per sqm", "per set", "per roll"];
const TAGS = ["New Arrival", "Best Seller", "Featured", "Sale"];

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  priceUnit: "per piece",
  stock: "",
  status: "In Stock",
  tags: [],
  images: [],
};

const AddProductDrawer = ({ isOpen, onClose, onSave, editProduct, categories = CATEGORIES }) => {
  const [form, setForm] = useState({ ...emptyForm });
  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const isEditMode = !!editProduct;

  // Pre-fill form when editing
  useEffect(() => {
    if (editProduct && isOpen) {
      const priceStr = String(editProduct.price || "");
      const rawPrice = priceStr.replace(/[₦,]/g, "").split("/")[0].trim();
      setForm({
        name: editProduct.name || "",
        category: editProduct.category || "",
        description: editProduct.description || "",
        price: rawPrice,
        priceUnit: editProduct.priceUnit || "per piece",
        stock: editProduct.stock?.toString() || "0",
        status: editProduct.status || "In Stock",
        tags: editProduct.tags || [],
        images: [],
      });
      if (editProduct.image) {
        setPreviewImages([{ url: editProduct.image, existing: true }]);
      }
    } else if (!isOpen) {
      setForm({ ...emptyForm });
      setPreviewImages([]);
      setErrors({});
    }
  }, [editProduct, isOpen]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleImageFiles = (files) => {
    const fileArray = Array.from(files);
    const remainingSlots = 4 - previewImages.length;
    const newFiles = fileArray.slice(0, remainingSlots);

    const newPreviews = newFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));

    if (errors.images) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.images;
        return copy;
      });
    }
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => {
      const copy = [...prev];
      if (!copy[index].existing) {
        URL.revokeObjectURL(copy[index].url);
      }
      copy.splice(index, 1);
      return copy;
    });
    setForm((prev) => {
      const copy = [...prev.images];
      copy.splice(index, 1);
      return { ...prev, images: copy };
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required.";
    if (!form.category) errs.category = "Select a category.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.price || Number(form.price) <= 0)
      errs.price = "Enter a valid price.";
    if (form.stock === "" || Number(form.stock) < 0)
      errs.stock = "Enter a valid stock quantity.";
    if (previewImages.length === 0)
      errs.images = "Upload at least 1 image.";
    return errs;
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft) {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
    }

    const productData = {
      id: isEditMode ? editProduct.id : `PRD-${Math.floor(100 + Math.random() * 900)}`,
      name: form.name || "Untitled Product",
      category: form.category || "Other",
      description: form.description || "",
      price: form.price ? `₦${Number(form.price).toLocaleString()}` : "₦0",
      priceUnit: form.priceUnit,
      stock: Number(form.stock) || 0,
      tags: form.tags,
      status: isDraft
        ? "Draft"
        : Number(form.stock) === 0
        ? "Out of Stock"
        : Number(form.stock) <= 10
        ? "Low Stock"
        : "In Stock",
      image:
        previewImages.length > 0
          ? previewImages[0].url
          : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=150",
      imageFile: previewImages.length > 0 ? previewImages[0].file : null,
    };

    onSave(productData, isDraft, isEditMode);

    // Reset
    previewImages.forEach((p) => {
      if (!p.existing) URL.revokeObjectURL(p.url);
    });
    setPreviewImages([]);
    setForm({ ...emptyForm });
    setErrors({});
  };

  const handleClose = () => {
    previewImages.forEach((p) => {
      if (!p.existing) URL.revokeObjectURL(p.url);
    });
    setPreviewImages([]);
    setForm({ ...emptyForm });
    setErrors({});
    onClose();
  };

  const inputBase =
    "w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium text-[#2B1A12] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A623]/30 focus:border-[#F4A623] transition-all";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-[70] transition-transform duration-300 ease-in-out
          w-full sm:w-[480px] bg-white border-l border-gray-200 shadow-2xl flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="bg-[#2B1A12] px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-serif font-bold text-white">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-[#F4A623] font-medium mt-0.5">
              {isEditMode ? `Editing: ${editProduct?.name}` : "Fill in the details below"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <RiCloseLine className="text-2xl" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* ── Image Upload Zone ── */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Product Images{" "}
              <span className="text-red-400">*</span>
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#F4A623] bg-[#F4A623]/5"
                  : errors.images
                  ? "border-red-300 bg-red-50/50"
                  : "border-gray-200 hover:border-[#F4A623]/50 hover:bg-gray-50"
              }`}
            >
              <FiUploadCloud className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-sm font-semibold text-gray-500">
                Drag & drop images or{" "}
                <span className="text-[#F4A623] underline">Browse</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                Up to 4 images · PNG, JPG
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageFiles(e.target.files)}
              />
            </div>
            {errors.images && (
              <p className="text-xs text-red-500 font-medium mt-1.5">
                {errors.images}
              </p>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previewImages.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={img.url}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <FiTrash2 className="text-white text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Section 1: Basic Info ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Basic Information
            </h3>

            {/* Product Name */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                Product Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Royal Leather Sofa Set"
                maxLength={80}
                className={`${inputBase} ${
                  errors.name ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`${inputBase} ${
                  errors.category ? "border-red-400" : "border-gray-200"
                } ${!form.category ? "text-gray-400" : ""}`}
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the product material, dimensions, and features..."
                maxLength={500}
                rows={4}
                className={`${inputBase} resize-none ${
                  errors.description ? "border-red-400" : "border-gray-200"
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-[10px] text-gray-400 font-medium">
                  {form.description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* ── Section 2: Pricing & Stock ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Pricing & Inventory
            </h3>

            {/* Price + Unit row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                  Price (₦) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#F4A623]">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0"
                    min="0"
                    className={`${inputBase} pl-8 ${
                      errors.price ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                  Unit
                </label>
                <select
                  value={form.priceUnit}
                  onChange={(e) => handleChange("priceUnit", e.target.value)}
                  className={`${inputBase} border-gray-200`}
                >
                  {PRICE_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">
                Stock Quantity <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                placeholder="0"
                min="0"
                className={`${inputBase} ${
                  errors.stock ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.stock && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* ── Section 3: Tags ── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const selected = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      selected
                        ? "bg-[#F4A623] text-[#2B1A12] border-[#F4A623] shadow-sm"
                        : "bg-white text-gray-500 border-gray-200 hover:border-[#F4A623]/50"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3 shrink-0 bg-white">
          {!isEditMode && (
            <button
              onClick={() => handleSubmit(true)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
          )}
          <button
            onClick={() => handleSubmit(false)}
            className="flex-1 px-4 py-2.5 bg-[#F4A623] hover:bg-[#e09520] text-[#2B1A12] rounded-lg text-sm font-bold shadow-md shadow-[#F4A623]/25 transition-all"
          >
            {isEditMode ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddProductDrawer;
