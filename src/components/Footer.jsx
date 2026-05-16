"use client";

import Image from "next/image";
import { Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#5a1f00] text-white pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* LEFT COLUMN */}
          <div>
            {/* Updated Logo */}
            <Image
              src="/images/logo/beaulii05.webp"
              alt="Beaulii"
              width={160}
              height={50}
              className="mb-6 object-contain"
              priority
            />

            {/* Phone */}
            {/* <div className="flex items-center gap-3 mb-3">
              <Phone size={18} className="text-green-400" />
              <span>01811-441177</span>
            </div> */}

            {/* Email */}
            <div className="flex items-center gap-3 mb-6">
              <Mail size={18} className="text-green-400" />
              <span>support@beaulii.com</span>
            </div>

            {/* Social Links */}
            <h4 className="text-lg font-semibold mb-4">
              Social Links
            </h4>

            <div className="flex gap-3">
              <div className="border border-gray-400 p-2 rounded-md hover:bg-white hover:text-[#5a1f00] transition cursor-pointer">
                <Facebook size={18} />
              </div>
              <div className="border border-gray-400 p-2 rounded-md hover:bg-white hover:text-[#5a1f00] transition cursor-pointer">
                <Youtube size={18} />
              </div>
              <div className="border border-gray-400 p-2 rounded-md hover:bg-white hover:text-[#5a1f00] transition cursor-pointer">
                <Instagram size={18} />
              </div>
            </div>
          </div>

          {/* INFORMATION COLUMN */}
          <div>
            <h4 className="text-xl font-semibold mb-6">
              Information
            </h4>
            <ul className="space-y-3 text-gray-200 text-sm">
              <li className="hover:text-white cursor-pointer">
                Company Overview
              </li>
              <li className="hover:text-white cursor-pointer">
                Investors
              </li>
              <li className="hover:text-white cursor-pointer">
                Store Directory
              </li>
              <li className="hover:text-white cursor-pointer">
                Returns & Refunds
              </li>
              <li className="hover:text-white cursor-pointer">
                Contact Us
              </li>
            </ul>
          </div>

          {/* ORDERS COLUMN */}
          <div>
            <h4 className="text-xl font-semibold mb-6">
              Orders
            </h4>
            <ul className="space-y-3 text-gray-200 text-sm">
              <li className="hover:text-white cursor-pointer">
                Delivery Information
              </li>
              <li className="hover:text-white cursor-pointer">
                Your Account
              </li>
              <li className="hover:text-white cursor-pointer">
                Track Order
              </li>
              <li className="hover:text-white cursor-pointer">
                Cancellation
              </li>
              <li className="hover:text-white cursor-pointer">
                App Download
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400 my-8"></div>

        {/* Bottom Policy Links */}
        <div className="text-center text-xs sm:text-sm text-gray-300 space-x-3">
          <span className="hover:text-white cursor-pointer">Refund policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Privacy policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Terms of service</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Shipping policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Contact information</span>
        </div>

      </div>
    </footer>
  );
}
