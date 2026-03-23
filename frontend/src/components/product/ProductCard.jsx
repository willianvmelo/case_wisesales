function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function ProductCard({ product }) {
  const isOutOfStock = product.stock === 0;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <span>Sem imagem</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="space-y-1">
          <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            {product.category}
          </span>

          <h2 className="text-lg font-semibold tracking-tight">{product.name}</h2>
        </div>

        <div className="mt-auto space-y-2">
          <p className="text-2xl font-bold text-zinc-900">
            {formatCurrency(Number(product.price))}
          </p>

          <p
            className={`text-sm ${
              isOutOfStock ? "text-red-600" : "text-zinc-600"
            }`}
          >
            {isOutOfStock
              ? "Produto indisponível"
              : `Estoque disponível: ${product.stock}`}
          </p>

          <button
            type="button"
            disabled={isOutOfStock}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              isOutOfStock
                ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                : "bg-zinc-900 text-white hover:bg-zinc-800"
            }`}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;