import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { json } from 'sequelize'
import Link from 'next/link'



const inter = Inter({ subsets: ['latin'] })
// add the inter font to the page by using the Inter component and passing the subsets prop to it
export async function getServerSideProps() {
    //TODO: add Users accesible Guilds to the dashboard
    const guilds = [123, 456]
    return { props: {guilds} }
}

export default function dashboard({guilds}) {
  return (
    <>
      <Head>
        <title>Mr Sweet Dashboard</title>
        <meta name="description" content="Mr Sweet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.container}>
              <div className={inter.className}>
                  <main className={styles.main}>
                      <h1 className={styles.title}>
                          Welcome to Mr Sweet Dashboard
                      </h1>

                      <ul>
                          {guilds.map(guild => (
                              <li key={guild.id}>
                                  <Link href={`/dashboard/${guild}`}>
                                      {guild}
                                  </Link>
                                </li>
                          ))}
                      </ul>
                      
                    
                      <p className={styles.description}>
                          Change Mr Sweet&apos;s settings here.
                      </p>
                  </main>
              </div>
          </div>                
      </>
  )
}
