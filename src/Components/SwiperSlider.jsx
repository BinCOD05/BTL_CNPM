import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function SwiperSlider({ items }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={24}
      slidesPerView={1.25}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="!pb-12"
    >
      {items.map((product) => (
        <SwiperSlide key={product.id} className="h-auto">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-3">{product.description}</p>
              <div className="mt-auto flex items-center justify-between text-sm">
                <span className="font-semibold text-blue-600">{product.price.toLocaleString('vi-VN')} ₫</span>
                <span className="text-slate-400">{product.brand}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperSlider;


// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Link } from 'react-router-dom';
// // Import Swiper styles
// import 'swiper/css';

// export default () => {
//   return (
//     <Swiper
//       spaceBetween={ 50 }
//       slidesPerView={4}
//       onSlideChange={() => console.log('slide change')}
//       onSwiper={(swiper) => console.log(swiper)}
//     >
//       <SwiperSlide>
//         <Link to="/Product/1">
//             <div className='w-[200px] h-[200px] rounded-xl overflow-hidden relative group ' >
//                     <img src="/public/images/img.jpg" alt="" />
//                     <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                         <h2>Product Title</h2>
//                         <p>$99.99</p>
                        
//                     </div>
//                     <div className='group group-hover:-translate-y-2 absolute bottom-0 right-0 m-2 mb-2 bg-black rounded-3xl  cursor-pointer group-hover:bg-slate-200 transition-all duration-500'>
//                         <h1 className='block  group-hover:text-black/80  text-xl font-bold text-white p-2'>Cart+</h1>
//                     </div>

//             </div>
//         </Link>
//       </SwiperSlide>

//     <SwiperSlide>
//         <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
//                 <img src="/public/images/img.jpg" alt="" />
//                 <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                     <h2>Product Title</h2>
//                     <p>$99.99</p>
                    
//                 </div>
//                 <div className='absolute bottom-0 right-0 m-2 mb-2'>
//                     <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
//                 </div>

//         </div>
//       </SwiperSlide>
//       <SwiperSlide>
//         <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
//                 <img src="/public/images/img.jpg" alt="" />
//                 <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                     <h2>Product Title</h2>
//                     <p>$99.99</p>
                    
//                 </div>
//                 <div className='absolute bottom-0 right-0 m-2 mb-2 '>
//                     <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
//                 </div>

//         </div>
//       </SwiperSlide>
//       <SwiperSlide>
//         <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
//                 <img src="/public/images/img.jpg" alt="" />
//                 <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                     <h2>Product Title</h2>
//                     <p>$99.99</p>
                    
//                 </div>
//                 <div className='absolute bottom-0 right-0 m-2 mb-2'>
//                     <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
//                 </div>

//         </div>
//       </SwiperSlide>
//         <SwiperSlide>
//         <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
//                 <img src="/public/images/img.jpg" alt="" />
//                 <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                     <h2>Product Title</h2>
//                     <p>$99.99</p>
                    
//                 </div>
//                 <div className='absolute bottom-0 right-0 m-2 mb-2'>
//                     <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
//                 </div>

//         </div>
//       </SwiperSlide>
//         <SwiperSlide>
//         <div className='w-[200px] h-[200px] bg-orange-500 rounded-lg overflow-hidden relative'>
//                 <img src="/public/images/img.jpg" alt="" />
//                 <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                     <h2>Product Title</h2>
//                     <p>$99.99</p>
                    
//                 </div>
//                 <div className='absolute bottom-0 right-0 m-2 mb-2'>
//                     <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
//                 </div>

//         </div>
//       </SwiperSlide>
//         <SwiperSlide>
//         <div className='w-[200px] h-[200px] bg-orange-500 rounded-lg overflow-hidden relative'>
//                 <img src="/public/images/img.jpg" alt="" />
//                 <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
//                     <h2>Product Title</h2>
//                     <p>$99.99</p>
                    
//                 </div>
//                 <div className='absolute bottom-0 right-0 m-2 mb-2'>
//                     <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
//                 </div>

//         </div>
//       </SwiperSlide>
//     </Swiper>
//   );
// };