import styles from './blog.module.css';
import Carousel from '../common/carousel/carousel';
import { carouselInstance } from '../../utils/constants';
import Blogcard from '../common/blogCard';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Blog({ data }) {
  return (
    <div className={styles.blog}>
      <h4 className={`${styles.title} desktop-h2 text-center`}>
        {/* <FM id="main.topcountry.title.part2" /> */}
        Новини від JoinUp
      </h4>
      <Swiper
        className={styles.swiper_container}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: '2',
          },
          1100: {
            slidesPerView: '3',
          },
          1456: {
            slidesPerView: '3',
          },
        }}
      >
        {data.map((post, ind) => (
          <SwiperSlide className={`${styles.slide}`} key={ind}>
            <Blogcard post={post} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Carousel data={data} instance={carouselInstance.blog} />
      <Link href={links.blog}>
        <a className={styles.blog_link}>
          <FM id="blog.links" />
        </a>
      </Link>
    </div>
  );
}
