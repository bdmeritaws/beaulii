"use client";

import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const videos = [
  { link: "https://www.youtube.com/embed/MlpO5jFx9p8" },
  { link: "https://www.youtube.com/embed/8GkFzcNQT3M" },
  { link: "https://www.youtube.com/embed/cf0biRzj3BI" },
  { link: "https://www.youtube.com/embed/UnyIA8SVvL0" },
  { link: "https://www.youtube.com/embed/qYVFytHJL-M" },
  { link: "https://www.youtube.com/embed/_KA0nyJWakw" },
];

export default function Videos() {
  const { addToCart } = useCart();

  return (
    <section className="bg-[#f4f1ee] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl font-bold text-center text-[#5a2a0f] mb-12">
          Shop By Videos
        </h2>

        {/* Scroll Container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">

            {videos.map((video, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[200px] sm:w-[230px] bg-black rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative w-full aspect-[9/16]">
                  <iframe
                    src={video.link}
                    className="w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="bg-white p-3 text-sm">
                  <h4 className="font-semibold text-[#3b1f0f] truncate">
                    Pokonut Stretch Mark Cream
                  </h4>
                  <div className="flex gap-2 text-xs mt-1">
                    <span className="font-bold text-[#3b1f0f]">
                      $ 5.00
                    </span>
                    <span className="line-through text-gray-400">
                      $ 8.00
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    addToCart({ slug: 'pokonut-stretch-mark-cream', title: 'Pokonut Stretch Mark Cream', price: '5.00', image: '/images/bestsellers/1.webp' });
                    toast.success('Pokonut Stretch Mark Cream added to cart!');
                  }}
                  className="w-full bg-black text-white py-2 text-sm font-medium hover:bg-[#333] transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
