import { useContext, useState } from "react"
import classNames from "classnames/bind"
import { Image, Slider } from '../../compat'
import ElementBox from "../../ElementBox"
import LineChart from "./LineChart"
import {
  Context,
  setTemperature,
  setDisplayProperty,
  setTrendData,
  setColorSign,
  setEmphasize,
} from '../../state'
import { DisplayPropertiesModal } from "../../Modal"
import {
  formalShortAtomicWeights,
  propertiesLabels,
  properties,
  zhCNCategories,
  Categories,
  elementsCategories,
  DisplayProperty,
  block,
  symbol,
  StateOfMatter,
  zhCNNames,
} from '@periodic-table-pro/data'
import { chineseName } from "../../utils/utils"
import { getTrendData } from '../../utils/trend'
import { reportEvent } from '../../utils/analytics'
import { getDisplayProperty, getState } from "../../utils/property"
import { setStorage, getStorage } from '../../utils/storage'

import arrowImg from '../../assets/icons/dropdown-arrow.svg'
import styles from './legend.module.scss'

const cx = classNames.bind(styles)


const emphasizeData = {
  'number': 1,
  'symbol': 2,
  'name': 3,
}

const colorSignData = {
  'trend': 1,
  'classification': 2,
  'block': 3,
  'state': 4,
}

type Props = {
  Z: number
  themeClass?: string
}

