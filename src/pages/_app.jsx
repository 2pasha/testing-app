import { Navbar } from "@/components/NavBar";
import "../styles/globals.css";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-between bg-background text-foreground">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
