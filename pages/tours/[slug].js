import MainForm from '/components/mainform/mainForm.js';
import { getAllToursTextPages, getToursTextPage } from 'utils/fetch';
import SeoHead from '/components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import Post from '/components/blog/post.js';
import { location } from 'utils/constants';
import LinksBlock from 'components/tours/tours-text/links';
import { links } from 'utils/links';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';

export default function Tours({ toursTextPage, allLinks, slug, loc }) {
  const intl = useIntl();
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  // all false if country slug not found
  const searchSlug = allLinks.map((item) => item.slug === slug);

  const br_arr = [
    { url: links.tours, title: intl.formatMessage({ id: 'tour.br' }) },
    { title: toursTextPage?.translations[0].name },
  ];

  const style = {
    margin: 'var(--h1margin) 0',
    fontSize: '20px',
    lineHeight: '23px',
    fontWeight: 700,
  };

  return (
    <>
      <SeoHead content={toursTextPage} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} beforeMainFrom />
          <h2 style={style}>{toursTextPage.translations[0].h1}</h2>
          <MainForm />
          {/* <LinksBlock allLinks={allLinks} /> */}
          {/* <Post variant={location.postContent.tourPage} post={toursTextPage} /> */}
          <Post post={toursTextPage} variant={location.postContent.countryPage} />
          <LinksBlock allLinks={allLinks} />
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const allLinks = await getAllToursTextPages();

  const paths = [];
  allLinks.data.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.slug },
        locale,
      });
    });
  });
  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const loc = context.locale;
  const slug = context.params.slug;

  const toursTextPage = await getToursTextPage(loc, slug);
  const allLinks = await getAllToursTextPages(loc);
  if (allLinks.errors || toursTextPage.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', allLinks?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', toursTextPage?.errors);
    throw new Error('ERROR TOURS SLUG');
  }

  return {
    props: {
      toursTextPage: toursTextPage.data[0] || null,
      allLinks: allLinks.data,
      slug,
      loc,
    },
    revalidate: 30,
  };
}
