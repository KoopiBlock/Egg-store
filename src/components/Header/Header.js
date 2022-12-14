import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaShoppingCart } from 'react-icons/fa';
import { useSnipcart } from 'use-snipcart';
import Container from '@components/Container';

import styles from './Header.module.scss';

const Header = () => {
  const {locale: activeLocale, locales, asPath } = useRouter()

  const avaibaleLocales = locales.filter(locale => locale !== activeLocale)

  const { cart = {} } = useSnipcart();
  

  return (
    <header className={styles.header}>
      <Container className={styles.headerContainer}>
        <p className={styles.headerTitle}>
          <Link href="/">
            <a>Space Jelly</a>
          </Link>
        </p>
        <ul className={styles.headerLinks}>
          <li>
            <Link href="/categories/apparel">
              <a>Apperal</a>
            </Link>
          </li>
          <li>
            <Link href="/categories/accesories">
              <a>Accesories</a>
            </Link>
          </li>
        </ul>
        <p className={styles.headerCart}>
          <button className="snipcart-checkout">
            <FaShoppingCart />
            <span>
              ${cart.subtotal?.toFixed(2)}
            </span>
          </button>
        </p>
        <ul className={styles.headerLocales}>
          {avaibaleLocales.map( locale => {
            return (
              <li key={locale}>
            <Link href={asPath} locale={locale}>
              <a>
                { locale.toUpperCase() }
              </a>
            </Link>
          </li>
            )
          })}
          
        </ul>
      </Container>
    </header>
  )
}

export default Header;