"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/AdminAuth";
import { getImageUrl } from "@/lib/cdn";
import { Package } from "lucide-react";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Search,
  Filter,
  Eye,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: "",
    oldPrice: "",
    discount: "",
    mrp: "",
    sku: "",
    stockQuantity: 0,
    lowStockAlert: 10,
    isInStock: true,
    skinType: "",
    concern: "",
    ingredient: "",
    howToUse: "",
    resultClaim: "",
    badges: "",
    thumbnail: "",
    videoUrl: "",
    beforeImage: "",
    afterImage: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true,
    isFeatured: false,
    productType: "SINGLE",
    categoryIds: [],
    images: [],
    variants: [],
  });

  const [variantInput, setVariantInput] = useState({
    name: "",
    sku: "",
    price: "",
    oldPrice: "",
    discount: "",
    stockQuantity: 0,
    image: "",
    isActive: true,
  });

  const [imageInput, setImageInput] = useState({
    url: "",
    altText: "",
    isPrimary: false,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated, pagination.page, searchTerm, filterCategory, filterStatus]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", pagination.page);
      params.append("limit", pagination.limit);
      if (searchTerm) params.append("search", searchTerm);
      if (filterCategory) params.append("categoryId", filterCategory);
      if (filterStatus === "active") params.append("isActive", "true");
      if (filterStatus === "inactive") params.append("isActive", "false");

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      if (data.pagination) setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from title if title changes and slug is empty or was auto-generated
    if (name === 'title' && (!formData.slug || formData.slug === formData.title?.toLowerCase().replace(/\s+/g, '-'))) {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Handle image upload
  const handleImageUpload = async (e, fieldName = 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show loading state
    setFormData(prev => ({ ...prev, [fieldName]: 'uploading...' }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'product-image');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, [fieldName]: data.path }));
      } else {
        alert('Upload failed: ' + data.error);
        setFormData(prev => ({ ...prev, [fieldName]: '' }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const categoryIds = value ? [parseInt(value)] : [];
      return { ...prev, categoryIds };
    });
  };

  const handleAddVariant = () => {
    if (!variantInput.name || !variantInput.price) return;
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...variantInput, price: parseFloat(variantInput.price) }],
    }));
    setVariantInput({
      name: "",
      sku: "",
      price: "",
      oldPrice: "",
      discount: "",
      stockQuantity: 0,
      image: "",
      isActive: true,
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = () => {
    if (!imageInput.url) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { ...imageInput }],
    }));
    setImageInput({ url: "", altText: "", isPrimary: false });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    setFormLoading(true);

    // Client-side validation
    const errors = {};
    if (!formData.title?.trim()) {
      errors.title = "Product title is required";
    }
    if (!formData.slug?.trim()) {
      errors.slug = "Product slug is required";
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }
    if (formData.sku && formData.sku.trim()) {
      // Check for duplicate SKU pattern in existing products would require API call
      // For now, just validate format
      const skuRegex = /^[A-Za-z0-9-_]+$/;
      if (!skuRegex.test(formData.sku.trim())) {
        errors.sku = "SKU can only contain letters, numbers, hyphens and underscores";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    try {
      // Process badges as array
      const badgesArray = formData.badges
        ? formData.badges.split(",").map((b) => b.trim()).filter(Boolean)
        : [];

      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        mrp: formData.mrp ? parseFloat(formData.mrp) : null,
        discount: formData.discount ? parseInt(formData.discount) : null,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        lowStockAlert: parseInt(formData.lowStockAlert) || 10,
        badges: badgesArray,
        variants: formData.variants?.map(v => ({
          ...v,
          price: parseFloat(v.price) || 0,
          oldPrice: v.oldPrice ? parseFloat(v.oldPrice) : null,
          discount: v.discount ? parseInt(v.discount) : null,
          stockQuantity: parseInt(v.stockQuantity) || 0,
        })),
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle field-specific errors from API
        if (data.errors && typeof data.errors === 'object') {
          setFieldErrors(data.errors);
          setError(data.error || "Please fix the errors below");
        } else {
          setError(data.error || `Failed to save product (${res.status})`);
        }
        throw new Error(data.error || `Failed to save product (${res.status})`);
      }

      setSuccess(editingProduct ? "Product updated successfully!" : "Product created successfully!");
      fetchProducts();
      resetForm();
    } catch (error) {
      // Error is already set above
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`);
      const data = await res.json();

      // Parse badges from string to array
      let badgesArray = [];
      if (data.badges) {
        try {
          badgesArray = JSON.parse(data.badges);
        } catch {
          badgesArray = data.badges.split(",").map((b) => b.trim());
        }
      }

      setEditingProduct(data);
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        description: data.description || "",
        shortDescription: data.shortDescription || "",
        price: data.price?.toString() || "",
        oldPrice: data.oldPrice?.toString() || "",
        discount: data.discount?.toString() || "",
        mrp: data.mrp?.toString() || "",
        sku: data.sku || "",
        stockQuantity: data.stockQuantity || 0,
        lowStockAlert: data.lowStockAlert || 10,
        isInStock: data.isInStock ?? true,
        skinType: data.skinType || "",
        concern: data.concern || "",
        ingredient: data.ingredient || "",
        howToUse: data.howToUse || "",
        resultClaim: data.resultClaim || "",
        badges: badgesArray.join(", "),
        thumbnail: data.thumbnail || "",
        videoUrl: data.videoUrl || "",
        beforeImage: data.beforeImage || "",
        afterImage: data.afterImage || "",
        metaTitle: data.metaTitle || "",
        metaDescription: data.metaDescription || "",
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        productType: data.productType || "SINGLE",
        categoryIds: data.categories?.map((c) => c.categoryId) || [],
        images: data.images?.map((img) => ({
          url: img.url,
          altText: img.altText || "",
          isPrimary: img.isPrimary,
        })) || [],
        variants: data.variants?.map((v) => ({
          name: v.name,
          sku: v.sku || "",
          price: v.price?.toString() || "",
          oldPrice: v.oldPrice?.toString() || "",
          discount: v.discount?.toString() || "",
          stockQuantity: v.stockQuantity || 0,
          image: v.image || "",
          isActive: v.isActive ?? true,
        })) || [],
      });
      setShowForm(true);
      setError("");
      setSuccess("");
      setFieldErrors({});
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to load product details");
    }
  };

  const handleView = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`);
      const data = await res.json();
      setViewProduct(data);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      fetchProducts();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      price: "",
      oldPrice: "",
      discount: "",
      mrp: "",
      sku: "",
      stockQuantity: 0,
      lowStockAlert: 10,
      isInStock: true,
      skinType: "",
      concern: "",
      ingredient: "",
      howToUse: "",
      resultClaim: "",
      badges: "",
      thumbnail: "",
      videoUrl: "",
      beforeImage: "",
      afterImage: "",
      metaTitle: "",
      metaDescription: "",
      isActive: true,
      isFeatured: false,
      productType: "SINGLE",
      categoryIds: [],
      images: [],
      variants: [],
    });
    setError("");
    setSuccess("");
    setFieldErrors({});
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
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="text-gray-500">Manage your product catalog</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-[#5a2a0f] text-white px-4 py-2 rounded-lg hover:bg-[#4a240c] transition"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && !showForm && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          {error && !showForm && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5a2a0f] mx-auto"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No products found. Click "Add Product" to create one.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.thumbnail ? (
                              <img
                                src={getImageUrl(product.thumbnail)}
                                alt={product.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-[#5a2a0f]/10 rounded-lg flex items-center justify-center">
                                <Package className="text-[#5a2a0f]" size={20} />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 line-clamp-1">{product.title}</p>
                              <p className="text-sm text-gray-500">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{product.sku || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-medium text-gray-800">৳{parseFloat(product.price).toFixed(2)}</span>
                            {product.oldPrice && product.oldPrice > product.price && (
                              <span className="ml-2 text-sm text-gray-400 line-through">
                                ৳{parseFloat(product.oldPrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm ${product.stockQuantity <= product.lowStockAlert ? "text-red-600" : "text-gray-600"}`}>
                            {product.stockQuantity} {product.stockQuantity <= product.lowStockAlert && "(Low)"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={`flex items-center gap-1 text-sm ${product.isActive ? "text-green-600" : "text-gray-400"}`}
                          >
                            {product.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                            {product.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(product)}
                              className="p-2 text-gray-600 hover:text-[#5a2a0f] hover:bg-[#5a2a0f]/10 rounded-lg transition"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-gray-600 hover:text-[#5a2a0f] hover:bg-[#5a2a0f]/10 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Error/Success Messages in Modal */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <X className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium text-red-700">Error</p>
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                      {Object.keys(fieldErrors).length > 0 && Object.keys(fieldErrors).filter(k => k !== 'title' && k !== 'slug' && k !== 'price').length > 0 && (
                        <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
                          {Object.entries(fieldErrors).map(([key, value]) => (
                            key !== 'title' && key !== 'slug' && key !== 'price' && (
                              <li key={key}>{key}: {value}</li>
                            )
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="text-green-500 flex-shrink-0" size={18} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-700">{success}</p>
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent ${fieldErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="Enter product title"
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <X size={14} /> {fieldErrors.title}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent ${fieldErrors.slug ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="product-slug"
                  />
                  {fieldErrors.slug && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <X size={14} /> {fieldErrors.slug}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="Brief product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="Full product description"
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent ${fieldErrors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="0.00"
                  />
                  {fieldErrors.price && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <X size={14} /> {fieldErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Old Price
                  </label>
                  <input
                    type="number"
                    name="oldPrice"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MRP
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    step="0.01"
                    value={formData.mrp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Stock & SKU */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent ${fieldErrors.sku ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    placeholder="SKU-001"
                  />
                  {fieldErrors.sku && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <X size={14} /> {fieldErrors.sku}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    name="lowStockAlert"
                    value={formData.lowStockAlert}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  >
                    <option value="SINGLE">Single</option>
                    <option value="COMBO">Combo</option>
                    <option value="PACK">Pack</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.categoryIds[0] || ""}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skin Type
                  </label>
                  <input
                    type="text"
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="e.g., All Skin Types"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concern
                  </label>
                  <input
                    type="text"
                    name="concern"
                    value={formData.concern}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="e.g., Stretch Marks"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredients
                </label>
                <textarea
                  name="ingredient"
                  value={formData.ingredient}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="List key ingredients"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How to Use
                </label>
                <textarea
                  name="howToUse"
                  value={formData.howToUse}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="Usage instructions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Result Claim
                </label>
                <input
                  type="text"
                  name="resultClaim"
                  value={formData.resultClaim}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="e.g., Visible Reduction in 21 Days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badges (comma separated)
                </label>
                <input
                  type="text"
                  name="badges"
                  value={formData.badges}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="Dermatologically Tested, SLS Free"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                      placeholder="products/image.webp or URL"
                    />
                    <label className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg cursor-pointer hover:bg-[#3b1f0f] transition">
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'thumbnail')}
                      />
                    </label>
                  </div>
                  {/* Image Preview */}
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <img 
                        src={getImageUrl(formData.thumbnail)} 
                        alt="Thumbnail Preview" 
                        className="w-24 h-24 object-cover rounded-lg border"
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              {/* Additional Images */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Additional Images (Gallery)</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Image URL or Upload"
                    value={imageInput.url}
                    onChange={(e) => setImageInput((prev) => ({ ...prev, url: e.target.value }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                  <label className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg cursor-pointer hover:bg-[#3b1f0f] transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('folder', 'product-image');
                        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.success) {
                          setImageInput(prev => ({ ...prev, url: data.path }));
                        }
                      }}
                    />
                    Upload
                  </label>
                  <input
                    type="text"
                    placeholder="Alt Text"
                    value={imageInput.altText}
                    onChange={(e) => setImageInput((prev) => ({ ...prev, altText: e.target.value }))}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg hover:bg-[#4a240c]"
                  >
                    Add
                  </button>
                </div>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={getImageUrl(img.url)} alt={img.altText} className="w-20 h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Product Variants (Packs/Sizes)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Variant Name (e.g., Single Pack)"
                    value={variantInput.name}
                    onChange={(e) => setVariantInput((prev) => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={variantInput.sku}
                    onChange={(e) => setVariantInput((prev) => ({ ...prev, sku: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={variantInput.price}
                    onChange={(e) => setVariantInput((prev) => ({ ...prev, price: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variantInput.stockQuantity}
                    onChange={(e) => setVariantInput((prev) => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="col-span-2 md:col-span-4 px-4 py-2 bg-[#5a2a0f] text-white rounded-lg hover:bg-[#4a240c]"
                  >
                    Add Variant
                  </button>
                </div>
                {formData.variants.length > 0 && (
                  <div className="space-y-2">
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{variant.name} - ৳{variant.price} (Stock: {variant.stockQuantity})</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Before/After Images */}
              {/* Before/After Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Before Image (Results)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="beforeImage"
                      value={formData.beforeImage}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                      placeholder="Before results image URL"
                    />
                    <label className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg cursor-pointer hover:bg-[#3b1f0f] transition">
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const f = new FormData();
                        f.append('file', file);
                        f.append('folder', 'product-image');
                        const res = await fetch('/api/admin/upload', { method: 'POST', body: f });
                        const data = await res.json();
                        if (data.success) setFormData(p => ({ ...p, beforeImage: data.path }));
                      }} />
                      Upload
                    </label>
                  </div>
                  {formData.beforeImage && (
                    <img src={getImageUrl(formData.beforeImage)} alt="Before" className="mt-2 w-24 h-24 object-cover rounded" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    After Image (Results)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="afterImage"
                      value={formData.afterImage}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                      placeholder="After results image URL"
                    />
                    <label className="px-4 py-2 bg-[#5a2a0f] text-white rounded-lg cursor-pointer hover:bg-[#3b1f0f] transition">
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const f = new FormData();
                        f.append('file', file);
                        f.append('folder', 'product-image');
                        const res = await fetch('/api/admin/upload', { method: 'POST', body: f });
                        const data = await res.json();
                        if (data.success) setFormData(p => ({ ...p, afterImage: data.path }));
                      }} />
                      Upload
                    </label>
                  </div>
                  {formData.afterImage && (
                    <img src={getImageUrl(formData.afterImage)} alt="After" className="mt-2 w-24 h-24 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* SEO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="SEO title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a2a0f] focus:border-transparent"
                  placeholder="SEO description"
                />
              </div>

              {/* Status */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#5a2a0f] border-gray-300 rounded focus:ring-[#5a2a0f]"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#5a2a0f] border-gray-300 rounded focus:ring-[#5a2a0f]"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>

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
                  {formLoading ? "Saving..." : editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
              <button onClick={() => { setShowViewModal(false); setViewProduct(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                {viewProduct.thumbnail && (
                  <img src={getImageUrl(viewProduct.thumbnail)} alt={viewProduct.title} className="w-32 h-32 object-cover rounded-lg" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{viewProduct.title}</h3>
                  <p className="text-gray-500">{viewProduct.slug}</p>
                  <p className="text-sm text-gray-600 mt-1">SKU: {viewProduct.sku || "N/A"}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">৳{parseFloat(viewProduct.price).toFixed(2)}</p>
                </div>
                {viewProduct.oldPrice && (
                  <div>
                    <p className="text-sm text-gray-500">Old Price</p>
                    <p className="font-medium line-through text-gray-400">৳{parseFloat(viewProduct.oldPrice).toFixed(2)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-medium">{viewProduct.stockQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 rounded text-xs ${viewProduct.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {viewProduct.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {viewProduct.shortDescription && (
                <div>
                  <p className="text-sm text-gray-500">Short Description</p>
                  <p>{viewProduct.shortDescription}</p>
                </div>
              )}

              {viewProduct.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="whitespace-pre-wrap">{viewProduct.description}</p>
                </div>
              )}

              {viewProduct.categories?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <div className="flex gap-2 mt-1">
                    {viewProduct.categories.map((c) => (
                      <span key={c.categoryId} className="px-2 py-1 bg-[#5a2a0f]/10 text-[#5a2a0f] rounded text-sm">
                        {c.category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {viewProduct.images?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Gallery</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {viewProduct.images.map((img, i) => (
                      <img key={i} src={getImageUrl(img.url)} alt={img.altText || ""} className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                </div>
              )}

              {viewProduct.variants?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Variants</p>
                  <div className="space-y-1 mt-1">
                    {viewProduct.variants.map((v, i) => (
                      <p key={i} className="text-sm">{v.name} - ৳{parseFloat(v.price).toFixed(2)} (Stock: {v.stockQuantity})</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewProduct(null);
                    handleEdit(viewProduct);
                  }}
                  className="flex-1 px-4 py-2 bg-[#5a2a0f] text-white rounded-lg hover:bg-[#4a240c]"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
