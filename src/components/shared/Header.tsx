"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import { MoveUpRight, Menu, X } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // Get current pathname

  // Toggle menu open/close state
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Determine button text and link based on current path
  const isSignUpPage = pathname === "/auth/sign-up";
  const isSignInPage = pathname === "/auth/sign-in";
  const authButtonText = isSignUpPage ? "Sign In" : "Sign Up";
  const authButtonLink = isSignUpPage ? "/auth/sign-in" : "/auth/sign-up";

  return (
    <header className="w-full h-[10vh] px-6 sm:px-16 py-4 shadow-lg backdrop-filter bg-opacity-30 bg-transparent border-b-2 border-gray-800 fixed top-0 z-10 backdrop-blur-xl rounded-b-lg flex items-center justify-between">
      {/* Left: Company Name */}
      <Link href="/" className="text-2xl font-bold text-primary-foreground">
        <span className="text-cyan-500">Event</span>ure
      </Link>

      {/* Mobile Menu Button */}
      <button onClick={toggleMenu} className="sm:hidden text-gray-200">
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Right: Nav Links */}
      <nav
        className={`${
          menuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-10 absolute sm:relative top-[10vh] sm:top-auto left-0 w-full sm:w-auto bg-slate-900 sm:bg-transparent px-6 sm:px-0 py-4 sm:py-0 transition-all duration-300`}
      >
        <Link
          href="/events"
          className="flex items-center gap-1 text-gray-200 hover:text-cyan-300 transition-all duration-200"
          onClick={() => setMenuOpen(false)} // Close menu on link click
        >
          <span className="font-semibold text-lg">Explore Events</span>
          <MoveUpRight className="font-semibold" size={20} />
        </Link>

        {isSignedIn ? (
          // If user is signed in, show Profile link and Sign Out button
          <div className="flex flex-col sm:flex-row items-center gap-6 space-y-4 sm:space-y-0">
            <Link
              href="/profile"
              className="text-gray-200 font-semibold hover:text-cyan-300"
              onClick={() => setMenuOpen(false)}
            >
              {user?.firstName || "Profile"}
            </Link>
            <SignOutButton>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white bg-cyan-500 px-4 py-2 rounded-full hover:text-cyan-600 hover:bg-white transition-all duration-200"
              >
                Sign Out
              </button>
            </SignOutButton>
          </div>
        ) : (
          // Conditional Sign In/Sign Up button based on the current page
          <Link
            href={authButtonLink}
            className="relative inline-flex items-center justify-center px-5 py-3 font-bold rounded-full bg-cyan-600 text-white transition-all duration-300 group"
            onClick={() => setMenuOpen(false)}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300"></span>
            <span className="relative z-10">{authButtonText}</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
