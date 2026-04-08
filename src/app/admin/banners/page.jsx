"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/AdminAuth";
import { getImageUrl } from "@/lib/cdn";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

const BANNER_POSITIONS = [
  { value: "HERO", label: "Hero Slider" },
  { value: "POPUP", label: "Popup" },
  { value: "SIDEBAR", label: "Sidebar" },
  { value: "BANNER_1", label: "Banner 1" },
  { value: "BANNER_2", label: "Banner 2" },
  { value: "BANNER_3", label: "Banner 3" },
];

export default function BannersPage() {
  const [mounted, setMounted] = useState(false);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    mobileImage: "",
    link: "",
    linkText: "",
    position: "HERO",
    isActive: true,
    sortOrder: 0,
    startsAt: "",
    expiresAt: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { admin, loading: authLoading, isAuthenticated, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBanners();
    }
  }, [isAuthenticated]);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFormLoading(true);

    try {
      const url = editingBanner
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";

      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sortOrder: parseInt(formData.sortOrder) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save banner");
      }

      setSuccess(editingBanner ? "Banner updated successfully!" : "Banner created successfully!");
      fetchBanners();
      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      mobileImage: banner.mobileImage || "",
      link: banner.link || "",
      linkText: banner.linkText || "",
      position: banner.position || "HERO",
      isActive: banner.isActive,
      sortOrder: banner.sortOrder || 0,
      startsAt: banner.startsAt ? banner.startsAt.split('T')[0] : "",
      expiresAt: banner.expiresAt ? banner.expiresAt.split('T')[0] : "",
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete banner");
      }

      fetchBanners();
    } catch (error) {
      alert(error.message);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      mobileImage: "",
      link: "",
      linkText: "",
      position: "HERO",
      isActive: true,
      sortOrder: 0,
      startsAt: "",
      expiresAt: "",
    });
    setError("");
    setSuccess("");
  };

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5a2a0f]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
          <p className="text-gray-500">Manage website banners and sliders</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-[#5a2a0f] text-white px-4 py-2 rounded-lg hover:bg-[#4a240c] transition"
        >
          <Plus size={20} />
          Add Banners
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image * (1920x600 recommended)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="banners/banner.jpg or URL"
                  />
                  <label className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg cursor-pointer hover:bg-[#3b1f0f] transition">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setFormData(prev => ({ ...prev, image: 'uploading...' }));
                        
                        try {
                          const formDataUpload = new FormData();
                          formDataUpload.append('file', file);
                          formDataUpload.append('folder', 'banners');
                          
                          const res = await fetch('/api/admin/upload', {
                            method: 'POST',
                            body: formDataUpload,
                          });
                          const data = await res.json();
                          
                          if (data.success) {
                            setFormData(prev => ({ ...prev, image: data.path }));
                          } else {
                            alert('Upload failed: ' + data.error);
                            setFormData(prev => ({ ...prev, image: '' }));
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Upload failed');
                          setFormData(prev => ({ ...prev, image: '' }));
                        }
                      }}
                    />
                  </label>
                </div>
                {formData.image && formData.image !== 'uploading...' && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={getImageUrl(formData.image)} 
                      alt="Preview" 
                      className="w-full h-40 object-cover rounded-lg border"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              {/* Mobile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Image (optional) (600x400 recommended)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="mobileImage"
                    value={formData.mobileImage}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="banners/banner-mobile.jpg or URL"
                  />
                  <label className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg cursor-pointer hover:bg-[#3b1f0f] transition">
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        setFormData(prev => ({ ...prev, mobileImage: 'uploading...' }));
                        
                        try {
                          const formDataUpload = new FormData();
                          formDataUpload.append('file', file);
                          formDataUpload.append('folder', 'banners');
                          
                          const res = await fetch('/api/admin/upload', {
                            method: 'POST',
                            body: formDataUpload,
                          });
                          const data = await res.json();
                          
                          if (data.success) {
                            setFormData(prev => ({ ...prev, mobileImage: data.path }));
                          } else {
                            alert('Upload failed: ' + data.error);
                            setFormData(prev => ({ ...prev, mobileImage: '' }));
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Upload failed');
                          setFormData(prev => ({ ...prev, mobileImage: '' }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="Enter banner title"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="Enter subtitle"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                >
                  {BANNER_POSITIONS.map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Link */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL
                  </label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="/products or https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Text
                  </label>
                  <input
                    type="text"
                    name="linkText"
                    value={formData.linkText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="Shop Now"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startsAt"
                    value={formData.startsAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#5a2a0f] border-gray-300 rounded focus:ring-[#5a2a0f]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-[#5a2a0f] text-white rounded-lg hover:bg-[#4a240c] transition disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : editingBanner ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5a2a0f] mx-auto"></div>
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            No banners found. Click "Add Banner" to create one.
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                {banner.image ? (
                  <img
                    src={getImageUrl(banner.image)}
                    alt={banner.title || "Banner"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      banner.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {banner.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {banner.title || "Untitled Banner"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {BANNER_POSITIONS.find(p => p.value === banner.position)?.label || banner.position}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">#{banner.sortOrder}</span>
                </div>
                {banner.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{banner.subtitle}</p>
                )}
                {banner.link && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 mb-3">
                    <ExternalLink size={12} />
                    <span className="truncate">{banner.link}</span>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
