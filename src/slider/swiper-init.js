import { Swiper } from 'swiper';
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules';

export function SwiperInit( container, options = {} ) {
	const parameters = {
		autoplay: options?.autoplay ?? true,
		centeredSlides: options?.centerSlides ?? false,
		createElements: true,
		grabCursor: options?.grabCursor ?? true,
		initialSlide: 0,
		keyboard: true,
		modules: [ Autoplay, Keyboard, Navigation, Pagination ],
		navigation: options?.navigation ?? false,
		pagination: options?.pagination ?? false,
		simulateTouch: options?.simulateTouch ?? true,
		slidesPerView: options?.slidesPerView ?? 3,
		spaceBetween: 30,
		loop: true
	};

	return new Swiper( container, parameters );
}
