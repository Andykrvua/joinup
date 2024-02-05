import styles from './cards.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { shimmer, toBase64 } from '/utils/blurImage';
import { useSetModal, useGetPerson, useSetOpenStreetMap, useSetWindowInfo } from 'store/store';
import ratingColor from 'utils/ratingColor';
import declension from 'utils/declension';
import { food, modal, infoModal } from 'utils/constants';

const CardsOffersVariants = ({ hotel, searchParams }) => {
  const router = useRouter();
  const setModal = useSetModal();
  const person = useGetPerson();
  const setOpenStreetMapData = useSetOpenStreetMap();

  const intl = useIntl();
  const tTxt1 = intl.formatMessage({
    id: 'common.night1',
  });
  const tTxt2 = intl.formatMessage({
    id: 'common.night2',
  });
  const tTxt5 = intl.formatMessage({
    id: 'common.night5',
  });

  const decl = (val) => declension(val, tTxt1, tTxt2, tTxt5);

  const data = hotel.actualOffers.reduce((acc, val, ind, arr) => {
    if (ind === 0) {
      acc.push(val);
    } else {
      if (val.pl !== arr[ind - 1].pl) {
        acc.push(val);
      }
    }
    return acc;
  }, []);

  // eslint-disable-next-line
  const foodHelper = new Set(data.map((i) => i.f));
  const foodTxt = Array.from(foodHelper);

  let foodTransMessage = '';
  if (foodTxt.length === 1) {
    foodTransMessage = intl.formatMessage({
      id: food[foodTxt[0]],
    });
    foodTransMessage += ', ';
  }

  const transports = {
    bus: 'hotel_card.transport.bus',
    air: 'hotel_card.transport.air',
    train: 'hotel_card.transport.train',
    ship: 'hotel_card.transport.ship',
  };

  foodTransMessage += `за ${person.adult + person.child} ${
    transports[router.query.transport]
      ? intl.formatMessage({
          id: transports[router.query.transport],
        })
      : ''
  }`;

  const OpenStreetMapBtn = () => {
    if (!hotel.g) {
      return null;
    }

    const modalHandler = () => {
      setOpenStreetMapData({
        img: `https://newimg.otpusk.com/2/400x300/${hotel.f}`,
        hotelName: hotel.n,
        rating: hotel.r,
        foodTransMessage,
        price: new Intl.NumberFormat('uk-UA', {
          style: 'currency',
          currency: 'UAH',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(data[0].pl),
        coords: hotel.g,
        stars: hotel.s,
      });
      setModal({ get: modal.hotelCardsMap });
    };

    return (
      <button onClick={() => modalHandler()} className={styles.maps}>
        <img src="/assets/img/svg/tour/map-marker.svg" alt="map" />
        <span>
          <FM id="hotel_card.map" />
        </span>
      </button>
    );
  };

  const saveToLocalStorage = () => {
    const res = JSON.parse(localStorage.getItem('result') || '[]');

    const item = {
      img: `https://newimg.otpusk.com/2/500x375/${hotel.f}`,
      hotelName: hotel.n,
      stars: parseInt(hotel.s),
      country: hotel.t.n,
      district: hotel.c.n,
      rating: hotel.r,
      reviews: hotel.v,
      description: foodTransMessage,
      orders: [],
      id: hotel.i,
    };

    const offArr = data.map((item, ind) => {
      if (ind < 6) {
        return {
          link: `${router.locale === 'uk' ? '/uk' : ''}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${
            hotel.h
          }?offer=${item.i}&transport=${searchParams.transport}&from=${searchParams.from}&fromname=${
            searchParams.fromname
          }&to=${searchParams.to}&checkIn=${searchParams.checkIn}&checkTo=${searchParams.checkTo}&nights=${
            searchParams.nights
          }&nightsTo=${searchParams.nightsTo}&people=${searchParams.people}`,
          start: new Date(item.d).toLocaleDateString('default', {
            day: '2-digit',
            month: '2-digit',
          }),
          end: new Date(item.dt).toLocaleDateString('default', {
            day: '2-digit',
            month: '2-digit',
          }),
          n: `${item.nh} ${decl(item.nh)}`,
          r: item.r,
          price: new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(item.pl),
          id: item.i,
        };
      }
    });

    item.orders = offArr.slice(0, 6);

    res.push(item);
    localStorage.setItem('result', JSON.stringify(res));
  };
  saveToLocalStorage();

  const saveRatingCookie = () => {
    if (!hotel?.rb) return;

    const items = [];
    Object.entries(hotel.rb).map((el) => {
      if (el[1].site === 'tripadvisor' || el[1].site === 'booking') {
        if (el[1].rating !== 0) {
          items.push(el[1]);
        }
      }
    });

    if (!items.length) return null;

    const data = JSON.stringify(items);
    let expires = '';

    const date = new Date();
    date.setTime(date.getTime() + 3 * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();

    document.cookie = hotel.i + '=' + (data || '') + expires + '; path=/';
  };
  return (
    <>
      <div className={styles.maps_and_options}>
        <OpenStreetMapBtn />
        <p className={styles.options}>{foodTransMessage}</p>
      </div>

      {data.map((item, ind) => {
        if (ind < 4) {
          return (
            <a
              className={styles.card_order}
              onClick={saveRatingCookie}
              href={`${router.locale === 'uk' ? '/uk' : ''}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${
                hotel.h
              }?offer=${item.i}&transport=${searchParams.transport}&from=${searchParams.from}&fromname=${
                searchParams.fromname
              }&to=${searchParams.to}&checkIn=${searchParams.checkIn}&checkTo=${
                searchParams.checkTo
              }&nights=${searchParams.nights}&nightsTo=${searchParams.nightsTo}&people=${
                searchParams.people
              }`}
              target="_blank"
              rel="noopener noreferrer"
              key={item.i}
            >
              <span className={styles.order_text_wrapper}>
                <span className={styles.order_text__duration}>
                  <span>
                    {new Date(item.d).toLocaleDateString('default', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    <FM id="hotel_card.tourstart" />
                  </span>
                </span>
                <span className={styles.order_text__people}>
                  <span>
                    {new Date(item.dt).toLocaleDateString('default', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    <FM id="hotel_card.tourend" />
                  </span>
                </span>
              </span>
              <span className={`${styles.order_text_wrapper}, ${styles.order_text_wrapper__fluid}`}>
                <span className={styles.order_text__duration}>
                  <span>
                    {item.nh} {decl(item.nh)}
                    {item.n - item.nh !== 0
                      ? ` + ${item.n - item.nh} ${intl.formatMessage({
                          id: 'hotel_card.tour_time',
                        })}`
                      : ''}
                  </span>
                </span>
                <span className={styles.order_text__people}>
                  <span>{item.r}</span>
                </span>
              </span>
              <span className={styles.order_price}>
                {new Intl.NumberFormat('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(item.pl)}
                <img src="/assets/img/svg/arrow.svg" alt="" />
              </span>
            </a>
          );
        }
      })}
    </>
  );
};

export default function Cards({ hotels = [], step, countryHotelService = [], searchParams }) {
  const setModalInfo = useSetWindowInfo();
  const intl = useIntl();
  localStorage.removeItem('result');

  const Rating = ({ item }) => {
    if (!item?.rb) return null;

    const items = [];
    Object.entries(item.rb).map((el) => {
      if (el[1].site === 'tripadvisor' || el[1].site === 'booking') {
        if (el[1].rating !== 0) {
          items.push(el[1]);
        }
      }
    });

    if (!items.length) return null;

    return (
      <div className={styles.review}>
        {items.map((el) => {
          return (
            <div className={styles.review_item} key={el.site}>
              <img
                src={`/assets/img/svg/${el.site}.svg`}
                alt={el.site}
                title={el.site}
                width="24"
                height="24"
              />

              <p className={styles.review__number} style={{ color: ratingColor(parseFloat(el.rating)) }}>
                {el.rating}/10
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.cards_wrapper}>
      {hotels.map((item, j) => {
        if (j < step) {
          return (
            <div className={styles.card} key={item.i}>
              <div className={styles.card_img}>
                <Image
                  className={styles.img}
                  src={`https://newimg.otpusk.com/2/500x375/${item.f}`}
                  alt=""
                  layout="fill"
                  // width={500}
                  // height={375}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 375))}`}
                />
                <Rating item={item} />
              </div>
              <div className={styles.card_text}>
                <p className={styles.country_text}>{`${item.t.n}, ${item.c.n}`}</p>
                <div className={styles.stars_wrapper}>
                  {new Array(parseInt(item.s)).fill(null).map((_, ind) => {
                    return (
                      <div className={styles.stars} key={ind}>
                        <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
                      </div>
                    );
                  })}
                </div>
                <h4 className={styles.hotel_name}>{item.n}</h4>
                <div className={styles.tour_propertys}>
                  {item.e.map((property, ind) => {
                    return countryHotelService
                      .map((item) => Object.keys(item))
                      .map((item) => {
                        if (item.includes(property)) {
                          return countryHotelService
                            .map((item) => Object.entries(item))
                            .map((item) =>
                              item.map((searched) => {
                                return searched.includes(property) ? (
                                  <div className={styles.tour_property} key={ind}>
                                    <img
                                      className={styles.tour_property__icon}
                                      src={`/assets/img/svg/tour_property/${searched[0]}.svg`}
                                      alt=""
                                    />
                                    <p className={styles.tour_property__title}>{searched[1]}</p>
                                  </div>
                                ) : null;
                              })
                            );
                        }
                      });
                  })}
                </div>
                <CardsOffersVariants hotel={item} searchParams={searchParams} />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
