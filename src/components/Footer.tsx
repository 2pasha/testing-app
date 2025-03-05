import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 text-center md:text-left">
        {/* Left Section - Branding */}
        <div className="text-lg font-semibold text-white mb-4 md:mb-0">
          Knowledge Testing
        </div>

        {/* Center Section - Links (Stacked on Mobile) */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
        </div>

        {/* Right Section - Social Media */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="www.linkedin.com/in/pavlo-kostyshyn-5871b8196"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
