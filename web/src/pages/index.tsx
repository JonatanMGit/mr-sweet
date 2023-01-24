import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { json } from 'sequelize'


// sequelize open sqlite3 database

const inter = Inter({ subsets: ['latin'] })
// add the inter font to the page by using the Inter component and passing the subsets prop to it
export async function getServerSideProps() {
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'C:/Users/jonat/code/mr-sweet/bot/database.sqlite',
    logging: false
  });
  const User = sequelize.define('User', {
    // Model attributes are defined here
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    refresh_token: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
  // return users as a list of user ids
  const users = await User.findAll().then(users => {
    return users.map(user => user.id+" ")
  })
  return {
    props: {data: users}, // will be passed to the page component as props
  }
}

export default function Home({data}) {
  return (
    <>
      <Head>
        <title>Mr Sweet</title>
        <meta name="description" content="Mr Sweet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div className={inter.className}>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Mr Sweet
        </h1>
        <p className={styles.description}>
          Mr Sweet is an new advanced discord bot with many customizable features.
        </p>
        <div className={styles.grid}>
          <a href="" className={styles.card}>
            <h3>Invite &rarr;</h3>
            <p>Invite Mr Sweet to your server.</p>
          </a>
          <a href="" className={styles.card}>
            <h3>Support &rarr;</h3>
            <p>Join our support server.</p>
            </a>
            <a href="/dashboard" className={styles.card}>
              <h3>Dashboard &rarr;</h3>
              <p>Manage your server with our dashboard.</p>
            </a>
          </div>
            <p>{data}</p>
          </main>
          </div>
      </div>
      
    </>
  )
}
