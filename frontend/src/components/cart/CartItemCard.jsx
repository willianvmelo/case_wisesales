import useCart from "../../hooks/useCart";

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CartItemCard({ item }) {
  const { updateItem, removeItem, isLoading } = useCart();

  async function handleDecrease() {
    if (item.quantity === 1) {
      await removeItem(item.id);
      return;
    }

    await updateItem(item.id, item.quantity - 1);
  }

  async function handleIncrease() {
    await updateItem(item.id, item.quantity + 1);
  }

  async function handleRemove() {
    await removeItem(item.id);
  }

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            {item.category}
          </span>

          <h2 className="text-lg font-semibold">{item.name}</h2>

          <p className="text-sm text-zinc-600">
            {formatCurrency(Number(item.price))} por unidade
          </p>

          <p className="text-sm text-zinc-500">Estoque disponível: {item.stock}</p>
        </div>

        <div className="space-y-3 sm:text-right">
          <p className="text-lg font-semibold text-zinc-900">
            {formatCurrency(Number(item.line_total))}
          </p>

          <div className="flex items-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={handleDecrease}
              disabled={isLoading}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              -
            </button>

            <span className="min-w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={isLoading || item.quantity >= item.stock}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={isLoading}
            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Remover item
          </button>
        </div>
      </div>
    </article>
  );
}

export default CartItemCard;