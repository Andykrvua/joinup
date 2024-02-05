import styles from './pageHeader.module.css';
import { FormattedMessage as FM } from 'react-intl';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';

export default function PageHeader({ children = null }) {
  return (
    <>
      <div className={styles.pageheader}>
        <div className={styles.bg}>
          <svg
            width="1920"
            height="428"
            viewBox="0 0 1920 428"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1920 188.97C1537.83 319.3 1391.56 79.0523 1000.48 114.645C687.609 143.118 622.498 402 359.328 402C157.731 402 175.319 150.76 -37 22"
              stroke="url(#paint0_linear_1318_10797)"
              strokeWidth="51"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1318_10797"
                x1="1527.87"
                y1="-55.4656"
                x2="-36.4997"
                y2="469.963"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F46B08" />
                <stop offset="1" stopColor="#F54C09" />
              </linearGradient>
            </defs>
          </svg>
          <div className={styles.bg_img}>
            <Image
              src="/assets/img/fly.webp"
              width={530}
              height={307}
              // alt={item.title}
              aria-hidden
              alt=""
              // layout="fill"
              // objectFit="cover"
              // objectPosition="center"
              quality={100}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(290, 380))}`}
            />
          </div>
        </div>
        <div className="container">
          <h5 className={styles.title}>
            <FM id="common.welcome" />
          </h5>
          <p className={styles.descr}>
            <FM id="common.welcome.descr" />
          </p>
          {children}
        </div>
      </div>
    </>
  );
}
