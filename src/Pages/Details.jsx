import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';

function Details() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`http://localhost:8081/api/products/${id}`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        // API returns result object containing product
        const prod = data.result || data;
        setProduct(prod);
      } catch (err) {
        console.error('Failed to load product detail', err);
        setError(err.message || 'Failed to load');
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

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Add to cart failed (${res.status}): ${text}`);
      }

      // success
      try { await res.json().catch(() => null); } catch {}
      try { localStorage.setItem('cartEvent', 'updated:' + Date.now()); window.dispatchEvent(new Event('cartUpdated')); } catch (e) {}
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (err) {
      console.error('Add to cart error', err);
      alert('Thêm vào giỏ hàng thất bại: ' + (err.message || err));
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Lỗi: {error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy sản phẩm.</div>;
  }

  // normalize fields
  const images = product.images || [];
  const specs = product.specs || [];
  const price = product.price || 0;
  const inStock = (product.stock && product.stock > 0) || product.inStock || false;

  return (
    <main className="min-h-screen bg-white pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <span className="hover:text-gray-900 cursor-pointer">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="hover:text-gray-900 cursor-pointer">{product.category?.name || ''}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-300 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
              <img 
                src={images[0]?.imageUrl || product.thumbnailUrl || '/images/img.jpg'} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">({product.reviews || 0} đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-gray-900">
                  {price.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className="space-y-2">
                <div className="text-gray-600">
                  <span className="font-semibold">Màu sắc:</span> {product.color}
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">Dung lượng:</span> {product.storage}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className={`px-4 py-2 rounded-lg font-semibold text-center ${inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {inStock ? '✓ Còn hàng' : 'Hết hàng'}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-semibold">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="px-6 py-2 border-l border-r border-gray-300 font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                <ShoppingCart className="h-6 w-6" />
                Thêm vào giỏ
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-4 rounded-xl font-bold text-lg border-2 transition-all duration-300 ${
                  isWishlisted
                    ? 'bg-red-100 border-red-300 text-red-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="px-6 py-4 rounded-xl font-bold text-lg border-2 border-gray-300 bg-white hover:border-gray-400 text-gray-700 transition-all duration-300">
                <Share2 className="h-6 w-6" />
              </button>
            </div>

            {/* Shipping & Support Info */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Truck className="h-5 w-5 text-gray-600" />
                <span>Miễn phí vận chuyển cho đơn hàng trên 500K</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Shield className="h-5 w-5 text-gray-600" />
                <span>Bảo hành 12 tháng chính hãng</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <RotateCcw className="h-5 w-5 text-gray-600" />
                <span>Đổi trả trong 30 ngày nếu không hài lòng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-300 p-8 mb-10">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Thông số kỹ thuật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-600 font-medium min-w-[120px]">{spec.name}</span>
                <span className="text-gray-900 font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-300 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">Mô tả sản phẩm</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            {product.description}
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            {product.longDescription || ''}
          </p>
        </div>
      </div>
    </main>
  );
}

export default Details;
