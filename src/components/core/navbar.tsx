"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
// Mock component for demonstration
import GoToDashboard from "../buttons/goToDashboard";
import Image from "next/image";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard/blogs", label: "Blogs" },
    { href: "/dashboard/journals", label: "Journals" },
    { href: "/dashboard/newsletter", label: "Newsletter" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/nav-icon.svg"
                alt="logo"
                width={40} // cleaner ratio
                height={40}
                className="object-contain"
              />

              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 transition-colors duration-200"
              >
                Haru memoirs
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <GoToDashboard />
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                animation: isOpen
                  ? `slideIn 0.3s ease-out ${index * 0.1}s both`
                  : "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <div
            className="pt-2"
            style={{
              animation: isOpen ? `slideIn 0.3s ease-out 0.3s both` : "none",
            }}
          >
            <GoToDashboard />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
