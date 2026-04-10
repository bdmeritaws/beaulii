"use client";

import Image from "next/image";

export default function HowToUse({ product }) {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 px-4">

      <div className="bg-[#e9bfc6] rounded-2xl sm:rounded-3xl py-10 sm:py-14 md:py-16 px-4 sm:px-8 md:px-12">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#6a2c2c] mb-8 sm:mb-10 md:mb-12">
          How to Use
        </h2>

        {/* Content */}
        {product?.howToUse && (
          <div 
            className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg sm:shadow-xl"
            dangerouslySetInnerHTML={{ __html: product.howToUse }}
          />
        )}

      </div>

    </section>
  );
}