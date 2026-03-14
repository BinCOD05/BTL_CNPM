import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

function ProductCard({ product }) {
    const [loading, setLoading] = useState(false);
    // Ảnh fallback nếu lỗi
    const fallback = 'https://via.placeholder.com/300x300?text=No+Image';
    const displayImage = product.thumbnailUrl || product.image || fallback;
    
    const price = product.price 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) 
        : 'Liên hệ';

    const handleAddToCart = async (e) => {
        e.preventDefault(); // Ngăn link click
        e.stopPropagation();
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            // Giả lập API call nhanh để UI mượt hơn
            // (Bạn giữ nguyên logic fetch của bạn ở đây)
            const body = { productId: Number(product.id), quantity: 1 };
            const res = await fetch('http://localhost:8081/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error('Lỗi thêm giỏ hàng');
            
            // Dispatch event cập nhật giỏ
            window.dispatchEvent(new Event('cartUpdated'));
            alert(`Đã thêm ${product.name} vào giỏ!`); // Có thể thay bằng Toast notification
        } catch (err) {
            console.error(err);
            alert('Cần đăng nhập để mua hàng!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link 
            to={`/product/detail/${product.id}`}
            className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 p-4">
                <img 
                    src={displayImage} 
                    alt={product.name} 
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 mix-blend-multiply" 
                />
                
                {/* Badges (Optional - Ví dụ: Giảm giá / Mới) */}
                {/* <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    HOT
                </div> */}

                {/* Quick Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <button 
                        onClick={handleAddToCart}
                        disabled={loading}
                        className="bg-white p-2.5 rounded-full shadow-md text-gray-700 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                        title="Thêm vào giỏ"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>

            {/* Info Container */}
            <div className="flex flex-col flex-1 p-5">
                <div className="mb-2">
                    <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md">
                        {product.brandName || 'Samsung'}
                    </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                    {product.name}
                </h3>

                {/* Price Section */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium line-through">
                            {/* Nếu có giá cũ thì hiện ở đây */}
                        </span>
                        <span className="text-lg font-black text-slate-900">
                            {price}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;