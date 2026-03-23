import { useEffect, useMemo, useState } from "react";

import api from "../api/client";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError("");

        const params =
          selectedCategory !== "all" ? { category: selectedCategory } : {};

        const response = await api.get("/products", { params });
        setProducts(response.data);
      } catch {
        setError("Não foi possível carregar os produtos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]);

  const categories = useMemo(() => {
    const baseCategories = ["all", "roupas", "calçados", "acessórios"];
    return baseCategories;
  }, []);

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    error,
  };
}

export default useProducts;