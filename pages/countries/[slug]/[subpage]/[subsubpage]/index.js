import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useRouter } from 'next/router';
import {
  getCountryFromSlug,
  getCountrySlugsAndSubpagesSlugs,
  getCountrySubpageSlug,
  getCountrySubSubpageSlug,
  getCountrySubpagesSlugs,
} from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import MainForm from '/components/mainform/mainForm.js';
import H1 from 'components/country/countryPageH1';
import CountryPageContent from 'components/country/countryPageContent';

export default function CountrySubSubPage({
  country,
  slug,
  subpage,
  subsubpage,
  loc,
  countrySubpage,
  countrySubSubpage,
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

  const searchSlug = countrySubpages.map((item) => item.subsubpage_slug === subsubpage);
  const br_arr = [
    {
      url: links.countries,
      title: intl.formatMessage({ id: 'links.countries' }),
    },
    { url: `${links.countries}/${slug}`, title: country?.translations[0].name },
    {
      url: `${links.countries}/${slug}/${subpage}`,
      title: countrySubpage?.translations[0].br,
    },
    {
      title: countrySubSubpage.district_from_cities
        ? `${intl.formatMessage({
            id: 'country.tours_from',
          })} ${countrySubSubpage?.translations[0].br}`
        : countrySubSubpage?.translations[0].br,
    },
  ];

  return (
    <>
      <SeoHead content={countrySubSubpage} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} beforeMainFrom />
          {countrySubSubpage.translations[0].h1 && <H1>{countrySubSubpage.translations[0].h1}</H1>}
          <MainForm />
          <CountryPageContent
            country={countrySubSubpage}
            loc={loc}
            subpagesSlugs={countrySubpages}
            subsubpage
            subpagesFromCities={districtSubpagesFromCities}
          />
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const subsubpageField = true;
  const countrySlugsAndSubpagesSlugs = await getCountrySlugsAndSubpagesSlugs(subsubpageField);

  const paths = [];
  countrySlugsAndSubpagesSlugs.data.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: {
          slug: item.country_slug.slug,
          subpage: item.subpage_slug,
          subsubpage: item.subsubpage_slug,
        },
        locale,
      });
    });
  });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const subpage = context.params.subpage;
  const subsubpage = context.params.subsubpage;
  const loc = context.locale;

  const country = await getCountryFromSlug(slug, loc);
  const countrySubpage = await getCountrySubpageSlug(slug, subpage, loc);
  const countrySubSubpage = await getCountrySubSubpageSlug(slug, subpage, subsubpage, loc);
  const countrySubpages = await getCountrySubpagesSlugs(slug);

  if (country.errors || countrySubpage.errors || countrySubpages.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', country?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', countrySubpage?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', countrySubpages?.errors);
    throw new Error('ERROR COUNTRY SLUG SUBPAGE SUBSUBPAGE');
  }

  return {
    props: {
      country: country.data[0] || null,
      slug,
      subpage,
      subsubpage,
      loc,
      countrySubpage: countrySubpage.data.filter((item) => !item.subsubpage_slug)[0] || null,
      countrySubSubpage: countrySubSubpage.data.filter((item) => !item.subdistrict_slug)[0] || null,
      countrySubpages: countrySubpages.data || null,
      districtSubpagesFromCities: countrySubpages.data.filter((item) => item.district_from_cities) || null,
    },
    revalidate: 30,
  };
}
