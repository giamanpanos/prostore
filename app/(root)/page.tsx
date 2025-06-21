// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// the comments were to test the loading page

// import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  // await delay(2000);
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList
        // data={sampleData.products}
        data={latestProducts}
        title="Newest Arrivals"
        limit={4}
      />
      <ViewAllProductsButton />
    </>
  );
};

export default Homepage;
