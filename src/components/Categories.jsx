"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/cdn";



export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Default categories fallback if API fails or returns empty
  const defaultCategories = [
    { id: 1, name: "Hair Loss", slug: "hair-loss", image: getImageUrl("images/categories/1.webp"), type: "bestseller" },
    { id: 2, name: "Glowing Skin", slug: "glowing-skin", image: getImageUrl("images/categories/2.webp"), type: "new-arrival" },
    { id: 3, name: "Radiant Skin", slug: "radiant-skin", image: getImageUrl("images/categories/3.webp"), type: "combo" },
    { id: 4, name: "Stretch Marks", slug: "stretch-marks", image: getImageUrl("images/categories/4.webp"), type: "bestseller" },
    { id: 5, name: "Acne Clear Skin", slug: "acne-clear-skin", image: getImageUrl("images/categories/5.webp"), type: "new-arrival" },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // Map API category to component format
  const mapCategoryToDisplay = (cat, index) => {
    // Use image from API if available, otherwise use fallback based on index
    const fallbackImage = defaultCategories[index % defaultCategories.length]?.image || "/images/placeholder.jpg";
    
    return {
      name: cat.name,
      image: cat.image ? getImageUrl(cat.image) : fallbackImage,
      type: cat.slug || "bestseller",
    };
  };

  if (loading) {
    return (
      <section className="bg-[#f4f1ee] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f4f1ee] py-10">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">

          {displayCategories.map((cat, index) => {
            const displayCat = categories.length > 0 
              ? mapCategoryToDisplay(cat, index) 
              : cat;
            
            return (
              <Link
                key={cat.id || index}
                href={`/products/${displayCat.type}`}
                className="text-center group cursor-pointer"
              >
                {/* Circular Image */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden transition duration-300 group-hover:scale-105 shadow-md">
                  <Image
                    src={displayCat.image}
                    alt={displayCat.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Category Name */}
                <h3 className="mt-4 text-sm sm:text-base md:text-lg font-medium text-gray-800 group-hover:text-[#5a2a0f] transition">
                  {displayCat.name}
                </h3>
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}
