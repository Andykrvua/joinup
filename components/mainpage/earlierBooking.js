import styles from './earlierBooking.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from 'utils/blurImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { links } from 'utils/links';
import 'swiper/css';

const SimpleCard = () => {
  return (
    <Link href="/">
      <a className={styles.slide_card}>
        <Image
          className={`${styles.img} br-20`}
          src={`${process.env.NEXT_PUBLIC_API_img}d2c70beb-15f3-4eef-8aa7-7bfd40906675.jpg`}
          alt="Танзанія"
          width={180}
          height={180}
          quality={100}
          objectPosition="center"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 360))}`}
        />
        <h5>Танзанія</h5>
        <button className="orange-btn">26 219 ₴</button>
      </a>
    </Link>
  );
};

export default function EarlierBooking() {
  return (
    <div className={`${styles.earlier_booking} br-20`}>
      <img className={styles.line_bg} src="/assets/img/svg/line-bg.svg" aria-hidden alt="" />
      <div className={styles.text_content}>
        <h4 className={`${styles.title} desktop-h2 text-balance`}>Бронюйте подорож заздалегідь</h4>
        <p className={`${styles.descr} desktop-subtitle`}>
          Економте на покупці туру до 50% вартості. Бронюйте зараз!
        </p>
        <Link href="/">
          <a className={`${styles.text_content_btn} desktop-button`}>Обрати тур</a>
        </Link>
      </div>
      <Swiper className={styles.swiper_container} slidesPerView={'auto'} spaceBetween={20}>
        <SwiperSlide className={`${styles.slide} br-20`}>
          <SimpleCard />
        </SwiperSlide>
        <SwiperSlide className={`${styles.slide} br-20`}>
          <SimpleCard />
        </SwiperSlide>
        <SwiperSlide className={`${styles.slide} br-20`}>
          <SimpleCard />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
