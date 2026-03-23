import { cartReducer, initialCartState } from "./cartReducer";

describe("cartReducer", () => {
  it("should set loading state on CART_REQUEST", () => {
    const state = cartReducer(initialCartState, { type: "CART_REQUEST" });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe("");
  });

  it("should store cart data on CART_SUCCESS", () => {
    const payload = {
      items: [{ id: 1, quantity: 2 }],
      subtotal: 100,
      discount: 10,
      total: 90,
      coupon: { code: "DESCONTO10" },
    };

    const state = cartReducer(initialCartState, {
      type: "CART_SUCCESS",
      payload,
    });

    expect(state.isLoading).toBe(false);
    expect(state.items).toHaveLength(1);
    expect(state.subtotal).toBe(100);
    expect(state.discount).toBe(10);
    expect(state.total).toBe(90);
    expect(state.coupon).toEqual({ code: "DESCONTO10" });
    expect(state.error).toBe("");
  });

  it("should store error on CART_FAILURE", () => {
    const state = cartReducer(initialCartState, {
      type: "CART_FAILURE",
      payload: "Erro ao carregar carrinho",
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe("Erro ao carregar carrinho");
  });

  it("should clear error on CLEAR_CART_ERROR", () => {
    const stateWithError = {
      ...initialCartState,
      error: "Erro qualquer",
    };

    const state = cartReducer(stateWithError, {
      type: "CLEAR_CART_ERROR",
    });

    expect(state.error).toBe("");
  });

  it("should return current state on unknown action", () => {
    const state = cartReducer(initialCartState, {
      type: "UNKNOWN_ACTION",
    });

    expect(state).toEqual(initialCartState);
  });
});