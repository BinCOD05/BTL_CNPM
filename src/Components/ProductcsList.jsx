import SwiperSlider from "./SwiperSlider";
import { Link } from "react-router-dom";
function ProductsList(){
    return(
        <>
        <section id="Products" className="p-10 max-w-7xl mx-auto ">
            <h2 className="text-3xl font-bold text-center mb-12 font-Bebas tracking-wider">Populars</h2>
            <div className="py-[12px] h-[336px] px-5 rounded-3xl  border-zinc-700 border-[3px] overflow-hidden">
                <h1 className="mb-4 mx-10 text-3xl font-bold font-Roboto">Điện thoại</h1>
                <div className="w-full h-full mx-[50px] relative">
                     <SwiperSlider/>
                    <Link to="/Category">
                    <div className=" group text-black  absolute w-[180px] h-auto mt-4 p-1.5 text-xl transition-all duration-500    font-bold">
                         <div className="absolute left-0 z-0 group-hover:w-full w-0 h-full bg-black rounded-se-full  transition-all duration-700"></div>
                        <h1 className="group-hover:text-white relative z-10 ">View more</h1>
                        
                    </div>
                    </Link>
                </div>
               
            </div>
        </section>
        </>
    )
}
export default ProductsList;