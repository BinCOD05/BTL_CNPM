import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductsList from './ProductList';
import ServicesSection from './Service';
import SearchFilter from './SearchFilter';
import { ArrowRight } from 'lucide-react';

function HeroSection({ tiles = [] }) {
  return (
    <section className="relative min-h-[550px] flex items-center bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* Background Blobs (Trang trí nhẹ) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-slate-900">
              Công Nghệ <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Cho Tương Lai
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Trải nghiệm mua sắm thiết bị công nghệ chính hãng với mức giá tốt nhất và dịch vụ hậu mãi 5 sao.
            </p>
            <div className="flex justify-center lg:justify-start gap-4 pt-2">
                <button onClick={() => document.getElementById('products').scrollIntoView({behavior: 'smooth'})} className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                    Mua ngay <ArrowRight size={18} />
                </button>
            </div>
          </div>

          {/* Image Grid (Tiles) */}
          <div className="relative hidden lg:block">
            {tiles.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 transform rotate-6 hover:rotate-0 transition-transform duration-700 ease-out">
                    {tiles.slice(0, 6).map((tile, i) => (
                        <div key={i} className={`rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 aspect-square ${i % 2 === 0 ? 'translate-y-4' : '-translate-y-4'}`}>
                            <img src={tile.image} alt={tile.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"/>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-64 w-full bg-gray-100 rounded-2xl animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const [tiles, setTiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // ... (Giữ nguyên logic fetchTiles của bạn)
    const fetchTiles = async () => {
        try {
            const res = await fetch('http://localhost:8081/api/products?page=0&size=50'); // Giảm size xuống 50 cho nhẹ
            if (!res.ok) return;
            const data = await res.json();
            const all = data.result?.content || data.result || [];
            
            // Hardcode 1 số ảnh đẹp nếu không có ảnh sản phẩm để UI demo đẹp hơn
            const demoImages = [
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
                'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=80'
            ];

            const keys = [
                { key: 'iphone', title: 'iPhone', img: demoImages[0] },
                { key: 'mac', title: 'MacBook', img: demoImages[1] },
                { key: 'watch', title: 'Watch', img: demoImages[2] },
                { key: 'samsung', title: 'Samsung', img: demoImages[3] },
                { key: 'ipad', title: 'iPad', img: demoImages[4] },
                { key: 'airpod', title: 'AirPods', img: demoImages[5] },
            ];

            const found = keys.map(k => {
                const p = all.find(x => (x.brandName || '').toLowerCase().includes(k.key) || (x.name || '').toLowerCase().includes(k.key));
                // Ưu tiên ảnh thật, nếu ko có thì dùng ảnh demo Unsplash
                return { 
                    key: k.key, 
                    title: k.title, 
                    image: p?.thumbnailUrl || p?.image || k.img 
                };
            });
            setTiles(found);
        } catch (e) { console.error(e); }
    };
    fetchTiles();
  }, []);

  return (
    <div className="bg-white text-slate-900 font-Roboto">
      <HeroSection tiles={tiles} />
      
     

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <SearchFilter onSearch={(p) => {
            const params = new URLSearchParams();
            if (p.keyword) params.set('keyword', p.keyword);
            navigate(`/category?${params.toString()}`);
          }} />
        </div>
      </div>

      <ProductsList />
       <div className="border-b border-gray-100">
        <ServicesSection />
      </div>
    </div>
  );
}

export default HomePage;