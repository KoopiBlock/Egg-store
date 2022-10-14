import Head from 'next/head'

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Product.module.scss'

import { 
  ApolloClient,
  InMemoryCache,
  gql, 
  } from '@apollo/client';

export default function Product({ product }) {
  return (
    <Layout>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={`Find ${product.name} at my website lol!`} />
      </Head>

      <Container>
        <div className={styles.productWrapper}>
          <div className={styles.productImage}>
          <img width={product.width} height={product.height} src={product.image.url} alt="" />
          </div>
          <div className={styles.productContent}>
            <h1> {product.name}</h1>
            <div className={styles.productDescription} dangerouslySetInnerHTML={{
              __html: product.description?.html
            }} />
            <p className={styles.productPrice}> 
              {product.price} $
            </p>
            <p className={styles.productBuy}>
              <Button
                className="snipcart-add-item"
                data-item-id={product.id}
                data-item-price={product.price}
                data-item-image={product.image.url}
                data-item-name={product.name}
                data-item-url={`/products/${product.slug}`}
              >
                Add to Cart
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getStaticPaths({ locales }) {

  const client = new ApolloClient({
    uri: 'https://api-eu-west-2.hygraph.com/v2/cl94h07cc52ae01uke8ms0jxr/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
    query ProductPage {
      products {
        image 
        slug
        price
        name
      }
    }
    `
  })

 
  const paths = data.data.products.map(product => {
    return {
      params: {
        productSlug: product.slug
      }
    }
  })

  return {
    paths: [
      ...paths,
      ...paths.flatMap(path => {
        return locales.map(locale => {
          return {
            ...path,
            locale
          }
        })
      })
    ],
    fallback: false
  }
}

export async function getStaticProps({ params, locale }) {

  const client = new ApolloClient({
    uri: 'https://api-eu-west-2.hygraph.com/v2/cl94h07cc52ae01uke8ms0jxr/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
    query PageProduct($slug: String, $locale: Locale!) {
      product(where: {slug: $slug}) {
        image
        name
        price
        id
        description {
          html
        }
        localizations(locales: [$locale]) {
          description {
            html
          }
        }
      }
    }
    `,
    variables: {
      slug: params.productSlug,
      locale
    }
  })

 let product = data.data.product

 if( product.localizations.length > 0 ) {
  product = {
    ...product,
    ...product.localizations[0]
  }
 }

  return {
    props: {
      product
    }
  }
}