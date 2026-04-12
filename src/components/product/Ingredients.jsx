"use client";

export default function Ingredients({ product }) {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 md:px-10">
      
      <div className="bg-[#f3ebe4] dark:bg-[#1c1c1c] rounded-2xl sm:rounded-3xl py-12 sm:py-16 px-4 sm:px-8 md:px-12">

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#5a2a0f] dark:text-[#f5e9dc] mb-10">
          Ingredients
        </h2>

        {/* Content */}
        {product?.ingredient && (
          <div>
            <div
              className="
                w-full
                bg-white/90 dark:bg-[#2a2a2a]/90
                backdrop-blur
                rounded-2xl
                p-6 sm:p-8 md:p-10
                shadow-md sm:shadow-lg
                border border-[#e5d6c8] dark:border-gray-700
              "
            >
              <div
                className="
                  prose prose-sm sm:prose-base md:prose-lg lg:prose-xl
                  max-w-none
                  text-gray-700 dark:text-gray-300
                  prose-headings:text-[#5a2a0f] dark:prose-headings:text-white
                  prose-strong:text-black dark:prose-strong:text-white
                  prose-li:marker:text-[#8b5e3c]
                  leading-relaxed
                "
                dangerouslySetInnerHTML={{ __html: product.ingredient }}
              />
            </div>
          </div>
        )}

      </div>

    </section>
  );
}