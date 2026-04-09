import prisma from "@/lib/prisma";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductSection from "@/components/ProductSection";
import Reviews from "@/components/Reviews";
import Videos from "@/components/Videos";
import { getImageUrl } from "@/lib/cdn";

// Default sections fallback
const defaultSections = [
  { title: "Bestseller", sectionKey: "bestsellers", type: "PRODUCTS" },
  { title: "New Arrival", sectionKey: "new-arrivals", type: "PRODUCTS" },
  { title: "Combo Deals", sectionKey: "combo", type: "PRODUCTS" },
];

// Fetch products for a section based on config
async function getSectionProducts(section, limit = 4) {
  try {
    let config = {};
    if (section.config) {
      config = JSON.parse(section.config);
    }

    const where = { isActive: true };

    // Filter by category if specified
    if (config.categorySlug) {
      where.categories = {
        some: {
          category: { slug: config.categorySlug },
        },
      };
    }

    // Filter by product type
    if (config.productType) {
      where.productType = config.productType.toUpperCase();
    }

    // Filter by featured
    if (config.isFeatured) {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: config.sortBy || { createdAt: "desc" },
      take: limit,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    });

    return products.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      shortDescription: p.shortDescription,
      price: p.price.toString(),
      oldPrice: p.oldPrice?.toString() || "",
      discount: p.discount || 0,
      image: p.images[0]?.url ? getImageUrl(p.images[0].url) : "",
    }));
  } catch (error) {
    console.error("Error fetching section products:", error);
    return [];
  }
}

export default async function Home() {
  let sections = [];
  let dbError = false;

  try {
    sections = await prisma.homeSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  } catch (error) {
    console.error("Error fetching home sections:", error);
    dbError = true;
  }

  // If DB error or no sections, use default sections
  if (dbError || sections.length === 0) {
    sections = defaultSections;
  }

  // Fetch products for each PRODUCT section
  const sectionsWithProducts = await Promise.all(
    sections.map(async (section) => {
      if (section.type === "PRODUCTS") {
        const products = await getSectionProducts(section);
        return { ...section, products };
      }
      return { ...section, products: [] };
    })
  );

  return (
    <>
      <Hero />
      <Categories />
      
      {sectionsWithProducts.map((section) => {
        if (section.type === "PRODUCTS") {
          return (
            <ProductSection
              key={section.id || section.sectionKey}
              title={section.title}
              type={section.sectionKey}
              products={section.products}
            />
          );
        }
        // Handle other section types
        return null;
      })}
      
      <Reviews />
      <Videos />
    </>
  );
}