export default function Legend({ themeClass, Z }: Props) {
  const {
    state: {
      periodicTable: {
        emphasize,
        colorSign,
        temperature,
        displayProperty,
        trendData,
      },
    },
    dispatch,
  } = useContext(Context)

  const [displayPropertiesModalVisible, setDisplayPropertiesModalVisible] = useState(false)

  const handleTemperature = (value: number) => {
    const celsius = value - 273.15
    dispatch && dispatch(setTemperature(celsius))
  }

  const handleDisplayProperty = (type: DisplayProperty) => {
    if (dispatch) {
      dispatch(setDisplayProperty(type))

      const trendData = getTrendData(type)
      // console.log('trendData', trendData)
      dispatch(setTrendData(trendData))
    }

    setDisplayPropertiesModalVisible(false)
    setStorage({ displayProperty: type })
    reportEvent("properties", {
      "name": type,
      "page": 'index'
    })
  }

  const handleColorSign = (type: typeof colorSign) => {
    const trend = properties.some(
      (item) => item.type === displayProperty && item.trend
    )
    if (type === 'trend' && !trend) {
      handleDisplayProperty('atomicWeight')
    }

    dispatch && dispatch(setColorSign(type))
    reportEvent("color_sign", {
      "name": type
    })
  }

  const handleEmphasize = (type: typeof emphasize) => {
    dispatch && dispatch(setEmphasize(type))

    reportEvent("emphasize", {
      "name": type
    })
  }

  return (
    <div className={cx('legend', themeClass)}>
      <div className={cx('content')}>
        <div className={cx('legend-container')}>
          <ElementBox
            className={cx('element-box', {
              [Categories[elementsCategories[Z - 1]]]: colorSign == 'classification',
              [block[Z - 1] + '-block']: colorSign === 'block',
              [StateOfMatter[getState(temperature, Z)]]: colorSign === 'state',
              trend: colorSign === 'trend',
            })}
            emphasize={emphasize}
            atomicNumber={Z}
            symbol={symbol[Z - 1]}
            zhName={chineseName(zhCNNames[Z - 1])}
            bc={getDisplayProperty(displayProperty, Z)}
          />

          {
            emphasize === 'symbol' ? (
              <>
                <div className={cx('label-1')}>原子序数</div>
                <div className={cx('label-2')}>元素名称</div>
                <div className={cx('label-3')}>元素符号</div>
              </>
            ) : emphasize === 'name' ? (
              <>
                <div className={cx('label-1')}>原子序数</div>
                <div className={cx('label-2')}>元素符号</div>
                <div className={cx('label-3')}>元素名称</div>
              </>
            ) : (
              // number
              <>
                <div className={cx('label-1')}>元素符号</div>
                <div className={cx('label-2')}>元素名称</div>
                <div className={cx('label-3')}>原子序数</div>
              </>
            )
          }
          <div
            className={cx('label-4')}
            onClick={() => setDisplayPropertiesModalVisible(true)}
          >
            {propertiesLabels[displayProperty]}
            <Image className={cx('icon')} src={arrowImg} />
          </div>
          <div className={cx('switch-container')}>
            <div
              className={cx("switch-row", "i".repeat(emphasizeData[emphasize]))}
            >
              <div
                className={cx('item')}
                onClick={() => handleEmphasize('number')}
              >序数</div>
              <div
                className={cx('item')}
                onClick={() => handleEmphasize('symbol')}
              >符号</div>
              <div
                className={cx('item')}
                onClick={() => handleEmphasize('name')}
              >名称</div>
            </div>
          </div>
        </div>
        <div className={cx('color-sign-container')}>
          {
            colorSign === 'trend' ? (
              <div className={cx('trend-illustrate')}>
                <div
                  className={cx('trend-title')}
                  onClick={() => setDisplayPropertiesModalVisible(true)}
                >
                  {propertiesLabels[displayProperty]}
                  <Image className={cx('icon')} src={arrowImg} />
                </div>
                <div>
                  小
                  <div className={cx('trend-gradient')} />
                  大
                </div>
                <LineChart
                  className={cx('line-chart')}
                  width={280 * 3}
                  height={120 * 3}
                  data={trendData || []}
                // data={formalShortAtomicWeigths}
                // data={electronegativity}
                />
              </div>
            ) :
              colorSign === 'classification' ? (
                <div className={cx('classification-color')}>
                  {
                    zhCNCategories.map((label, index) => (
                      <div
                        key={index}
                        className={cx('classification-item', Categories[index])}
                      >{label}</div>
                    ))
                  }
                </div>
              ) :
                colorSign === 'block' ? (
                  <div className={cx('block-table')}>
                    <div className={cx('block-item', 's-block', 'H')} />
                    <div className={cx('block-item', 's-block', 'He')} />
                    <div className={cx('block-item', 's-block', 'other')}>s</div>
                    <div className={cx('block-item', 'd-block')}>d</div>
                    <div className={cx('block-item', 'p-block')}>p</div>
                    <div className={cx('block-item', 'f-block')}>f</div>
                  </div>
                ) :
                  colorSign === 'state' ? (
                    <div className={cx('state-panel')}>
                      <div className={cx('state-title')}>物态</div>
                      <div className={cx('state-label')}>
                        <div className={cx('state-item', 'gas')}>气态</div>
                        <div className={cx('state-item', 'liquid')}>液态</div>
                        <div className={cx('state-item', 'solid')}>固态</div>
                        <div className={cx('state-item', 'unknown')}>未知</div>
                      </div>
                      <div className={cx('title')}>
                        温度:{' '}
                        {temperature.toFixed(2)}°C  {(temperature + 273.15).toFixed(2)}K
                      </div>
                      <Slider
                        min={0}
                        max={6000}
                        step={1}
                        value={temperature + 273.15}
                        onChanging={(e) => handleTemperature(e.detail.value)}
                        onChange={(e) => handleTemperature(e.detail.value)}
                      />
                      <div className={cx('')}>
                        <div className={cx('add')} />

                        <div className={cx('subtract')} />
                      </div>
                    </div>
                  ) : ''
          }


          <div className={cx('switch', 'i'.repeat(colorSignData[colorSign]))}>
            <div
              className={cx('item')}
              onClick={() => handleColorSign('trend')}
            >趋势</div>
            <div
              className={cx('item')}
              onClick={() => handleColorSign('classification')}
            >类别</div>
            <div
              className={cx('item')}
              onClick={() => handleColorSign('block')}
            >区块</div>
            <div
              className={cx('item')}
              onClick={() => handleColorSign('state')}
            >物态</div>
          </div>
        </div>
      </div>

      <DisplayPropertiesModal
        themeClass={themeClass}
        visible={displayPropertiesModalVisible}
        setVisible={setDisplayPropertiesModalVisible}
        displayProperty={displayProperty}
        colorSign={colorSign}
        onSelect={handleDisplayProperty}
      />
    </div>
  )
}
