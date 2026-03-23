import { createContext, useEffect, useMemo, useReducer } from "react";

import api from "../api/client";
import { cartReducer, initialCartState } from "./cartReducer";

export const CartContext = createContext(null);

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.detail || fallbackMessage;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  async function fetchCart() {
    try {
      dispatch({ type: "CART_REQUEST" });

      const response = await api.get("/cart");

      dispatch({
        type: "CART_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CART_FAILURE",
        payload: getErrorMessage(error, "Não foi possível carregar o carrinho."),
      });
    }
  }

  async function addItem(productId, quantity = 1) {
    try {
      dispatch({ type: "CART_REQUEST" });

      const response = await api.post("/cart/items", {
        product_id: productId,
        quantity,
      });

      dispatch({
        type: "CART_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CART_FAILURE",
        payload: getErrorMessage(error, "Não foi possível adicionar o item."),
      });
    }
  }

  function clearError() {
    dispatch({ type: "CLEAR_CART_ERROR" });
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const itemCount = useMemo(
    () => state.items.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [state.items],
  );

  const value = useMemo(
    () => ({
      ...state,
      itemCount,
      fetchCart,
      addItem,
      clearError,
    }),
    [state, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}