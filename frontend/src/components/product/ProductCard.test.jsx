import { fireEvent, render, screen } from "@testing-library/react";

import ProductCard from "./ProductCard";

const addItemMock = vi.fn();

vi.mock("../../hooks/useCart", () => ({
  default: () => ({
    addItem: addItemMock,
    isLoading: false,
  }),
}));

describe("ProductCard", () => {
  beforeEach(() => {
    addItemMock.mockClear();
  });

  it("should render product information", () => {
    const product = {
      id: 1,
      name: "Camiseta Básica Preta",
      category: "roupas",
      price: 49.9,
      stock: 15,
      image_url: null,
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText("Camiseta Básica Preta")).toBeInTheDocument();
    expect(screen.getByText("roupas")).toBeInTheDocument();
    expect(screen.getByText("Estoque disponível: 15")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar ao carrinho" })).toBeInTheDocument();
  });

  it("should call addItem when clicking add to cart", () => {
    const product = {
      id: 1,
      name: "Camiseta Básica Preta",
      category: "roupas",
      price: 49.9,
      stock: 15,
      image_url: null,
    };

    render(<ProductCard product={product} />);

    fireEvent.click(screen.getByRole("button", { name: "Adicionar ao carrinho" }));

    expect(addItemMock).toHaveBeenCalledWith(1, 1);
  });

  it("should disable button for out of stock product", () => {
    const product = {
      id: 4,
      name: "Mochila Notebook 15\"",
      category: "acessórios",
      price: 89.9,
      stock: 0,
      image_url: null,
    };

    render(<ProductCard product={product} />);

    expect(screen.getByRole("button", { name: "Adicionar ao carrinho" })).toBeDisabled();
    expect(screen.getByText("Produto indisponível")).toBeInTheDocument();
  });
});