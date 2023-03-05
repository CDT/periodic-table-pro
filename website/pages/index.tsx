import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import { Inter } from '@next/font/google'
import classNames from "classnames"
// import styles from '../styles/Home.module.css'
import {
  MenuHomeLayout,
  ZoomablePT,
  BottomNavigation,
  Context,
} from '@periodic-table-pro/components'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const {
    state: {
      theme: { mode: theme },
    }
  } = useContext(Context)

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
