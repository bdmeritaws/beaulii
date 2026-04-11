"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function ProductInfo({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      slug: product.slug || product.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-"),
      title: product.title,
      price: product.price,
      image: product.images?.[0] || product.images[0],
      oldPrice: product.oldPrice,
    }, qty);
    toast.success(`${qty} × ${product.title} added to cart!`);
  };

  return (
    <div>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm mb-2">
        <span className="text-yellow-500 text-lg">★★★★★</span>
        <span className="text-gray-600 text-xs sm:text-sm">
          {product.reviews} Reviews
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3b1f0f] mb-4 leading-snug">
        {product.title}
      </h1>

      {/* Badges */}
      <div className="flex gap-2 sm:gap-3 mb-4 flex-wrap">
        <span className="bg-[#e9dfd6] px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
          Dermatologically Tested
        </span>
        <span className="bg-[#e9dfd6] px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
          SLS & Paraben Free
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="line-through text-gray-400 text-sm">
          $ {product.oldPrice}
        </span>

        <span className="text-xl sm:text-2xl font-bold text-[#3b1f0f]">
          $ {product.price}
        </span>

        <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 mb-6">
        MRP (Inclusive of all Taxes)
      </p>

      {/* Variant Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((pack) => (
          <div
            key={pack}
            className="bg-white border rounded-lg p-3 text-center cursor-pointer hover:border-[#5a2a0f] transition shadow-sm"
          >
            <div className="relative w-full h-14 sm:h-16 mb-2">
              <Image
                src={product.images[0]}
                alt="pack"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-[11px] sm:text-xs font-semibold">
              Results Pack
            </p>
            <p className="text-[10px] sm:text-xs text-gray-600">
              Save $ 9
            </p>
          </div>
        ))}
      </div>

      {/* ===== ACTION SECTION ===== */}
      <div className="space-y-4 mb-8">

        {/* Desktop Layout */}
        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* Quantity */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <div className="flex items-center bg-white shadow-sm border border-[#5a2a0f] rounded-xl overflow-hidden">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-12 flex items-center justify-center text-xl font-bold text-[#3b1f0f] hover:bg-[#f4f1ee] transition active:scale-95"
              >
                −
              </button>

              <span className="w-14 text-center text-base font-semibold">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="w-12 h-12 flex items-center justify-center text-xl font-bold text-[#3b1f0f] hover:bg-[#f4f1ee] transition active:scale-95"
              >
                +
              </button>

            </div>
          </div>

          {/* Add To Cart */}
          <button 
            onClick={handleAddToCart}
            className="w-full sm:flex-1 bg-[#5a2a0f] text-white py-3 rounded-xl font-semibold tracking-wide hover:bg-[#3b1f0f] transition shadow-md"
          >
            ADD TO CART
          </button>

        </div>

        {/* Buy Now */}
        <button className="w-full border-2 border-[#5a2a0f] text-[#5a2a0f] py-3 rounded-xl font-semibold tracking-wide hover:bg-[#5a2a0f] hover:text-white transition">
          BUY IT NOW
        </button>

      </div>

      {/* Delivery Timeline */}
      <div className="bg-[#efe6dc] rounded-xl p-4 sm:p-6 grid grid-cols-3 text-center text-xs sm:text-sm gap-2">

        <div>
          <div className="text-[#5a2a0f] text-xl sm:text-2xl mb-1">📦</div>
          <p className="font-semibold">Feb 19</p>
          <p className="text-gray-600 text-[10px] sm:text-xs">
            Order Placed
          </p>
        </div>

        <div>
          <div className="text-[#5a2a0f] text-xl sm:text-2xl mb-1">🚚</div>
          <p className="font-semibold">Feb 20</p>
          <p className="text-gray-600 text-[10px] sm:text-xs">
            Order Shipped
          </p>
        </div>

        <div>
          <div className="text-[#5a2a0f] text-xl sm:text-2xl mb-1">🏠</div>
          <p className="font-semibold">Feb 23-24</p>
          <p className="text-gray-600 text-[10px] sm:text-xs">
            Delivery
          </p>
        </div>

      </div>

    </div>
  );
}