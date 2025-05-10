import { Navbar } from "@/components/NavBar";
import "../styles/globals.css";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" type='image/png' href="/favicon.ico" />
        <title>test your brain</title>
      </Head>

      <AuthProvider>
        <div className="flex flex-col min-h-screen justify-between bg-background text-foreground">
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
}
