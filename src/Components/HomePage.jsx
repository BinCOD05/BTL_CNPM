import React from 'react'
import ProductsList from './ProductcsList'
import ServicesSection from './Service'
function HeroSection() {
    return (
        <section id='hero-banner' className="relative h-[600px] bg-gradient-to-r from-blue-600 to-black/90">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-wider mb-6 text-center font-Bitcount">
                    Amazing SopPings
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl ">
                    Cách tốt nhất để mua sản phẩm bạn thích.
                </p>
                <a href="#Products" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-500 hover:text-white transition duration-300">
                    Shop Now
                </a>
            </div>
        </section>
    )
}


function HomePage() {
    return (
        <div >
            <HeroSection />
             <ProductsList/>
            <ServicesSection />
            {/* <ProductsSwiper /> */}
           
        </div>
    )
}

export default HomePage