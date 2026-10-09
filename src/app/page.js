import AllProducts from "@/components/AllProducts";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import ProductSection from "@/components/ProductSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Banner />
      <ProductSection />
      <AllProducts/>
      <Footer/>
    </main>
    
  );
}