import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { links } from 'utils/links';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { blogApi } from 'utils/constants';
import { getCategoriesSlug, getPostsFromCategory, getCategories, getCountries } from 'utils/fetch';
import { GetLangField } from 'utils/getLangField';

export default function Category({ postsList, categoryList, loc, current, slug, countryList }) {
  const intl = useIntl();

  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  let name;
  categoryList.map((item) => {
    if (item.slug === slug) {
      return (name = GetLangField(item.translations, 'languages_id', 'name', loc));
    }
  });

  // if el > 1, last el need only title
  const br_arr = [
    { url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) },
    {
      url: `${links.blog}/category/${slug}`,
      title: name,
    },
    { title: intl.formatMessage({ id: 'page' }) + ' ' + current },
  ];

  const tagsCountryListItems = [
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
    { code: 'CH', title: 'Швейцария', count: 5, url: '/' },
    { code: 'BG', title: 'Болгария', count: 4, url: '/' },
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
    { code: 'CN', title: 'Китай', count: 17, url: '/' },
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
    { code: 'AE', title: 'ОАЭ', count: 2, url: '/' },
    { code: 'CH', title: 'Швейцария', count: 5, url: '/' },
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
  ];

  const pagesCount = Math.ceil(postsList?.meta?.filter_count / blogApi.announceLimit);

  return (
    <>
      <Head>
        <title>Anex Main</title>
        <meta name="description" content="Anex Main" />
      </Head>
      {!router.isFallback && (!postsList?.meta || pagesCount < current) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <BlogContent
          br_arr={br_arr}
          categoryListItems={categoryList}
          countryListItems={countryList}
          postsList={postsList}
          loc={loc}
          curr={current}
          pagesCount={pagesCount}
          firstPageUrl={`${links.blog_category}/${slug}`}
        />
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const objCatSlug = await getCategoriesSlug();

  if (objCatSlug.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', objCatSlug.errors);
    throw new Error('ERROR BLOG CAT SLUG');
    // return {
    //   notFound: true,
    // };
  }
  const rawCatSlugs = objCatSlug.data;

  for (let i = 0; i < rawCatSlugs.length; i++) {
    const pagesCount = Math.ceil(rawCatSlugs[i].posts.length / blogApi.announceLimit);

    rawCatSlugs[i].posts = [];

    Array(pagesCount)
      .fill(null)
      .map((_, ind) => {
        return rawCatSlugs[i].posts.push(ind + 2);
      });
    rawCatSlugs[i].posts.pop();
  }

  const paths = [];
  rawCatSlugs.map((item) => {
    return item.posts.map((posts) => {
      return locales.map((locale) => {
        return paths.push({
          params: { slug: item.slug, page: posts.toString() },
          locale,
        });
      });
    });
  });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const { page, slug } = context.params;

  if (isNaN(page)) {
    return {
      notFound: true,
    };
  }

  const loc = context.locale;

  const postsList = await getPostsFromCategory(slug, page);
  const resCategoryList = await getCategories();
  const resCountryList = await getCountries();

  if (postsList.errors || resCategoryList.errors || resCountryList.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCategoryList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCountryList.errors);
    throw new Error('ERROR BLOG CAT SLUG2');
    // return {
    //   notFound: true,
    // };
  }

  const categoryList = resCategoryList.data;
  const countryList = resCountryList.data;

  return {
    props: { postsList, categoryList, loc, current: page, slug, countryList },
    revalidate: 30,
  };
}
