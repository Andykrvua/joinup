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
      <a className={styles.blogcard}>
        <Image
          className={`${styles.img} br-20`}
          src={`${process.env.NEXT_PUBLIC_API_img}d2c70beb-15f3-4eef-8aa7-7bfd40906675.jpg`}
          alt={post?.translations[0]?.title}
          layout="fill"
          quality={100}
          objectPosition="center"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 360))}`}
        />
        <div className={styles.text_content}>
          <p className={styles.badge}>{post?.categories[0]?.categories_id?.translations[0]?.name}</p>
          <h5 className={styles.title}>{post?.translations[0]?.title}</h5>
          <time className={styles.time} dateTime="2018-07-07">
            {post?.date_created}
          </time>
        </div>
      </a>
    </Link>
  );
}
