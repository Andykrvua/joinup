import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useRouter } from 'next/router';
import {
  getCountryFromSlug,
  getCountrySlugsAndSubpagesSlugs,
  getCountrySubpageSlug,
  getCountrySubpagesSlugs,
} from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import MainForm from '/components/mainform/mainForm.js';
import H1 from 'components/country/countryPageH1';
import CountryPageContent from 'components/country/countryPageContent';

export default function CountrySubPage({
  country,
  slug,
  subpage,
  loc,
  countrySubpage,
  countrySubpages,
  districtSubpagesFromCities,
}) {
  const intl = useIntl();
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  const searchSlug = countrySubpages.map((item) => item.subpage_slug === countrySubpage?.subpage_slug);

  const brSubPageTitle = countrySubpage?.temp_from
    ? `${intl.formatMessage({
        id: `month.${countrySubpage?.subpage_slug}`,
      })}`
    : countrySubpage?.is_district
    ? countrySubpage.translations[0]?.br
    : countrySubpage.isNewCity
    ? `${intl.formatMessage({
        id: 'country.tours_from',
      })} ${countrySubpage.translations[0]?.br}`
    : `${intl.formatMessage({
        id: 'country.tours_from',
      })} ${intl.formatMessage({
        id: `country.${countrySubpage?.subpage_slug}`,
      })}`;

  const br_arr = [
    {
      url: links.countries,
      title: intl.formatMessage({ id: 'links.countries' }),
    },
    { url: `${links.countries}/${slug}`, title: country?.translations[0].name },
    {
      title: brSubPageTitle,
    },
  ];

  return (
    <>
      <SeoHead content={countrySubpage} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} beforeMainFrom />
          {countrySubpage.translations[0].h1 && <H1>{countrySubpage.translations[0].h1}</H1>}
          <MainForm />
          <CountryPageContent
            country={countrySubpage}
            loc={loc}
            subpagesSlugs={countrySubpages}
            isDistrict={countrySubpage.is_district}
            subpageSlug={subpage}
            subpagesFromCities={districtSubpagesFromCities}
          />
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const countrySlugsAndSubpagesSlugs = await getCountrySlugsAndSubpagesSlugs();

  const paths = [];
  countrySlugsAndSubpagesSlugs.data.map((item) => {
    return locales.map((locale) => {
      if (item.subsubpage) return;
      return paths.push({
        params: { slug: item.country_slug.slug, subpage: item.subpage_slug },
        locale,
      });
    });
  });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const subpage = context.params.subpage;
  const loc = context.locale;

  const country = await getCountryFromSlug(slug, loc);
  const countrySubpage = await getCountrySubpageSlug(slug, subpage, loc);
  const countrySubpages = await getCountrySubpagesSlugs(slug);

  if (country.errors || countrySubpage.errors || countrySubpages.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', country?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', countrySubpage?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', countrySubpages?.errors);
    throw new Error('ERROR COUNTRY SLUG SUBPAGE');
  }

  return {
    props: {
      country: country.data[0] || null,
      slug,
      subpage,
      loc,
      countrySubpage: countrySubpage.data.filter((item) => item.subsubpage_slug === null)[0] || null,
      countrySubpages: countrySubpages.data.filter((item) => !item.district_from_cities) || null,
      districtSubpagesFromCities:
        countrySubpages.data.filter(
          (item) => item.district_from_cities && item.subpage_slug === subpage && !item.subdistrict_slug
        ) || null,
    },
    revalidate: 30,
  };
}
