import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import Head from 'next/head';
import Layout from '../components/common/layout';
import '../styles/globals.css';
import uk from '../lang/uk.json';
import ru from '../lang/ru.json';
import { getAllCountriesForNav } from 'utils/fetch';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const messages = {
  uk,
  ru,
};

function App({ Component, pageProps, navData }) {
  const { locale, asPath } = useRouter();

  useEffect(() => {
    TagManager.initialize({ gtmId: 'GTM-PJT8FLD' });
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_API_HOST}${asPath}`}
          hrefLang="ru-ua"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_API_HOST}${asPath}`}
          hrefLang="ru"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_API_HOST}/uk${asPath}`}
          hrefLang="uk-ua"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_API_HOST}/uk${asPath}`}
          hrefLang="uk"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_API_HOST}${asPath}`}
          hrefLang="x-default"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta
          name="google-site-verification"
          content="pyXKl8BzwOVBWBhNCUrAZz8kRfbCIY2wT06cObZDFFQ"
        />
      </Head>
      <Layout navData={navData}>
        <Component {...pageProps} />
      </Layout>
    </IntlProvider>
  );
}

export default App;

App.getInitialProps = async ({ Component, ctx }) => {
  const loc = ctx.locale;
  const resData = await getAllCountriesForNav(loc);
  let navData;
  if (resData.errors || resData.data.length === 0) {
    /* eslint-disable-next-line */
    console.log(resData?.errors);
    navData = null;
  } else {
    navData = resData.data;
  }
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps, navData };
};
