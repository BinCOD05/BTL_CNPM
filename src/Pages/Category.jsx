import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import productsData from '../data/products.json';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Category() {
  const query = useQuery();
  const keyword = query.get('keyword') || '';
  const brandParam = query.get('brand') || '';
  const minPriceParam = query.get('minPrice') || '';
  const maxPriceParam = query.get('maxPrice') || '';
  const sizeParam = query.get('size') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterKeyword, setFilterKeyword] = useState(keyword);
  const [filterBrand, setFilterBrand] = useState(brandParam);
  const [filterMin, setFilterMin] = useState(minPriceParam);
  const [filterMax, setFilterMax] = useState(maxPriceParam);

  const navigate = useNavigate();

  const variantKey = (keyword || brandParam || '').toString().toLowerCase();
  const isHeaderVariant = ['mac', 'iphone', 'samsung', 'ipad'].some(k => variantKey.includes(k));

  // featured product image for hero (use first fetched product if available)
  const featured = products && products.length > 0 ? products[0] : null;
  const featuredImage = featured?.image || featured?.productImage || featured?.thumbnail || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const size = sizeParam || 48;
        const url = `http://localhost:8081/api/products?keyword=${encodeURIComponent(keyword)}&brand=${encodeURIComponent(brandParam)}&size=${size}&minPrice=${minPriceParam}&maxPrice=${maxPriceParam}`;
        const res = await fetch(url, { headers });
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
  }, [keyword, brandParam, minPriceParam, maxPriceParam, sizeParam]);

  // derive brand options from local data as a fallback source
  const brandOptions = (() => {
    try {
      const lists = Object.values(productsData).flat();
      const set = new Set();
      lists.forEach(p => { if (p.brand) set.add(p.brand); });
      return Array.from(set).sort();
    } catch (e) {
      return [];
    }
  })();

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filterKeyword) params.set('keyword', filterKeyword);
    if (filterBrand) params.set('brand', filterBrand);
    if (filterMin) params.set('minPrice', filterMin);
    if (filterMax) params.set('maxPrice', filterMax);
    if (sizeParam) params.set('size', sizeParam);
    navigate(`?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-white pb-20 pt-10">
      {/* Variant hero / landing header per brand/keyword */}
      {(() => {
        const v = (keyword || brandParam || '').toString().toLowerCase();
        if (v.includes('mac')) {
          return (
            <section className="relative py-16 mb-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg mx-6 md:mx-12 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-sm uppercase tracking-widest text-slate-300">Mac</h2>
                    <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Mac — Hiệu năng chuyên nghiệp</h1>
                    <p className="mt-4 text-lg text-slate-200">Hiệu năng mạnh mẽ cho sáng tạo và công việc chuyên sâu. Tìm các model MacBook, Mac mini và phụ kiện chính hãng.</p>
                  </div>
                  <div className="w-full md:w-96 h-56 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={featuredImage || '/public/images/mac-hero.jpg'} alt="mac" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </section>
          );
        }
        if (v.includes('iphone') || v.includes('iphone')) {
          return (
            <section className="relative py-16 mb-8 bg-white rounded-lg mx-6 md:mx-12 px-6 shadow-sm">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-sm uppercase tracking-widest text-blue-600">iPhone</h2>
                  <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">iPhone — Nâng cấp trải nghiệm</h1>
                  <p className="mt-4 text-lg text-slate-600">Camera, chip và thiết kế mới. Tìm model phù hợp cùng phụ kiện và bảo hành chính hãng.</p>
                </div>
                <div className="w-full md:w-96 h-56 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={featuredImage || '/public/images/iphone-hero.jpg'} alt="iphone" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>
          );
        }
        if (v.includes('samsung')) {
          return (
            <section className="relative py-16 mb-8 bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-lg mx-6 md:mx-12 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h2 className="text-sm uppercase tracking-widest text-sky-200">Samsung</h2>
                    <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">Samsung — Đổi mới công nghệ</h1>
                    <p className="mt-4 text-lg text-sky-100">Màn hình tuyệt vời, camera sáng tạo và trải nghiệm toàn diện. Khám phá Galaxy series và thiết bị Samsung.</p>
                  </div>
                  <div className="w-full md:w-96 h-56 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={featuredImage || '/public/images/samsung-hero.jpg'} alt="samsung" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </section>
          );
        }
        if (v.includes('ipad') || v.includes('ipad')) {
          return (
            <section className="relative py-16 mb-8 bg-white rounded-lg mx-6 md:mx-12 px-6 shadow-sm">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-sm uppercase tracking-widest text-purple-600">iPad</h2>
                  <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-slate-900">iPad — Sáng tạo & Di động</h1>
                  <p className="mt-4 text-lg text-slate-600">Hiệu suất cho sáng tạo, học tập và làm việc. Xem iPad Pro, Air và phụ kiện tương thích.</p>
                </div>
                <div className="w-full md:w-96 h-56 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={featuredImage || '/public/images/ipad-hero.jpg'} alt="ipad" className="w-full h-full object-cover" />
                </div>
              </div>
            </section>
          );
        }

        return (
          <section className="relative py-12 hero-bg mb-8">
            <div className="hero-pattern absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
            <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
              <p className="text-sm uppercase tracking-widest text-blue-600">Khám phá</p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">{keyword ? `Kết quả: "${keyword}"` : 'Danh mục sản phẩm'}</h1>
              <p className="mt-4 text-base text-slate-600">{keyword ? `Tìm thấy ${products.length} sản phẩm` : 'Chọn thương hiệu hoặc danh mục để bắt đầu.'}</p>
            </div>
          </section>
        );
      })()}

      {/* Filter strip: keyword, brand, min/max price (select-only) */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <input
            value={filterKeyword}
            onChange={e => setFilterKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên sản phẩm"
            className="w-full md:flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          {!isHeaderVariant && (
            <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} className="w-full md:w-52 px-3 py-3 border border-gray-200 rounded-lg bg-white">
              <option value="">Tất cả hãng</option>
              {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          )}

          <select value={filterMin} onChange={e => setFilterMin(e.target.value)} className="w-40 px-3 py-3 border border-gray-200 rounded-lg bg-white">
            <option value="">Min giá</option>
            <option value="0">Tất cả</option>
            <option value="1000000">≥ 1.000.000 đ</option>
            <option value="5000000">≥ 5.000.000 đ</option>
            <option value="10000000">≥ 10.000.000 đ</option>
          </select>

          <select value={filterMax} onChange={e => setFilterMax(e.target.value)} className="w-40 px-3 py-3 border border-gray-200 rounded-lg bg-white">
            <option value="">Max giá</option>
            <option value="500000">≤ 500.000 đ</option>
            <option value="1000000">≤ 1.000.000 đ</option>
            <option value="5000000">≤ 5.000.000 đ</option>
            <option value="10000000">≤ 10.000.000 đ</option>
            <option value="9999999999">Không giới hạn</option>
          </select>

          <div className="ml-auto md:ml-0">
            <button onClick={applyFilters} className="px-4 py-3 bg-gray-900 text-white rounded-lg">Áp dụng</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 mt-6">
        {loading && <div className="text-center py-20">Đang tải...</div>}
        {error && <div className="text-center py-6 text-red-500">Lỗi: {error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Category;