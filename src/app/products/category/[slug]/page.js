import ProductsGrid from "@/components/ProductsGrid";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - Beaulii`,
    description: category.description || `Shop ${category.name} products at Beaulii`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Category not found
      </div>
    );
  }

  return (
    <section className="bg-[#f4f1ee] min-h-screen py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* PAGE TITLE */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#5a2a0f] tracking-wide">
            {category.name}
          </h2>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
        </div>

        {/* FILTER + SORT BAR */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e5ddd5] p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#3b1f0f]">
              <span className="font-semibold">Filter:</span>
              <button className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                Availability ▾
              </button>
              <button className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                Price ▾
              </button>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 text-xs sm:text-sm text-[#3b1f0f]">
              <div className="text-gray-500">
                <span>Loading products...</span>
              </div>
              <button className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                Sort by: Featured ▾
              </button>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID - Fetches products by category slug */}
        <ProductsGrid category={slug} />

      </div>
    </section>
  );
}
