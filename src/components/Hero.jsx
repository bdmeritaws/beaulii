"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/cdn";
import Link from "next/link";

// Default fallback banners
const defaultSlides = [
  {
    image: "/images/hero/1_1.webp",
    title: "",
    subtitle: "",
    link: null,
    linkText: null,
  },
  {
    image: "/images/hero/1_2.webp",
    title: "",
    subtitle: "",
    link: null,
    linkText: null,
  },
];



export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setBanners(data);
          } else {
            setBanners(defaultSlides);
          }
        } else {
          setBanners(defaultSlides);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setBanners(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Show loading state
  if (loading) {
    return (
      <section className="bg-[#f4f1ee] py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 w-full overflow-hidden">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg">
            <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] bg-gray-200 animate-pulse">
            </div>
          </div>
        </div>
      </section>
    );
  }

  const slides = banners.map(banner => ({
    image: banner.image ? getImageUrl(banner.image) : "/images/placeholder.jpg",
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    link: banner.link || null,
    linkText: banner.linkText || null,
  }));

  return (
    <section className="bg-[#f4f1ee] py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 w-full overflow-hidden">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg">

          {/* Slides */}
          <div
            className="flex w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full relative">

                {/* Responsive Height */}
                <div className="relative w-full h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px]">
                  <Image
                    src={slide.image}
                    alt={slide.title || `Hero ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  
                  {/* Banner Content Overlay */}
                  {(slide.title || slide.subtitle) && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        {slide.title && (
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                            {slide.title}
                          </h2>
                        )}
                        {slide.subtitle && (
                          <p className="text-sm sm:text-lg md:text-xl mb-4">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.link && slide.linkText && (
                          <Link
                            href={slide.link}
                            className="inline-block bg-[#5a2a0f] text-white px-6 py-2 rounded-full hover:bg-[#3b1f0f] transition"
                          >
                            {slide.linkText}
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border transition ${
                    current === index
                      ? "bg-[#5a2a0f] border-[#5a2a0f] scale-110"
                      : "bg-white border-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
