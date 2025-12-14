import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard';

function SwiperSlider({ items = [], slidesPerView = { default: 1, md: 2, lg: 3 } }) {
	if (!Array.isArray(items)) items = [];

	return (
		<Swiper
			modules={[Navigation, Pagination]}
			spaceBetween={24}
			slidesPerView={1.25}
			navigation
			pagination={{ clickable: true }}
			breakpoints={{
				768: { slidesPerView: slidesPerView.md || 2 },
				1024: { slidesPerView: slidesPerView.lg || 3 },
				1280: { slidesPerView: slidesPerView.xl || 3 },
			}}
			className="!pb-12"
		>
			{items.map((product) => (
				<SwiperSlide key={product.id || product.name} className="h-auto">
					<ProductCard product={product} />
				</SwiperSlide>
			))}
		</Swiper>
	);
}

export default SwiperSlider;