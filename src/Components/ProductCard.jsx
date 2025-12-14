import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function ProductCard({ product, variant = 'default' }) {
	const [loading, setLoading] = useState(false);
	const fallback = '/images/img.jpg';
	const displayImage = product.thumbnailUrl || product.image || fallback;
	const price = product.price ? product.price.toLocaleString('vi-VN') : '0';

	const handleAddToCart = async (e) => {
		e.stopPropagation?.();
		try {
			setLoading(true);
			const token = localStorage.getItem('authToken');
			const body = { productId: Number(product.id), quantity: 1 };

			const res = await fetch('http://localhost:8081/api/cart', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {}),
				},
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const text = await res.text().catch(() => '');
				throw new Error(`Status ${res.status}: ${text}`);
			}

			// success
			try { await res.json(); } catch {}
			// simple feedback — replace with toast if you have one
			try { localStorage.setItem('cartEvent', 'updated:' + Date.now()); window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
			alert('Đã thêm vào giỏ hàng');
		} catch (err) {
			console.error('Add to cart failed', err);
			alert('Không thể thêm vào giỏ hàng: ' + (err.message || err));
		} finally {
			setLoading(false);
		}
	};


	const isLarge = variant === 'large';

	return (
		<article className={`product-card group relative h-full flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ${isLarge ? 'md:flex-row' : ''}`}>
			<div className={`relative overflow-hidden ${isLarge ? 'md:w-1/2' : ''}`}>
				<img src={displayImage} alt={product.name} className={`img-grayscale w-full ${isLarge ? 'h-80 md:h-[420px] object-cover' : 'h-64 md:h-72 object-cover'}`} />
				<button
					aria-label="Thêm vào giỏ"
					onClick={handleAddToCart}
					disabled={loading}
					className="absolute top-3 right-3 bg-white/95 text-slate-900 p-2 rounded-full shadow border border-gray-100 hover:bg-slate-100 transition disabled:opacity-60 disabled:cursor-wait"
				>
					{loading ? '...' : <ShoppingCart className="w-4 h-4" />}
				</button>
			</div>

			<div className={`flex flex-1 flex-col gap-2 p-4 ${isLarge ? 'md:w-1/2' : ''}`}>
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-gray-500 uppercase">{product.brandName || 'Thương hiệu'}</span>
					<span className="text-sm text-gray-400">{product.stock ? `${product.stock} còn` : ''}</span>
				</div>

				<h3 className={`${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'} font-semibold bw-heading line-clamp-2`}>{product.name}</h3>

				{product.description && <p className={`text-sm text-gray-500 ${isLarge ? 'line-clamp-3' : 'line-clamp-2'}`}>{product.description}</p>}

				<div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
					<div className="text-lg font-bold text-slate-900">{price} ₫</div>
					<Link to={`/product/detail/${product.id}`} className="text-sm text-slate-700 font-medium">Chi tiết</Link>
				</div>
			</div>
		</article>
	);
}

export default ProductCard;




