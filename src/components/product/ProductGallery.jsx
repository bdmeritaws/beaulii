"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/cdn";

export default function ProductGallery({ images, title }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div>

      {/* Main Image */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">

        <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px]">
          <Image
            src={getImageUrl(images[activeImage])}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Result Strip */}
        <div className="bg-[#a86a46] text-white text-center py-3 sm:py-4 text-sm sm:text-lg md:text-xl font-semibold">
          See Visible Reduction in 21 Days
        </div>

      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActiveImage(i)}
            className={`relative min-w-[80px] h-16 sm:w-24 sm:h-20 rounded-md border cursor-pointer overflow-hidden ${
              activeImage === i
                ? "border-[#5a2a0f] ring-2 ring-[#5a2a0f]"
                : "border-gray-200"
            }`}
          >
            <Image
              src={getImageUrl(img)}
              alt="thumb"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

    </div>
  );
}