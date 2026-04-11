"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Truck,
  X,
  MapPin,
  Percent,
  Phone,
  Users,
  Shield,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const { cartCount, openCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearchLoading(true);
        try {
          const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
          const data = await res.json();
          setSearchResults(data.products || []);
          setShowResults(true);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default menu items when API fails or returns empty
  const defaultMenuItems = [
    { icon: <MapPin size={18} />, name: "Track My Order" },
    { name: "Handmade Soaps", slug: "handmade-soaps" },
    { name: "New Launches", slug: "new-launches" },
    { name: "Mom Care", slug: "mom-care" },
    { name: "Skincare", slug: "skincare" },
    { icon: <Percent size={18} />, name: "80% OFF DEALS" },
    { name: "Blogs" },
    { icon: <Phone size={18} />, name: "Contact Us" },
    { icon: <Users size={18} />, name: "About Us" },
    { icon: <User size={18} />, name: "Login/Signup" },
    { icon: <Shield size={18} />, name: "Admin Panel", href: "/admin/login" },
  ];

  // Build menu items from API categories or fallback
  const menuItems = categories.length > 0
    ? categories.map(cat => ({ name: cat.name, slug: cat.slug }))
    : defaultMenuItems;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className={`border-b border-gray-200 fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled 
          ? "bg-[#f4f1ee]/98 backdrop-blur-md shadow-md" 
          : "bg-[#f4f1ee]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-4">

            {/* Menu Button */}
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer text-gray-700 hover:text-orange-500 transition"
            >
              <Menu size={24} />
            </button>

            {/* LOGO ONLY */}
            <Link href="/" className="cursor-pointer">
              <Image
                src="/images/logo/beaulii.webp"
                alt="Beaulii"
                width={130}
                height={40}
                className="object-contain"
                priority
              />
            </Link>

          </div>

          {/* CENTER SEARCH (Desktop Only) */}
          <div className="hidden md:flex flex-1 mx-10 relative" ref={searchRef}>
            <div className="relative w-full">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-orange-400 bg-white placeholder-black focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              {searchLoading && (
                <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 animate-spin" />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                        <p className="text-xs text-gray-500 truncate">{product.shortDescription}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-orange-600">₹{product.price}</span>
                          {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{product.oldPrice}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No products found</div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-1 md:gap-6 text-gray-700">

            {/* Mobile Search Button - Visible on tablet/mobile only */}
            <button 
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition md:hidden"
              aria-label="Search products"
            >
              <Search size={22} className="text-gray-700" />
            </button>

            <button className="cursor-pointer hover:text-orange-500 transition hidden md:block">
              <Truck size={20} />
            </button>

            <button 
              onClick={openCart}
              className="relative cursor-pointer hover:text-orange-500 transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <Link 
              href="/admin/dashboard" 
              className="cursor-pointer hover:text-orange-500 transition"
              title="Admin Dashboard"
            >
              <Shield size={20} />
            </Link>

            <button className="cursor-pointer hover:text-orange-500 transition">
              <User size={20} />
            </button>

          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-xs bg-[#f4f1ee] shadow-xl transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          } overflow-y-auto`}
        >

          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b">

            {/* Logo Only */}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              <Image
                src="/images/logo/beaulii.webp"
                alt="Beaulii"
                width={110}
                height={35}
                className="object-contain"
              />
            </Link>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:text-orange-500 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Menu List */}
          <div className="mt-4 border-t">
            {loading ? (
              <div className="px-5 py-4 text-gray-500">Loading categories...</div>
            ) : (
              menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href || (item.slug ? `/products/${item.slug}` : "#")}
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 px-5 py-4 border-b cursor-pointer hover:bg-white transition text-left"
                >
                  {item.icon}
                  <span className="font-medium text-[#3b1f0f]">
                    {item.name}
                  </span>
                </Link>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50"
          onClick={() => setMobileSearchOpen(false)}
        >
          <div 
            className="absolute top-[60px] left-0 right-0 bg-white p-4 shadow-lg rounded-b-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-1 text-gray-600 touch-manipulation"
              >
                <X size={24} />
              </button>
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 text-base rounded-full border-2 border-orange-400 bg-gray-50 focus:outline-none touch-manipulation"
                />
                {searchLoading && (
                  <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                )}
              </div>
            </div>

            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="mt-4 max-h-80 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setMobileSearchOpen(false)}
                    className="flex items-center gap-3 p-3 border-b active:bg-gray-50"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.image && (
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-orange-600">₹{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-xs text-gray-400 line-through">₹{product.oldPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && showResults && searchResults.length === 0 && !searchLoading && (
              <div className="mt-4 text-center text-gray-500 py-4">No products found</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
