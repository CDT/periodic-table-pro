import { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import useShareMessage from '../../hooks/useShareMessage'
import {
    Context,
    NavigationHeader,
    Article,
} from '@periodic-table-pro/components'
import {
    WikiData,
    getSkeletonWikiData,
} from '@periodic-table-pro/data'
import { useContext } from 'react'
import { useInterstitialAd } from '../../hooks'

import '@periodic-table-pro/components/wiki.scss'
import './index.scss'

const PLATFORM = process.env.PLATFORM
const WIKI_INTERSTITIAL_AD = process.env.WIKI_INTERSTITIAL_AD
const BUCKET_HOST = process.env.BUCKET_HOST

export default function Wiki() {
    const router = useRouter()
    const [atomicNumber, setAtomicNumber] = useState(0)
    const [data, setData] = useState<WikiData | null>(null)
    // const [theme,] = useThemeMode()
    const { state: { theme: { mode: theme } } } = useContext(Context)
    const [loading, setLoading] = useState(false)
    useShareMessage({
        path: '/pages/wiki/index?Z=' + router.params.Z,
        posterImage: false,
    })
    useInterstitialAd(WIKI_INTERSTITIAL_AD)

    useEffect(() => {
        let Z = parseInt(router.params.Z || '1')
        if (!isFinite(Z)) Z = 1
        setAtomicNumber(Z)
    }, [router])

    useEffect(() => {
        const Z = atomicNumber
        const weapp = ['weapp'].includes(PLATFORM)

        if (weapp && false) {
            const db = Taro.cloud.database()
            db.collection('wiki')
                .where({ _id: Z + '' })
                .get()
                .then((result) => {
                    console.log(result.data)
                    if (result.data) {
                        setData(result.data[0] as any)
                    }
                })
        }

        if (Z > 0 && true) {
            const url = BUCKET_HOST + '/json/wiki/' + Z + '.json'
            setData(getSkeletonWikiData(Z))
            setLoading(true)
            Taro.request({
                url: url,
                success: function (res) {
                    console.log(res.data)
                    setData(res.data)
                    setLoading(false)
                }
            })
        }
    }, [atomicNumber])

    useEffect(() => {
        let Z = parseInt(router.params.Z || '1')
        if (!isFinite(Z)) Z = 1

        const handleKeyup = (e: KeyboardEvent) => {
            console.log(e)
            let step = 1
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowUp':
                    step = 1
                    break
                case 'ArrowLeft':
                case 'ArrowDown':
                    step = -1
                    break
            }

            Taro.redirectTo({
                url: '/pages/wiki/index?Z=' + (Z + step)
            })
            setAtomicNumber(Z)
        }

        if (PLATFORM === 'h5') {
            window.addEventListener('keyup', handleKeyup)
        }

        return () => {
            if (PLATFORM === 'h5') {
                window.removeEventListener('keyup', handleKeyup)
            }
        }
    }, [])

    return (
        <View
            className={classNames(
                'wiki-page',
                theme,
            )}
        >
            <NavigationHeader themeClass={theme} />

            <Article
                themeClass={theme}
                atomicNumber={atomicNumber}
                loading={loading}
                heading={data?.heading}
                tagline={data?.tagline}
                data={data}
            />


            {/* <View
                className={classNames('content',
                    Categories[elementsCategories[atomicNumber - 1]]
                )}
            >
                {loading && !data && <Skeleton themeClass={theme} />}

                <View className='title'>
                    {data && data.heading}
                </View>

                <View>
                    {data && data.tagline}
                </View>

                <Article data={data} themeClass={theme} />
            </View> */}
        </View>
    )
}