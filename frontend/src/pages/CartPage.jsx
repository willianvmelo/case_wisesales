import useCart from "../hooks/useCart";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

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
          {isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              Carregando carrinho...
            </div>
          ) : null}

          {!isLoading && items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
              Seu carrinho está vazio.
            </div>
          ) : null}

          {!isLoading && items.length > 0
            ? items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {item.category}
                      </span>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-sm text-zinc-600">
                        Quantidade: {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-zinc-500">
                        {formatCurrency(Number(item.price))} por unidade
                      </p>
                      <p className="text-lg font-semibold text-zinc-900">
                        {formatCurrency(Number(item.line_total))}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            : null}
        </div>

        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Resumo do pedido</h2>

          <div className="mt-4 space-y-3 text-sm text-zinc-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(subtotal))}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Desconto</span>
              <span>- {formatCurrency(Number(discount))}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Cupom</span>
              <span>{coupon?.code || "Nenhum"}</span>
            </div>

            <div className="border-t border-zinc-200 pt-3">
              <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
                <span>Total</span>
                <span>{formatCurrency(Number(total))}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CartPage;