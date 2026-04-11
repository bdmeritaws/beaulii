import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getImageUrl } from "@/lib/cdn";

// GET - Search products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], message: "Query too short" });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query } },
          { shortDescription: { contains: query } },
          { description: { contains: query } },
          { slug: { contains: query } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        price: true,
        oldPrice: true,
        discount: true,
        thumbnail: true,
        productType: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    const transformedProducts = products.map((product) => {
      let primaryImage = null;
      if (product.images && product.images.length > 0 && product.images[0]?.url) {
        primaryImage = getImageUrl(product.images[0].url);
      }
      if (!primaryImage && product.thumbnail) {
        primaryImage = getImageUrl(product.thumbnail);
      }
      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        shortDescription: product.shortDescription,
        price: product.price.toString(),
        oldPrice: product.oldPrice?.toString() || "",
        discount: product.discount || 0,
        image: primaryImage,
        productType: product.productType,
      };
    });

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", products: [] },
      { status: 500 }
    );
  }
}