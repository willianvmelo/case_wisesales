import CartItemCard from "../components/cart/CartItemCard";
import CartSummary from "../components/cart/CartSummary";
import useCart from "../hooks/useCart";

function CartPage() {
  const { items, subtotal, discount, total, coupon, isLoading, error, clearError } =
    useCart();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Carrinho</h1>
        <p className="text-sm text-zinc-600">
          Acompanhe os itens adicionados e o resumo do pedido.
        </p>
      </div>

      {error ? (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="font-medium text-red-800"
          >
            Fechar
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-4">
          {isLoading && items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              Carregando carrinho...
            </div>
          ) : null}

          {!isLoading && items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
              Seu carrinho está vazio.
            </div>
          ) : null}

          {items.length > 0
            ? items.map((item) => <CartItemCard key={item.id} item={item} />)
            : null}
        </div>

        <CartSummary
          subtotal={subtotal}
          discount={discount}
          total={total}
          coupon={coupon}
        />
      </div>
    </section>
  );
}

export default CartPage;