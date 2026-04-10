"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getImageUrl } from "@/lib/cdn";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Unable to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryImage = (cat) => {
    if (cat?.image) {
      // If image already has full URL, use it directly
      if (cat.image.startsWith('http')) {
        return cat.image;
      }
      return getImageUrl(cat.image);
    }
    return getImageUrl("images/placeholder-category.webp");
  };

  // Skeleton Loader Component
  const CategorySkeleton = () => (
    <div className="text-center">
      <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-gray-200 animate-pulse" />
      <div className="mt-4 h-4 w-20 mx-auto bg-gray-200 rounded animate-pulse" />
    </div>
  );

  if (loading) {
    return (
      <section className="bg-[#f4f1ee] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
            {[...Array(5)].map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#f4f1ee] py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="bg-[#f4f1ee] py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">No categories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f4f1ee] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 justify-items-center">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.slug}`}
              className="text-center cursor-pointer group"
              prefetch={false}
            >
              {/* Circular Image */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={getCategoryImage(cat)}
                  alt={cat.name || 'Category'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Category Name */}
              <h3 className="mt-4 text-sm sm:text-base md:text-lg font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
