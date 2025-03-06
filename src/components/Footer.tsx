import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6">
      <div className="max-w-6xl mx-auto flex flex-row justify-between items-center px-4 text-center md:text-left">
        {/* Left Section - Branding */}
        <div className="text-lg font-semibold text-white mb-4 md:mb-0">
          knowledge testing
        </div>

        {/* Center Section - Links (Stacked on Mobile) */}
        <div className="hidden md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <Link href="/about" className="hover:text-white transition-colors">
            about
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            contact
          </Link>
          <Link
            href="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            policy
          </Link>
        </div>

        {/* Right Section - Social Media */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="https://www.linkedin.com/in/pavlo-kostyshyn-5871b8196/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            [ linkedin ]
          </a>
        </div>
      </div>
    </footer>
  );
}
