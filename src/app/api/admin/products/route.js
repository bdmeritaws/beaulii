import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - List all products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");
    const productType = searchParams.get("productType");

    const where = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    // Category filter
    if (categoryId) {
      where.categories = {
        some: {
          categoryId: parseInt(categoryId),
        },
      };
    }

    // Active filter
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Featured filter
    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === "true";
    }

    // Product type filter
    if (productType) {
      where.productType = productType;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
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

// POST - Create new product
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      title,
      slug,
      description,
      shortDescription,
      price,
      oldPrice,
      discount,
      mrp,
      sku,
      stockQuantity,
      lowStockAlert,
      isInStock,
      skinType,
      concern,
      ingredient,
      howToUse,
      resultClaim,
      badges,
      thumbnail,
      videoUrl,
      beforeImage,
      afterImage,
      metaTitle,
      metaDescription,
      isActive,
      isFeatured,
      productType,
      categoryIds,
      images,
      variants,
    } = body;

    // Validate required fields
    if (!title || !slug || !price) {
      return NextResponse.json(
        { error: "Title, slug, and price are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    // Check SKU uniqueness if provided
    if (sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku },
      });
      if (existingSku) {
        return NextResponse.json(
          { error: "Product with this SKU already exists" },
          { status: 400 }
        );
      }
    }

    // Create product with categories, images, and variants
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        price,
        oldPrice,
        discount,
        mrp,
        sku,
        stockQuantity: stockQuantity || 0,
        lowStockAlert: lowStockAlert || 10,
        isInStock: isInStock !== undefined ? isInStock : true,
        skinType,
        concern,
        ingredient,
        howToUse,
        resultClaim,
        badges: badges ? JSON.stringify(badges) : null,
        thumbnail,
        videoUrl,
        beforeImage,
        afterImage,
        metaTitle,
        metaDescription,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        productType: productType || "SINGLE",
        // Add categories
        categories: categoryIds?.length > 0
          ? {
              create: categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
        // Add images
        images: images?.length > 0
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                altText: img.altText,
                sortOrder: img.sortOrder ?? index,
                isPrimary: img.isPrimary || index === 0,
              })),
            }
          : undefined,
        // Add variants
        variants: variants?.length > 0
          ? {
              create: variants.map((variant) => ({
                name: variant.name,
                sku: variant.sku,
                price: variant.price,
                oldPrice: variant.oldPrice,
                discount: variant.discount,
                stockQuantity: variant.stockQuantity || 0,
                image: variant.image,
                isActive: variant.isActive !== undefined ? variant.isActive : true,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
