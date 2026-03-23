import { useEffect, useMemo, useReducer, useState } from "react";

import api from "../api/client";
import { CartContext } from "./cartContext";
import { cartReducer, initialCartState } from "./cartReducer";

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.detail || fallbackMessage;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

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

  async function updateItem(itemId, quantity) {
    try {
      dispatch({ type: "CART_REQUEST" });

      const response = await api.patch(`/cart/items/${itemId}`, {
        quantity,
      });

      dispatch({
        type: "CART_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CART_FAILURE",
        payload: getErrorMessage(error, "Não foi possível atualizar o item."),
      });
    }
  }

  async function removeItem(itemId) {
    try {
      dispatch({ type: "CART_REQUEST" });

      const response = await api.delete(`/cart/items/${itemId}`);

      dispatch({
        type: "CART_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CART_FAILURE",
        payload: getErrorMessage(error, "Não foi possível remover o item."),
      });
    }
  }

  async function applyCoupon(code) {
    try {
      setIsCouponLoading(true);
      dispatch({ type: "CLEAR_CART_ERROR" });

      const response = await api.post("/cart/coupon", { code });

      dispatch({
        type: "CART_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CART_FAILURE",
        payload: getErrorMessage(error, "Não foi possível aplicar o cupom."),
      });
    } finally {
      setIsCouponLoading(false);
    }
  }

  async function removeCoupon() {
    try {
      setIsCouponLoading(true);
      dispatch({ type: "CLEAR_CART_ERROR" });

      const response = await api.delete("/cart/coupon");

      dispatch({
        type: "CART_SUCCESS",
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: "CART_FAILURE",
        payload: getErrorMessage(error, "Não foi possível remover o cupom."),
      });
    } finally {
      setIsCouponLoading(false);
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
      isCouponLoading,
      fetchCart,
      addItem,
      updateItem,
      removeItem,
      applyCoupon,
      removeCoupon,
      clearError,
    }),
    [state, itemCount, isCouponLoading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}