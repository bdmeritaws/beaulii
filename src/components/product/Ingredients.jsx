"use client";

export default function Ingredients({ product }) {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 px-4">

      <div className="bg-[#e9dfd6] rounded-2xl sm:rounded-3xl py-10 sm:py-14 md:py-16 px-4 sm:px-8 md:px-12">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#5a2a0f] mb-8 sm:mb-10 md:mb-12">
          Ingredients
        </h2>

        {/* Content */}
        {product?.ingredient && (
          <div 
            className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg sm:shadow-xl"
            dangerouslySetInnerHTML={{ __html: product.ingredient }}
          />
        )}

      </div>

    </section>
  );
}