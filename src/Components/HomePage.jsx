import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductsList from './ProductcsList';
import ServicesSection from './Service';
import SearchFilter from './SearchFilter';

function HeroSection({ tiles = [] }) {
  return (
    <section id="hero-banner" className="relative min-h-[520px] hero-bg text-black flex items-center">
      <div className="hero-pattern absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <h1 className="mb-5 text-5xl md:text-7xl font-black   text-black  bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
         bg-clip-text text-transparent">
              Cửa Hàng
            </h1>
            <p className="text-sm mt-2 md:text-base text-gray-600 max-w-lg">
              Thế giới công nghệ tinh giản — chọn lựa kỹ càng, giao nhanh.
            </p>
          </div>

          <div className="order-1 md:order-2 text-right">
            <div className="max-w-xs ml-auto text-right">
              <p className="text-sm text-gray-700 font-medium">Tinh giản. Chính hãng. Tận tâm.</p>
              <p className="mt-2 text-xs text-gray-500">Bộ sưu tập tuyển chọn cho cuộc sống hiện đại.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tiles positioned near the bottom of the hero. On md+ they are evenly spaced; on small screens use horizontal scroll. */}
      {tiles && tiles.length > 0 && (
        <>
          <div className="hidden md:block absolute left-0 right-0 bottom-0 z-20">
            <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
              {tiles.map(tile => (
                <a key={tile.key} href={`/Category?keyword=${encodeURIComponent(tile.key)}`} className="flex-1 mx-2 text-center no-underline hover:opacity-95">
                  <div className="mx-auto w-28 h-28 overflow-hidden rounded-md shadow-sm">
                    <img src={tile.image} alt={tile.title} className="w-full h-full object-cover opacity-95" />
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900">{tile.title}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="md:hidden absolute left-0 right-0 bottom-6 z-20">
            <div className="flex gap-4 overflow-x-auto px-6 py-2 no-scrollbar">
              {tiles.map(tile => (
                <a key={tile.key} href={`/Category?keyword=${encodeURIComponent(tile.key)}`} className="w-28 flex-shrink-0 text-center no-underline hover:opacity-95">
                  <div className="w-28 h-28 overflow-hidden rounded-md shadow-sm">
                    <img src={tile.image} alt={tile.title} className="w-full h-full object-cover opacity-95" />
                  </div>
                  <div className="mt-1 text-xs font-medium text-gray-900">{tile.title}</div>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [tiles, setTiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch('http://localhost:8081/api/products?page=0&size=100', { headers });
        if (!res.ok) return;
        const data = await res.json();
        const all = data.result?.content || data.result || [];

        const keys = [
          { key: 'iphone', title: 'iPhone' },
          { key: 'apple', title: 'Apple' },
          { key: 'mac', title: 'Mac' },
          { key: 'ipad', title: 'iPad' },
          { key: 'samsung', title: 'Samsung' },
          { key: 'watch', title: 'Watch' },
          { key: 'airpod', title: 'AirPods' },
        ];

        const found = keys.map(k => {
          const p = all.find(x => (x.brandName || '').toLowerCase().includes(k.key) || (x.name || '').toLowerCase().includes(k.key));
          return { key: k.key, title: k.title, image: p?.thumbnailUrl || p?.image || '/images/img.jpg' };
        });

        setTiles(found);
      } catch (err) {
        console.error('Failed to load tiles', err);
      }
    };

    fetchTiles();
  }, []);

  return (
    <div className="bg-white text-black">
      <HeroSection tiles={tiles} />
      {/* Search & price filter placed under hero/banner — full-width white strip to match page */}
      <div className="w-full bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <SearchFilter onSearch={(p) => {
            const params = new URLSearchParams();
            if (p.keyword) params.set('keyword', p.keyword);
            navigate(`/category?${params.toString()}`);
          }} />
        </div>
      </div>

      <ProductsList />
    </div>
  );
}



export default HomePage;


