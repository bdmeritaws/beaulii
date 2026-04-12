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
        <span className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
          {product.reviews} Reviews
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-900 mb-4 leading-snug">
        {product.title}
      </h1>

      {/* Badges */}
      <div className="flex gap-2 sm:gap-3 mb-4 flex-wrap">
        <span className="bg-[#e9dfd6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
          Dermatologically Tested
        </span>

        <span className="bg-[#e9dfd6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
          SLS & Paraben Free
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="line-through text-gray-400 dark:text-gray-500 text-sm">
          $ {product.oldPrice}
        </span>

        <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          $ {product.price}
        </span>

        <span className="bg-green-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      </div>

      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
        MRP (Inclusive of all Taxes)
      </p>

      {/* Variant Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((pack) => (
          <div
            key={pack}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-gray-800 dark:hover:border-white transition shadow-sm"
          >
            <div className="relative w-full h-14 sm:h-16 mb-2">
              <Image
                src={product.images[0]}
                alt="pack"
                fill
                className="object-contain"
              />
            </div>

            <p className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-gray-100">
              Results Pack
            </p>

            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              Save $ 9
            </p>
          </div>
        ))}
      </div>

      {/* ACTION SECTION */}
      <div className="space-y-4 mb-8">

        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* Quantity */}
          <div className="flex justify-center sm:justify-start w-full sm:w-auto">
            <div className="flex items-center bg-white dark:bg-gray-900 shadow-sm border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">

              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
              >
                −
              </button>

              <span className="w-14 text-center text-base font-semibold text-gray-900 dark:text-gray-100">
                {qty}
              </span>

              <button
                onClick={() => setQty(qty + 1)}
                className="w-12 h-12 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
              >
                +
              </button>

            </div>
          </div>

          {/* Add To Cart */}
          <button 
            onClick={handleAddToCart}
            className="w-full sm:flex-1 bg-[#5a2a0f] text-white dark:bg-white dark:text-black py-3 rounded-xl font-semibold tracking-wide hover:opacity-90 transition shadow-md"
          >
            ADD TO CART
          </button>

        </div>

        {/* Buy Now */}
        <button className="w-full border-2 border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-900 py-3 rounded-xl font-semibold tracking-wide hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition">
          BUY IT NOW
        </button>

      </div>

      {/* Delivery Timeline */}
      <div className="bg-[#efe6dc] dark:bg-gray-900 rounded-xl p-4 sm:p-6 grid grid-cols-3 text-center text-xs sm:text-sm gap-2">

        <div>
          <div className="text-gray-900 dark:text-gray-100 text-xl sm:text-2xl mb-1">📦</div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">Feb 19</p>
          <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
            Order Placed
          </p>
        </div>

        <div>
          <div className="text-gray-900 dark:text-gray-100 text-xl sm:text-2xl mb-1">🚚</div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">Feb 20</p>
          <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
            Order Shipped
          </p>
        </div>

        <div>
          <div className="text-gray-900 dark:text-gray-100 text-xl sm:text-2xl mb-1">🏠</div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">Feb 23-24</p>
          <p className="text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs">
            Delivery
          </p>
        </div>

      </div>

    </div>
  );
}