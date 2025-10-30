import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
        >
          Thêm vào giỏ
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="font-semibold text-blue-600">{product.price.toLocaleString('vi-VN')} ₫</span>
          <span className="text-slate-400">{product.brand}</span>
        </div>
        <Link to={`/category?highlight=${product.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;