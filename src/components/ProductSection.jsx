import ProductCard from "./ProductCard";
import Link from "next/link";

export default function ProductSection({ title, products: externalProducts, type }) {
  if (!externalProducts || externalProducts.length === 0) {
    return null;
  }

  const displayProducts = externalProducts.map((p) => ({
    image: p.image,
    title: p.title,
    subtitle: p.shortDescription || "",
    oldPrice: p.oldPrice || "",
    newPrice: p.price,
    discount: p.discount || 0,
    slug: p.slug,
  }));

  // Generate URL-friendly slug from title
  const getSectionSlug = () => {
    if (type) return type;
    return title.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <section className="bg-[#f4f1ee] py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADING */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#5a2a0f] mb-5">
            {title}
          </h2>

          <Link
            href={`/products/${getSectionSlug()}`}
            className="border border-[#5a2a0f] text-[#5a2a0f] px-8 py-2 rounded-full hover:bg-[#5a2a0f] hover:text-white transition inline-block"
          >
            Explore All
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>

      </div>
    </section>
  );
}
