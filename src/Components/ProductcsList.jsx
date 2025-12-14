import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import SwiperSlider from './SwiperSlider';
import { Loader, Zap, Laptop, Tablet } from 'lucide-react';

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
        const size = (searchParams && searchParams.size) ? searchParams.size : 12;
        const minPrice = (searchParams && searchParams.minPrice) ? searchParams.minPrice : '';
        const maxPrice = (searchParams && searchParams.maxPrice) ? searchParams.maxPrice : '';

        const url = `http://localhost:8081/api/products?keyword=${encodeURIComponent(keyword)}&size=${size}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

        const response = await fetch(url, { method: 'GET', headers, credentials: 'include' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const allProducts = data.result?.content || data.result || [];
        
        // Group by category and brand
        const grouped = {
          phones: [],
          laptops: [],
          tablets: []
        };

        const byBrand = {};

        if (Array.isArray(allProducts)) {
          allProducts.forEach(product => {
            // Group by category
            if (product.categoryId === 1) {
              grouped.phones.push(product);
            } else if (product.categoryId === 2) {
              grouped.laptops.push(product);
            } else if (product.categoryId === 3) {
              grouped.tablets.push(product);
            } else {
              grouped.phones.push(product);
            }

            // Group by brand
            const brand = product.brandName || 'Khác';
            if (!byBrand[brand]) {
              byBrand[brand] = [];
            }
            byBrand[brand].push(product);
          });
        }

        setProducts(grouped);
        setGroupedByBrand(byBrand);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts({ phones: [], laptops: [], tablets: [] });
        setGroupedByBrand({});
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl space-y-20 px-6 py-20 bg-slate-950">
        <div className="flex justify-center items-center py-32">
          <div className="text-center">
            <Loader className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-300 font-semibold text-lg">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl space-y-20 px-6 py-20 bg-slate-950">
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-center">
          <p className="text-red-300 font-semibold">Lỗi: {error}</p>
        </div>
      </section>
    );
  }

  const categoryInfo = [
    { key: 'phones', title: '📱 Điện Thoại', description: 'Smartphone cao cấp mới nhất', icon: Zap, color: 'from-blue-600 to-cyan-600' },
    { key: 'laptops', title: '💻 Laptop', description: 'Máy tính xách tay hiệu năng cao', icon: Laptop, color: 'from-purple-600 to-pink-600' },
    { key: 'tablets', title: '📘 Tablet', description: 'Thiết bị bảng di động', icon: Tablet, color: 'from-orange-600 to-red-600' },
  ];

  return (
    <section id="products" className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-Roboto text-4xl font-bold  mx-auto max-w-4xl">
            <span className='bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent'>Những sản phẩm mới nhất
         </span>. Quà này ai cũng mê.</h2>
    
        </div>

        {/* Category Sections (slider per category) */}
        <div className="space-y-20">
          {categoryInfo.map(({ key, title, description, icon: Icon, color }) => {
            const items = (products[key] || []).slice(0, 6);
            if (items.length === 0) return null;

            return (
              <div key={key} className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                  
                    <div>
                      <h3 className="text-xl font-Roboto font-bold">{title.replace('📱','').replace('💻','').replace('📘','')}</h3>
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </div>
                  <a href={`/category#${key}`} className="text-sm font-medium text-gray-700 hover:text-black">Xem tất cả →</a>
                </div>

                {/* Feature (left) + slider (right) layout: image-only feature on left (not clickable), caption links to detail */}
                <div className="mb-8 section-container">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {items[0] && (
                      <div className="md:col-span-1 flex items-start">
                        <div className="w-full overflow-hidden rounded-2xl shadow-sm bg-white h-72 md:h-[420px]">
                          <img src={items[0].thumbnailUrl || items[0].image || '/images/img.jpg'} alt={items[0].name} className="w-full h-full object-cover" />
                          <div className="px-4 py-3">
                            <Link to={`/product/detail/${items[0].id}`} className="text-sm font-semibold text-gray-700 inline-block">Sản phẩm</Link>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <SwiperSlider items={items.slice(1)} slidesPerView={{ default: 1, md: 2, lg: 3 }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand Showcase */}
        {Object.keys(groupedByBrand).length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-200">
            <h3 className="text-4xl md:text-4xl font-Roboto  font-bold  mx-auto max-w-3xl  text-gray-900 text-center "><span className='bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500
         bg-clip-text text-transparent'>Trợ giá và ưu đãi. </span>Khuyến mại độc quyền và nhiều ưu đãi hấp dẫn khác.</h3>

            {Object.entries(groupedByBrand).map(([brand, brandProducts], index) => (
              <div key={brand} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl  font-Roboto font-semibold text-gray-800">{brand}</h4>
                  <span className="text-sm text-gray-500">{brandProducts.length} sản phẩm</span>
                </div>

                {/* Brand list uses same slider + left feature image (non-clickable image, caption links to detail) */}
                <div className="section-container mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {brandProducts[0] && (
                      <div className="md:col-span-1 flex items-start">
                        <div className="w-full overflow-hidden rounded-2xl shadow-sm bg-white h-72 md:h-[420px]">
                          <img src={brandProducts[0].thumbnailUrl || brandProducts[0].image || '/images/img.jpg'} alt={brandProducts[0].name} className="w-full h-full object-cover" />
                          <div className="px-4 py-3">
                            <Link to={`/product/detail/${brandProducts[0].id}`} className="text-sm font-semibold text-gray-700 inline-block">Sản phẩm</Link>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <SwiperSlider items={brandProducts.slice(1, 7)} slidesPerView={{ default: 1, md: 2, lg: 3 }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsList;


// import SwiperSlider from "./SwiperSlider";
// import { Link } from "react-router-dom";
// function ProductsList(){
//     return(
//         <>
//         <section id="Products" className="p-10 max-w-7xl mx-auto ">
//             <h2 className="text-3xl font-bold text-center mb-12 font-Bebas tracking-wider">Populars</h2>
//             <div className="py-[12px] h-[336px] px-5 rounded-3xl  border-zinc-700 border-[3px] overflow-hidden">
//                 <h1 className="mb-4 mx-10 text-3xl font-bold font-Roboto">Điện thoại</h1>
//                 <div className="w-full h-full mx-[50px] relative">
//                      <SwiperSlider/>
//                     <Link to="/Category">
//                     <div className=" group text-black  absolute w-[180px] h-auto mt-4 p-1.5 text-xl transition-all duration-500    font-bold">
//                          <div className="absolute left-0 z-0 group-hover:w-full w-0 h-full bg-black rounded-se-full  transition-all duration-700"></div>
//                         <h1 className="group-hover:text-white relative z-10 ">View more</h1>
                        
//                     </div>
//                     </Link>
//                 </div>
               
//             </div>
//         </section>
//         </>
//     )
// }
// export default ProductsList;