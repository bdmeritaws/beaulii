"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();

  return (
    <section className="bg-[#f4f1ee] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#3b1f0f]">
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-1">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingBag
              size={80}
              className="mx-auto text-gray-300 mb-6"
            />
            <h2 className="text-xl font-semibold text-[#3b1f0f] mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items yet.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#5a2a0f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3b1f0f] transition"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.slug}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-[#e5ddd5]"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    className="relative w-24 h-24 md:w-32 md:h-32 bg-[#f3e9df] rounded-lg flex-shrink-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm md:text-base font-semibold text-[#3b1f0f] hover:text-[#5a2a0f] transition line-clamp-2"
                    >
                      {item.title}
                    </Link>

                    <p className="text-[#5a2a0f] font-bold mt-1">
                      $ {item.price}
                    </p>

                    {item.oldPrice && (
                      <p className="text-gray-400 text-sm line-through">
                        $ {item.oldPrice}
                      </p>
                    )}

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#5a2a0f] rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.slug, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.slug, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="hidden md:block text-right">
                    <p className="text-lg font-bold text-[#3b1f0f]">
                      $ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#5a2a0f] font-medium hover:underline"
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 border border-[#e5ddd5] sticky top-24">
                <h3 className="text-lg font-bold text-[#3b1f0f] mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 border-b pb-4 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$ 0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-[#3b1f0f]">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#3b1f0f]">
                    $ {cartTotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-[#5a2a0f] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#3b1f0f] transition"
                >
                  Proceed to Checkout
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    🔒 Secure checkout • 100% Original Products
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
