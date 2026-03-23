export const initialCartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  coupon: null,
  isLoading: false,
  error: "",
};

export function cartReducer(state, action) {
  switch (action.type) {
    case "CART_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: "",
      };

    case "CART_SUCCESS":
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: "",
      };

    case "CART_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "CLEAR_CART_ERROR":
      return {
        ...state,
        error: "",
      };

    default:
      return state;
  }
}