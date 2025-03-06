import { Navbar } from "@/components/NavBar";
import "../styles/globals.css";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen justify-between bg-background text-foreground">
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AuthProvider>
  );
}
