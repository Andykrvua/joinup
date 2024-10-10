import styles from './topCountry.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from 'utils/blurImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import 'swiper/css';

export default function TopCountry({ data }) {
  return (
    <div className={styles.topcountry}>
      <h4 className={`${styles.title} container desktop-h2 text-balance`}>
        <span className="mark-orange">
          <FM id="main.topcountry.title.part1" /> {data.length}{' '}
        </span>
        <FM id="main.topcountry.title.part2" />
      </h4>

      <Swiper
        className={styles.swiper_container}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        // centeredSlides={true}
        // slidesPerGroupSkip={1}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            slidesPerView: 2,
            slidesPerGroup: 2,
          },
          768: {
            slidesPerView: 'auto',
            slidesOffsetBefore: 70,
            slidesOffsetAfter: 70,
            slidesPerGroup: 4,
          },
          1100: {
            slidesPerView: 'auto',
            slidesOffsetBefore: 70,
            slidesOffsetAfter: 70,
            slidesPerGroup: 3,
          },
          1456: {
            slidesPerView: 'auto',
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
          },
        }}
        onSlideChange={() => console.log('slide change')}
      >
        {/* onSwiper={(swiper) => console.log(swiper)} */}
        {data.map((item) => (
          <SwiperSlide key={item.code} className={styles.slide}>
            <Link href={`${links.countries}/${item.slug}`}>
              <a className={styles.slide_link}>
                <Image
                  className={styles.img}
                  src={`${process.env.NEXT_PUBLIC_API_img}${item.img}`}
                  alt={item.translations[0].name}
                  width={50}
                  height={50}
                  quality={100}
                  objectPosition="center"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 360))}`}
                />
                <h5 className={`${styles.item_title} one-line`}>{item.translations[0].name}</h5>
              </a>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
