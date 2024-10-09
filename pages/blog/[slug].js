import { useIntl, FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';
import { getPostsSlugs, getPostFromSlug, getLastPost } from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import PostContent from 'components/blog/post';
import Carousel from '/components/common/carousel/carousel';
import { carouselInstance } from '/utils/constants';
import PostSeoHead from '/components/common/seoHead/postSeoHead.js';

export default function Post({ post, postsList, loc, postsSlugs, slug }) {
  const intl = useIntl();
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  const searchSlug = postsSlugs.data.map((item) => item.slug === slug);

  const br_arr = [
    { url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) },
    { title: post?.translations[0].title },
  ];

  return (
    <>
      <PostSeoHead content={post} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} />
          <PostContent post={post} loc={loc} />
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const postsSlugs = await getPostsSlugs();

  const paths = [];
  postsSlugs.data.map((item) => {
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
  const slug = context.params.slug;
  const loc = context.locale;

  const post = await getPostFromSlug(slug, loc);
  const limit = 3;
  const postsList = await getLastPost(limit, loc, slug);
  const postsSlugs = await getPostsSlugs();

  if (post.errors || postsList.errors || postsSlugs.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', post?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', postsSlugs?.errors);
    throw new Error('ERROR BLOG SLUG');
    // return {
    //   notFound: true,
    // };
  }

  return {
    props: {
      post: post.data[0] || null,
      postsList: postsList.data,
      loc,
      postsSlugs,
      slug,
    },
    revalidate: 30,
  };
}
