import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getImageUrl } from "@/lib/cdn";

// GET - List all public products with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const category = searchParams.get("category"); // category slug
    const productType = searchParams.get("type"); // SINGLE, COMBO, etc.

    const where = {
      isActive: true,
    };

    // Filter by category slug
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    // Filter by product type
    if (productType) {
      where.productType = productType.toUpperCase();
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const total = await prisma.product.count({ where });

    // Transform products to match frontend format
    const transformedProducts = products.map((product) => {
      const primaryImage = product.images[0]?.url ? getImageUrl(product.images[0].url) : null;
      
      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        shortDescription: product.shortDescription,
        price: product.price,
        oldPrice: product.oldPrice,
        discount: product.discount,
        image: primaryImage,
        categories: product.categories ? product.categories.map((pc) => pc.category) : [],
        isFeatured: product.isFeatured,
        productType: product.productType,
      };
    });

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
