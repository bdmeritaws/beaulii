import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import TriedAndTested from "@/components/product/TriedAndTested";
import WhatToExpect from "@/components/product/WhatToExpect";
import HowToUse from "@/components/product/HowToUse";
import Ingredients from "@/components/product/Ingredients";
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
        variants: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (product) {
      // Collect all product images
      const productImages = [];
      
      // Add main product images
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          if (img.url) {
            productImages.push(getImageUrl(img.url));
          }
        });
      }
      
      // Add thumbnail as fallback
      if (productImages.length === 0 && product.thumbnail) {
        productImages.push(getImageUrl(product.thumbnail));
      }
      
      // Add variant images
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          if (variant.image && !productImages.includes(getImageUrl(variant.image))) {
            productImages.push(getImageUrl(variant.image));
          }
        });
      }
      
      // Fallback placeholder
      if (productImages.length === 0) {
        productImages.push(getImageUrl("images/placeholder.webp"));
      }
      
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
        images: productImages,
        resultClaim: product.resultClaim,
        beforeImage: product.beforeImage ? getImageUrl(product.beforeImage) : null,
        afterImage: product.afterImage ? getImageUrl(product.afterImage) : null,
        ingredient: product.ingredient || "",
        howToUse: product.howToUse || "",
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
       <section className="bg-[#f4f1ee] min-h-screen pt-24 pb-12 sm:pt-15 sm:pb-10 md:pt-15 md:pb-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===== TOP SECTION ===== */}
        <div className="grid md:grid-cols-2 gap-12">
          <ProductGallery
            images={productData.images}
            title={productData.title}
            resultClaim={productData.resultClaim}
          />
          <ProductInfo product={productData} />
        </div>

        {/* ===== BELOW CONTENT ===== */}
        <TriedAndTested />
        <WhatToExpect 
          beforeImage={productData.beforeImage} 
          afterImage={productData.afterImage} 
        />
        <Ingredients product={productData} />
        <HowToUse product={productData} />
        <WhyBeaulii />        <Reviews />
        <ProductSection title="bestseller" />

      </div>
    </section>
  );
}
