import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import SwiperSlider from './SwiperSlider';
import { Loader, Smartphone, Laptop, Tablet, ArrowRight } from 'lucide-react';

function ProductsList({ searchParams }) {
  const [products, setProducts] = useState({});
  const [groupedByBrand, setGroupedByBrand] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
    
            const keyword = (searchParams && searchParams.keyword) ? searchParams.keyword : '';
            
            // --- SỬA ĐỔI 1: Tăng size lên 100 để lấy hết sản phẩm ---
            const size = (searchParams && searchParams.size) ? searchParams.size : 100; 
            
            const minPrice = (searchParams && searchParams.minPrice) ? searchParams.minPrice : '';
            const maxPrice = (searchParams && searchParams.maxPrice) ? searchParams.maxPrice : '';
    
            const url = `http://localhost:8081/api/products?keyword=${encodeURIComponent(keyword)}&size=${size}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    
            const response = await fetch(url, { method: 'GET', headers, credentials: 'include' });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            const allProducts = data.result?.content || data.result || [];
    
            const grouped = { phones: [], laptops: [], tablets: [] };
            const byBrand = {};
    
            if (Array.isArray(allProducts)) {
              allProducts.forEach(product => {
                // --- SỬA ĐỔI 2: Logic ID khớp với JSON mới nhất ---
                // ID 1 (DIEN TU) và ID 2 (DIEN THOAI) -> Gom vào Điện thoại
                if (product.categoryId === 1 || product.categoryId === 2) { 
                    grouped.phones.push(product);
                } 
                // ID 3 (LAP TOP) -> Gom vào Laptop
                else if (product.categoryId === 3) { 
                    grouped.laptops.push(product);
                } 
                // ID 4 (TABLET) -> Gom vào Tablet
                else if (product.categoryId === 4) { 
                    grouped.tablets.push(product);
                } 
                // Các ID khác (5: Tai nghe, 6: Đồng hồ...) sẽ không hiện ở 3 mục trên 
                // nhưng vẫn sẽ hiện ở phần "Thương hiệu nổi bật" bên dưới.
    
                // --- Logic gom nhóm theo Thương Hiệu ---
                const brand = product.brandName || 'Khác';
                if (!byBrand[brand]) byBrand[brand] = [];
                byBrand[brand].push(product);
              });
            }
    
            setProducts(grouped);
            setGroupedByBrand(byBrand);
            setError(null);
          } catch (err) {
            console.error(err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
    };
    fetchProducts();
  }, [searchParams]);

  if (loading) return <div className="min-h-[400px] flex justify-center items-center"><Loader className="animate-spin text-blue-600" /></div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  const categoryInfo = [
    { key: 'phones', title: 'Điện Thoại & Phụ Kiện', subtitle: 'Công nghệ mới nhất', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-100' },
    { key: 'laptops', title: 'Laptop', subtitle: 'Hiệu năng làm việc', icon: Laptop, color: 'text-purple-600', bg: 'bg-purple-100' },
    { key: 'tablets', title: 'Máy Tính Bảng', subtitle: 'Sáng tạo mọi nơi', icon: Tablet, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <section id="products" className="bg-white py-12 font-Roboto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Công Nghệ <span className="text-blue-600">Đỉnh Cao</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Khám phá bộ sưu tập sản phẩm công nghệ được tuyển chọn kỹ lưỡng với chất lượng tốt nhất.
            </p>
        </div>

        {/* --- CATEGORY SECTIONS (GRID LAYOUT) --- */}
        <div className="space-y-20">
            {categoryInfo.map(({ key, title, subtitle, icon: Icon, color, bg }) => {
                const items = products[key] || [];
                // Chỉ hiển thị mục nếu có sản phẩm
                if (items.length === 0) return null;

                return (
                    <div key={key} className="border-b border-gray-100 pb-12 last:border-0">
                        {/* Header của từng mục */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${bg} ${color}`}>
                                    <Icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                                    <p className="text-gray-500">{subtitle}</p>
                                </div>
                            </div>
                            <Link to={`/category?categoryId=${key === 'laptops' ? 3 : key === 'tablets' ? 4 : ''}`} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition">
                                Xem tất cả {title} <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>

                        {/* Grid sản phẩm (Hiển thị tối đa 8 sản phẩm) */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.slice(0, 8).map(product => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* --- BRAND COLLECTIONS (SLIDER) --- */}
        {Object.keys(groupedByBrand).length > 0 && (
            <div className="mt-24 bg-slate-50 rounded-3xl p-8 md:p-12">
                <div className="text-center mb-10">
                    <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Bộ sưu tập theo hãng</span>
                    <h3 className="text-3xl font-black text-slate-800 mt-2">Thương Hiệu Nổi Bật</h3>
                </div>

                <div className="space-y-16">
                    {Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
                        <div key={brand}>
                            <div className="flex items-center gap-3 mb-6 px-2">
                                <div className="h-6 w-1 bg-slate-800 rounded-full"></div>
                                <h4 className="text-xl font-bold text-slate-800">{brand}</h4>
                                <span className="text-sm font-medium text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                                    {brandProducts.length} SP
                                </span>
                            </div>
                            {/* Slider hiển thị các sản phẩm của hãng đó */}
                            <SwiperSlider items={brandProducts} />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </section>
  );
}

export default ProductsList;