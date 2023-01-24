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
    const db = require('../../../bot/dist/db');
    let guilds = await db.getGuilds();
    guilds = guilds.map(guild => guild.dataValues);
    console.log(guilds);
    guilds = JSON.stringify(guilds);
 // output [{"id":"813852446069751838","createdAt":"2023-01-23T22:10:28.983Z","updatedAt":"2023-01-23T22:10:28.983Z"},{"id":"1050508742334103572","createdAt":"2023-01-24T21:28:29.424Z","updatedAt":"2023-01-24T21:28:29.424Z"},{"id":"751897058394374175","createdAt":"2023-01-24T21:28:29.428Z","updatedAt":"2023-01-24T21:28:29.428Z"},{"id":"974344173840908328","createdAt":"2023-01-24T21:28:29.429Z","updatedAt":"2023-01-24T21:28:29.429Z"},{"id":"1028723172851339375","createdAt":"2023-01-24T21:28:29.430Z","updatedAt":"2023-01-24T21:28:29.430Z"}]
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
                          {
                              
                              // guilds is a json like this [{id: "213123"}, {id: "123123"}]
                                // so we need to parse it to get the id and display it in a list with a link to the guilds dashboard /dashboard/:id
                              JSON.parse(guilds).map(guild => {
                                  return <li key={guild.id}><Link href={`/dashboard/${guild.id}`}
                                  >{guild.id}</Link></li>
                                })
                          }
                          
                          

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
