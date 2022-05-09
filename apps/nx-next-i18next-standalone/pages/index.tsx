import { GetStaticPropsContext } from 'next';
import styles from './index.module.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import i18nConfig from '../next-i18next.config';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export function Index() {
  const { t } = useTranslation('common');
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <Link href="/" locale="ja">
            ja
          </Link>{' '}
          |{' '}
          <Link href="/" locale="en">
            en
          </Link>
          <div id="welcome">
            <h1>{t('welcome')}👋</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], i18nConfig)),
    },
  };
}
