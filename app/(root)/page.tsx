// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// the comments were to test the loading page

// import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  // await delay(2000);
  return (
    <>
      <ProductList
        // data={sampleData.products}
        data={latestProducts}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
};

export default Homepage;
