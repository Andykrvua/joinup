import styles from './blogCard.module.css';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import { shimmer, toBase64 } from 'utils/blurImage';
import Image from 'next/image';

export default function BlogCard({ post }) {
  console.log(post);
  return (
    <Link href="/">
      <a className={styles.blogCard}>
        width={180}
        height={180}
        <Image
          className={`${styles.img} br-20`}
          src={`${process.env.NEXT_PUBLIC_API_img}d2c70beb-15f3-4eef-8aa7-7bfd40906675.jpg`}
          alt="Танзанія"
          layout="fill"
          quality={100}
          objectPosition="center"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 360))}`}
        />
        <h5 className={styles.slide}>Танзанія</h5>
        <time datetime="2018-07-07">2018-07-07</time>
      </a>
    </Link>
  );
}
