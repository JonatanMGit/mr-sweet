import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
const inter = Inter({ subsets: ['latin'] })

    
export async function getServerSideProps(context) {
    // TODO: add Users accesible Guilds to the dashboard if the user is allowed to access the guild
    const data = { gamer: true, prefix: '!', roles: { admin: 'admin', mod: 'mod', mute: 'mute', warn: 'warn' } }
    const { id } = context.query;
    return { props: { data} }
}

export default function Guild({data}) {
const router = useRouter()
    const { id } = router.query
    // 
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
                            Welcome to Mr Sweet Dashboard for the guild {id}
                        </h1>
                        <p>
                            {data.gamer ? 'Gamer mode is enabled' : 'Gamer mode is disabled'}
                            

                        </p>
                        <p className={styles.description}>
                            Change Mr Sweet&apos;s settings here.
                        </p>
                    </main>
                </div>
            </div>
        </>
  )
}
