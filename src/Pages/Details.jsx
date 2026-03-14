import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Truck, Shield, RotateCcw, Check } from 'lucide-react';

function Details() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8081/api/products/${id}`);
        if (!res.ok) throw new Error('Lỗi tải sản phẩm');
        const data = await res.json();
        
        // Lấy object product từ result
        const prod = data.result; 
        setProduct(prod);
        
        // LOGIC CHỌN ẢNH MẶC ĐỊNH:
        // Tìm ảnh nào có primary = true, nếu không có thì lấy ảnh đầu tiên
        if (prod.images && prod.images.length > 0) {
            const primaryImg = prod.images.find(img => img.primary);
            setSelectedImage(primaryImg ? primaryImg.imageUrl : prod.images[0].imageUrl);
        } else {
            setSelectedImage('https://via.placeholder.com/600?text=No+Image');
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const body = {
        productId: Number(product.id),
        quantity: Number(quantity),
      };

      const res = await fetch('http://localhost:8081/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Thêm thất bại');
      
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center font-sans">Đang tải...</div>;
  if (error || !product) return <div className="min-h-screen flex justify-center items-center font-sans text-red-500">Sản phẩm không tồn tại.</div>;

  const price = product.price ? product.price.toLocaleString('vi-VN') : 'Liên hệ';
  const inStock = product.stock > 0;

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 space-x-2">
            <Link to="/" className="hover:text-black transition">Trang chủ</Link>
            <span>/</span>
            {/* Sửa: Lấy category.name từ JSON */}
            <span className="hover:text-black transition cursor-pointer">{product.category?.name}</span>
            <span>/</span>
            <span className="text-black font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
            <div className="space-y-4">
                {/* Ảnh lớn đang chọn */}
                <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center p-4 relative group">
                    <img 
                        src={selectedImage} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                
                {/* List ảnh nhỏ (Thumbnails) */}
                {/* Sửa: Duyệt qua mảng product.images */}
                {product.images && product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images.map((img, idx) => (
                            <button 
                                key={img.id || idx} 
                                onClick={() => setSelectedImage(img.imageUrl)}
                                className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden p-1 transition-all ${
                                    selectedImage === img.imageUrl 
                                    ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' 
                                    : 'border-transparent bg-gray-50 hover:border-gray-200'
                                }`}
                            >
                                <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN */}
            <div className="flex flex-col">
                <div className="mb-2">
                    {/* Sửa: Lấy brand.name từ JSON */}
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                        {product.brand?.name || 'Chính hãng'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">
                        {product.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Mã SP: <span className="text-black font-mono">#{product.id}</span></span>
                        <span>|</span>
                        <span className={inStock ? "text-green-600 font-bold flex items-center gap-1" : "text-red-500 font-bold"}>
                            {inStock ? <><Check size={14}/> Còn hàng ({product.stock})</> : "Hết hàng"}
                        </span>
                    </div>
                </div>

                <div className="py-6 border-b border-gray-100">
                    <p className="text-4xl font-black text-slate-900">{price} <span className="text-xl align-top text-gray-500 font-medium">₫</span></p>
                </div>

                {/* Các thuộc tính (Màu, Dung lượng) */}
                <div className="py-6 space-y-4">
                    {(product.color || product.storage) && (
                        <div className="flex flex-wrap gap-3">
                            {product.color && (
                                <div className="px-4 py-2 border rounded-lg bg-gray-50 text-sm">
                                    <span className="text-gray-500 mr-2">Màu sắc:</span>
                                    <span className="font-bold text-slate-900">{product.color}</span>
                                </div>
                            )}
                            {product.storage && (
                                <div className="px-4 py-2 border rounded-lg bg-gray-50 text-sm">
                                    <span className="text-gray-500 mr-2">Dung lượng:</span>
                                    <span className="font-bold text-slate-900">{product.storage}</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Mô tả ngắn */}
                    {product.description && (
                         <p className="text-gray-600 leading-relaxed text-base">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Nút Mua Hàng */}
                <div className="mt-auto pt-6">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-sm font-bold text-gray-900">Số lượng</span>
                        <div className="flex items-center border border-gray-300 rounded-lg h-12 w-32">
                            <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="w-10 h-full hover:bg-gray-100 font-bold text-gray-500 transition">-</button>
                            <input 
                                type="text" 
                                readOnly 
                                value={quantity} 
                                className="w-full h-full text-center font-bold text-gray-900 border-none focus:ring-0" 
                            />
                            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-full hover:bg-gray-100 font-bold text-gray-500 transition">+</button>
                        </div>
                    </div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={!inStock}
                        className="w-full bg-slate-900 hover:bg-black text-white text-lg font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-gray-200 hover:shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={22} />
                        {inStock ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
                    </button>

                    {/* Chính sách (Giữ nguyên icon) */}
                    <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-gray-100">
                        <div className="text-center group">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 group-hover:scale-110 transition">
                                <Truck size={20} />
                            </div>
                            <p className="text-xs font-bold text-gray-900">Freeship</p>
                            <p className="text-[10px] text-gray-500">Đơn trên 500k</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 group-hover:scale-110 transition">
                                <Shield size={20} />
                            </div>
                            <p className="text-xs font-bold text-gray-900">Bảo hành</p>
                            <p className="text-[10px] text-gray-500">12 Tháng</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600 group-hover:scale-110 transition">
                                <RotateCcw size={20} />
                            </div>
                            <p className="text-xs font-bold text-gray-900">Đổi trả</p>
                            <p className="text-[10px] text-gray-500">30 Ngày</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* BẢNG THÔNG SỐ KỸ THUẬT */}
        {/* Sửa: Dùng product.specs từ JSON */}
        {product.specs && product.specs.length > 0 && (
            <div className="mt-20 border-t border-gray-100 pt-16 animate-fadeIn">
                <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Thông số kỹ thuật</h2>
                <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm">
                    <table className="w-full text-sm text-left">
                        <tbody>
                            {product.specs.map((spec, idx) => (
                                <tr key={spec.id || idx} className="border-b border-gray-200 last:border-0 hover:bg-gray-100 transition">
                                    <td className="py-4 px-4 font-medium text-gray-500 w-1/3 align-top">{spec.name}</td>
                                    <td className="py-4 px-4 font-bold text-gray-900 align-top">{spec.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </main>
  );
}

export default Details;