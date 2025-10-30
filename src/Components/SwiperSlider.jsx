import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
// Import Swiper styles
import 'swiper/css';

export default () => {
  return (
    <Swiper
      spaceBetween={ 50 }
      slidesPerView={4}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <Link to="/Product/1">
            <div className='w-[200px] h-[200px] rounded-xl overflow-hidden relative group ' >
                    <img src="/public/images/img.jpg" alt="" />
                    <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                        <h2>Product Title</h2>
                        <p>$99.99</p>
                        
                    </div>
                    <div className='group group-hover:-translate-y-2 absolute bottom-0 right-0 m-2 mb-2 bg-black rounded-3xl  cursor-pointer group-hover:bg-slate-200 transition-all duration-500'>
                        <h1 className='block  group-hover:text-black/80  text-xl font-bold text-white p-2'>Cart+</h1>
                    </div>

            </div>
        </Link>
      </SwiperSlide>

    <SwiperSlide>
        <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
                <img src="/public/images/img.jpg" alt="" />
                <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                    <h2>Product Title</h2>
                    <p>$99.99</p>
                    
                </div>
                <div className='absolute bottom-0 right-0 m-2 mb-2'>
                    <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
                </div>

        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
                <img src="/public/images/img.jpg" alt="" />
                <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                    <h2>Product Title</h2>
                    <p>$99.99</p>
                    
                </div>
                <div className='absolute bottom-0 right-0 m-2 mb-2 '>
                    <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
                </div>

        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
                <img src="/public/images/img.jpg" alt="" />
                <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                    <h2>Product Title</h2>
                    <p>$99.99</p>
                    
                </div>
                <div className='absolute bottom-0 right-0 m-2 mb-2'>
                    <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
                </div>

        </div>
      </SwiperSlide>
        <SwiperSlide>
        <div className='w-[200px] h-[200px] bg-orange-500 rounded-xl overflow-hidden relative'>
                <img src="/public/images/img.jpg" alt="" />
                <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                    <h2>Product Title</h2>
                    <p>$99.99</p>
                    
                </div>
                <div className='absolute bottom-0 right-0 m-2 mb-2'>
                    <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
                </div>

        </div>
      </SwiperSlide>
        <SwiperSlide>
        <div className='w-[200px] h-[200px] bg-orange-500 rounded-lg overflow-hidden relative'>
                <img src="/public/images/img.jpg" alt="" />
                <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                    <h2>Product Title</h2>
                    <p>$99.99</p>
                    
                </div>
                <div className='absolute bottom-0 right-0 m-2 mb-2'>
                    <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
                </div>

        </div>
      </SwiperSlide>
        <SwiperSlide>
        <div className='w-[200px] h-[200px] bg-orange-500 rounded-lg overflow-hidden relative'>
                <img src="/public/images/img.jpg" alt="" />
                <div className='z-50 absolute bottom-0 py-2 px-2 text-white text-center font-Marker'>
                    <h2>Product Title</h2>
                    <p>$99.99</p>
                    
                </div>
                <div className='absolute bottom-0 right-0 m-2 mb-2'>
                    <h1 className='block bg-black rounded-3xl   text-xl font-bold text-white p-2'>Cart+</h1>
                </div>

        </div>
      </SwiperSlide>
    </Swiper>
  );
};