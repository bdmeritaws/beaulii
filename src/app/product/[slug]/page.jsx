import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import TriedAndTested from "@/components/product/TriedAndTested";
import WhatToExpect from "@/components/product/WhatToExpect";
import HowToUse from "@/components/product/HowToUse";
import WhyBeaulii from "@/components/product/WhyBeaulii";
import Reviews from "@/components/Reviews";
import ProductSection from "@/components/ProductSection";
import prisma from "@/lib/prisma";
import { getImageUrl } from "@/lib/cdn";

/* ================= REQUIRED FOR STATIC EXPORT ================= */
export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      take: 20,
    });
    return products.map((product) => ({ slug: product.slug }));
  } catch (error) {
    // Fallback to static params if DB fails
    return [
      { slug: "dark-patch-reducer-cream" },
      { slug: "flawless-skin-combo" },
      { slug: "foot-care-cream" },
    ];
  }
}

/* ================= PAGE ================= */
export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  let productData = null;
  let apiError = null;

  // Try to fetch from database
  try {
    const product = await prisma.product.findUnique({
      where: { 
        slug,
        isActive: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (product) {
      // Transform to match expected format
      productData = {
        title: product.title,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() || "",
        discount: product.discount || 0,
        reviews: product._count.reviews,
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        mrp: product.mrp?.toString() || "",
        sku: product.sku || "",
        images: product.images.length > 0 
          ? product.images.map(img => getImageUrl(img.url))
          : ["/images/placeholder.jpg"],
        beforeImage: product.beforeImage ? getImageUrl(product.beforeImage) : null,
        afterImage: product.afterImage ? getImageUrl(product.afterImage) : null,
      };
    }
  } catch (error) {
    console.error("Error fetching product from DB:", error);
    apiError = error;
  }

  // Final safety fallback
  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Product not found
      </div>
    );
  }

  return (
    <section className="bg-[#f4f1ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===== TOP SECTION ===== */}
        <div className="grid md:grid-cols-2 gap-12">
          <ProductGallery
            images={productData.images}
            title={productData.title}
          />
          <ProductInfo product={productData} />
        </div>

        {/* ===== BELOW CONTENT ===== */}
        <TriedAndTested />
        <WhatToExpect 
          beforeImage={productData.beforeImage} 
          afterImage={productData.afterImage} 
        />
        <HowToUse />
        <WhyBeaulii />
        <Reviews />
        <ProductSection title="bestseller" />

      </div>
    </section>
  );
}
