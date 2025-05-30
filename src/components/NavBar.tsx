import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoutModal from "./LogoutModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const tabs = ["/tests", "/about", "/contact"];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  // Disable scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    router.push("/");
  };

  return (
    <nav className="p-4 bg-[#030404]">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">
          knowledge testing
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {tabs.map((path, index) => (
            <Link
              key={index}
              href={path}
              className="relative group text-gray-300 hover:text-white"
            >
              {path}
              {/* Animated Underline */}
              <motion.div className="absolute left-0 bottom-0 w-full h-[1px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </Link>
          ))}
        </div>

        {/* Auth Buttons (Desktop) */}
        {!loading &&
          (!user ? (
            <div className="hidden md:flex space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black"
              >
                login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white"
              >
                register
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link
                href="/profile"
                className="px-4 py-2 rounded-md hover:bg-white hover:text-black"
              >
                [ {user.role} &apos;s profile ]
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black"
              >
                logout
              </button>
            </div>
          ))}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white cursor-pointer"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white cursor-pointer"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col space-y-6 text-2xl font-semibold">
              {tabs.map((path, index) => (
                <Link
                  key={index}
                  href={path}
                  onClick={() => setIsOpen(false)}
                  className="relative group"
                >
                  <span className="inline-block">{path}</span>
                  {/* Animated Underline that matches word width */}
                  <motion.div
                    className="absolute left-0 bottom-[-2px] h-[2px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: "50%" }} // Ensures underline matches text width
                  />
                </Link>
              ))}

              {!loading && !user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black font-normal"
                  >
                    login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-white border border-white text-black rounded-md hover:bg-black hover:text-white font-normal"
                  >
                    register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-md hover:bg-white hover:text-black"
                  >
                    [ {user.role} &apos;s profile ]
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black"
                  >
                    logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
}
