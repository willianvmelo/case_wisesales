function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CartSummary({ subtotal, discount, total, coupon }) {
  return (
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
  );
}

export default CartSummary;