import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import { Filter, X, ChevronDown } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Category() {
  const query = useQuery();
  const navigate = useNavigate();

  // URL Params
  const keyword = query.get('keyword') || '';
  const brandParam = query.get('brand') || '';
  const minPriceParam = query.get('minPrice') || '';
  const maxPriceParam = query.get('maxPrice') || '';
  const categoryId = query.get('categoryId') || '';

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    keyword: keyword,
    brand: brandParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    categoryId: categoryId
  });

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        // Build URL
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (brandParam) params.append('brand', brandParam);
        if (minPriceParam) params.append('minPrice', minPriceParam);
        if (maxPriceParam) params.append('maxPrice', maxPriceParam);
        if (categoryId) params.append('categoryId', categoryId);
        params.append('size', 100); // Lấy nhiều để client filter nếu cần

        const res = await fetch(`http://localhost:8081/api/products?${params.toString()}`, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        const list = data.result?.content || data.result || [];
        setProducts(list);
        setError(null);
      } catch (err) {
        console.error('Category fetch error', err);
        setError(err.message || 'Lỗi khi tải dữ liệu');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Sync state with URL params when URL changes
    setFilters({ keyword, brand: brandParam, minPrice: minPriceParam, maxPrice: maxPriceParam, categoryId });
  }, [keyword, brandParam, minPriceParam, maxPriceParam, categoryId]);

  // Handle Apply Filter
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set('keyword', filters.keyword);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    
    navigate(`?${params.toString()}`);
    setShowFilter(false); // Close mobile filter
  };

  // Hardcoded options (Should fetch from API in real app)
  const brands = ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Sony', 'Asus', 'Dell', 'HP'];
  const categories = [
    { id: 1, name: 'Điện Thoại' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Tablet' },
    { id: 4, name: 'Phụ Kiện' }
  ];

  // Dynamic Banner Info
  const getBannerInfo = () => {
    const k = (keyword || brandParam || '').toLowerCase();
    if (k.includes('iphone') || k.includes('apple')) return { 
      bg: 'bg-gradient-to-r from-gray-900 to-gray-800', 
      title: 'Apple Store', 
      desc: 'Khám phá hệ sinh thái Apple đỉnh cao.',
      img: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?auto=format&fit=crop&w=1600&q=80'
    };
    if (k.includes('samsung')) return { 
      bg: 'bg-gradient-to-r from-blue-900 to-blue-700', 
      title: 'Samsung Galaxy', 
      desc: 'Đột phá công nghệ màn hình gập.',
      img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1600&q=80'
    };
    if (k.includes('laptop') || k.includes('macbook')) return { 
      bg: 'bg-gradient-to-r from-indigo-900 to-slate-800', 
      title: 'Laptop & MacBook', 
      desc: 'Hiệu năng mạnh mẽ cho công việc.',
      img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80'
    };
    return { 
      bg: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600', 
      title: 'Cửa Hàng', 
      desc: 'Tìm kiếm sản phẩm công nghệ yêu thích của bạn.',
      img: '' 
    };
  };

  const banner = getBannerInfo();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-Roboto">
      
      {/* Hero Banner */}
      <div className={`relative ${banner.bg} text-white py-16 md:py-24 px-6 mb-8 overflow-hidden`}>
        {banner.img && <img src={banner.img} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />}
        <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">{banner.title}</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{banner.desc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR FILTER (Desktop) --- */}
          <aside className={`lg:w-1/4 ${showFilter ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold">Bộ lọc</h2>
              <button onClick={() => setShowFilter(false)}><X size={24} /></button>
            </div>

            <div className="space-y-8 sticky top-24">
              {/* Search Keyword */}
              <div>
                <h3 className="font-bold mb-3">Tìm kiếm</h3>
                <input 
                  type="text" 
                  value={filters.keyword}
                  onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                  placeholder="Tên sản phẩm..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-bold mb-3">Danh mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="cat" 
                      checked={!filters.categoryId} 
                      onChange={() => setFilters({...filters, categoryId: ''})} 
                      className="accent-blue-600"
                    />
                    <span>Tất cả</span>
                  </label>
                  {categories.map(c => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="cat"
                        value={c.id}
                        checked={Number(filters.categoryId) === c.id}
                        onChange={() => setFilters({...filters, categoryId: c.id})}
                        className="accent-blue-600"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-bold mb-3">Thương hiệu</h3>
                <select 
                  value={filters.brand} 
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-bold mb-3">Khoảng giá</h3>
                <div className="flex gap-2 items-center mb-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full border px-3 py-2 rounded-lg text-sm"
                  />
                </div>
              </div>

              <button 
                onClick={applyFilters} 
                className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* --- MAIN CONTENT (Product Grid) --- */}
          <main className="lg:w-3/4">
            {/* Toolbar Mobile */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <span className="font-medium text-gray-600">{products.length} sản phẩm</span>
              <button 
                onClick={() => setShowFilter(true)} 
                className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow-sm"
              >
                <Filter size={18} /> Bộ lọc
              </button>
            </div>

            {/* Desktop Count */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kết quả tìm kiếm</h2>
              <span className="text-gray-500">{products.length} sản phẩm được tìm thấy</span>
            </div>

            {/* Loading & Error */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
                {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                <button onClick={() => { setFilters({keyword:'', brand:'', minPrice:'', maxPrice:'', categoryId:''}); navigate('?'); }} className="mt-4 text-blue-600 hover:underline">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="transition-transform hover:-translate-y-1 duration-300">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default Category;