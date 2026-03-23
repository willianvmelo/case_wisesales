import CategoryFilter from "../components/product/CategoryFilter";
import ProductGrid from "../components/product/ProductGrid";
import useProducts from "../hooks/useProducts";

function CatalogPage() {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
  } = useProducts();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
        <p className="text-sm text-zinc-600">
          Explore os produtos disponíveis e filtre por categoria.
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Carregando produtos...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!isLoading && !error ? <ProductGrid products={products} /> : null}
    </section>
  );
}

export default CatalogPage;