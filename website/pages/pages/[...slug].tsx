import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { Inter } from '@next/font/google'
import classNames from "classnames"
// import styles from '../styles/Home.module.css'
import {
    MenuHomeLayout,
    ZoomablePT,
    BottomNavigation,
    Context,
    weappPath2Web,
} from '@periodic-table-pro/components'


const inter = Inter({ subsets: ['latin'] })

export default function Redirect() {

    const {
        state: {
            theme: { mode: theme },
        }
    } = useContext(Context)

    const router = useRouter()

    useEffect(() => {
        const path = weappPath2Web(location.href)
        router.replace(path)
    }, [router])

    return (
        <>
            <Head>
                <title>元素周期表表PRO - 高颜值化学必备小工具</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={classNames('index-page', theme)}>
                <MenuHomeLayout themeClass={theme}>
                    <ZoomablePT />
                    <BottomNavigation themeClass={theme} />
                </MenuHomeLayout>
            </div>
        </>
    )
}
