import productsData from '../data/products.json';
import ProductCard from './ProductCard';
import SwiperSlider from './SwiperSlider';

const featuredCategories = [
  { key: 'phones', title: 'Điện thoại nổi bật', description: 'Những mẫu điện thoại cao cấp mới nhất' },
  { key: 'laptops', title: 'Laptop mạnh mẽ', description: 'Hiệu năng hàng đầu cho công việc và giải trí' },
  { key: 'tablets', title: 'Tablet đa dụng', description: 'Thiết bị gọn nhẹ cho mọi nhu cầu' },
];

function ProductsList() {
  return (
    <section id="products" className="mx-auto max-w-6xl space-y-20 px-6 py-16">
      <h2 className="text-center text-4xl font-bold tracking-wider font-Bebas">Sản phẩm nổi bật</h2>

      {featuredCategories.map(({ key, title, description }) => {
        const items = productsData[key];

        return (
          <div key={key} className="space-y-8">
            <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-3xl font-semibold text-slate-900">{title}</h3>
                <p className="text-slate-500">{description}</p>
              </div>
              <a
                href={`/category#${key}`}
                className="text-sm font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-800"
              >
                Xem toàn bộ danh mục
              </a>
            </header>

            <div className="grid gap-6 md:grid-cols-3">
              {items.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <SwiperSlider items={items} />
          </div>
        );
      })}
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