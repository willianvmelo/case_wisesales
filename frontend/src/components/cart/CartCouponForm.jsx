import { useEffect, useState } from "react";

import useCart from "../../hooks/useCart";

function CartCouponForm() {
  const {
    coupon,
    items,
    applyCoupon,
    removeCoupon,
    isCouponLoading,
    clearError,
  } = useCart();

  const [code, setCode] = useState("");

  useEffect(() => {
    setCode(coupon?.code || "");
  }, [coupon]);

  async function handleSubmit(event) {
    event.preventDefault();

    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return;
    }

    clearError();
    await applyCoupon(normalizedCode);
  }

  async function handleRemoveCoupon() {
    clearError();
    await removeCoupon();
  }

  const isCartEmpty = items.length === 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Cupom</h2>
        <p className="text-sm text-zinc-600">
          Aplique um cupom de desconto no seu pedido.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Digite seu cupom"
          disabled={isCouponLoading || isCartEmpty}
          className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm outline-none transition focus:border-zinc-500"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isCouponLoading || isCartEmpty || !code.trim()}
            className="flex-1 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {isCouponLoading ? "Aplicando..." : "Aplicar cupom"}
          </button>

          <button
            type="button"
            onClick={handleRemoveCoupon}
            disabled={isCouponLoading || !coupon}
            className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remover
          </button>
        </div>
      </form>

      {coupon ? (
        <div className="mt-4 rounded-xl bg-zinc-100 px-4 py-3 text-sm text-zinc-700">
          Cupom ativo: <span className="font-semibold">{coupon.code}</span>
        </div>
      ) : null}

      {isCartEmpty ? (
        <p className="mt-4 text-sm text-zinc-500">
          Adicione itens ao carrinho para aplicar um cupom.
        </p>
      ) : null}
    </div>
  );
}

export default CartCouponForm;