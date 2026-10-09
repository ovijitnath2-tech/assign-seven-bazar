import AllProducts from "@/components/AllProducts";
import Banner from "@/components/Banner";
import ProductSection from "@/components/ProductSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Banner />
      <ProductSection />
      <AllProducts/>
    </main>
  );
}