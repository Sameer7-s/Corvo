import Navbar from "@/components/Navbar";
import "@/components/Navbar.css";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
