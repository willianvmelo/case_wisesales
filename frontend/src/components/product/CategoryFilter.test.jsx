import { fireEvent, render, screen } from "@testing-library/react";

import CategoryFilter from "./CategoryFilter";

describe("CategoryFilter", () => {
  it("should render all categories", () => {
    render(
      <CategoryFilter
        categories={["all", "roupas", "calçados"]}
        selectedCategory="all"
        onSelectCategory={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Todas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "roupas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "calçados" })).toBeInTheDocument();
  });

  it("should call onSelectCategory when clicking a category", () => {
    const onSelectCategory = vi.fn();

    render(
      <CategoryFilter
        categories={["all", "roupas", "calçados"]}
        selectedCategory="all"
        onSelectCategory={onSelectCategory}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "roupas" }));

    expect(onSelectCategory).toHaveBeenCalledWith("roupas");
  });
});