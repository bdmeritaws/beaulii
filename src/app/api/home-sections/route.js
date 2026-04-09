import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - List all active home sections with products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10; // Products per section

    // Fetch active home sections ordered by displayOrder
    const sections = await prisma.homeSection.findMany({
      where: {
        isActive: true,
      },
      orderBy: { displayOrder: "asc" },
    });

    // For each PRODUCT section, fetch the associated products
    const sectionsWithProducts = await Promise.all(
      sections.map(async (section) => {
        // Parse config to get category or product filter
        let config = {};
        try {
          if (section.config) {
            config = JSON.parse(section.config);
          }
        } catch (e) {
          console.error("Error parsing section config:", e);
        }

        // If section type is PRODUCTS, fetch products
        if (section.type === "PRODUCTS") {
          const where = { isActive: true };

          // Filter by category if specified in config
          if (config.categorySlug) {
            where.categories = {
              some: {
                category: {
                  slug: config.categorySlug,
                },
              },
            };
          }

          // Filter by product type if specified in config
          if (config.productType) {
            where.productType = config.productType.toUpperCase();
          }

          // Filter by featured if specified in config
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

          // Transform products
          const transformedProducts = products.map((product) => ({
            id: product.id,
            slug: product.slug,
            title: product.title,
            shortDescription: product.shortDescription,
            price: product.price.toString(),
            oldPrice: product.oldPrice?.toString() || "",
            discount: product.discount || 0,
            image: product.images[0]?.url || null,
          }));

          return {
            ...section,
            config,
            products: transformedProducts,
          };
        }

        // For non-PRODUCT sections, return as-is
        return {
          ...section,
          config,
          products: [],
        };
      })
    );

    return NextResponse.json(sectionsWithProducts);
  } catch (error) {
    console.error("Error fetching home sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch home sections" },
      { status: 500 }
    );
  }
}
