import Head from 'next/head';
import { useIntl } from 'react-intl';

export default function SeoHead({ content }) {
  const intl = useIntl();
  return (
    <Head>
      <title>
        {content?.translations
          ? content.translations[0].seo_title ||
            intl.formatMessage({ id: 'default.title' })
          : intl.formatMessage({ id: 'default.title' })}
      </title>
      <meta
        name="description"
        content={
          content?.translations
            ? content.translations[0].seo_descr ||
              intl.formatMessage({ id: 'default.description' })
            : intl.formatMessage({ id: 'default.description' })
        }
      />
    </Head>
  );
}
