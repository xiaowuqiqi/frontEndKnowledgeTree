import React, {useState, useEffect} from 'react'
import classnames from 'classnames'
import styles from './index.module.less'
// demo使用方式
// ```jsx
// /**
//  * defaultShowCode: true
//  */
// import {ConsoleReader} from '@/utils/ConsoleLog'
// export default ConsoleReader(({console})=>{
// //// --------- 执行代码如下 ----------
//
// //// ------------- END -------------
// });
// ```
export function ConsoleReader(children) {
  return () => {
    let [dataArr, setDataArr] = useState([])
    const log = (data) => {
      if (typeof data === 'undefined') {
        dataArr.push({
          className: classnames(styles.item, styles.undfd),
          value: 'undefined'
        })
      } else if (data === null) {
        dataArr.push({
          className: classnames(styles.item, styles.undfd),
          value: 'null'
        })
      } else if (typeof data === 'number') {
        dataArr.push({
          className: classnames(styles.item, styles.undfd),
          value: data
        })
      } else if (typeof data === 'function') {
        dataArr.push({
          className: classnames(styles.item, styles.undfd),
          value: data.toString().replace(/[\s]+/g,'')
        })
      } else if (Array.isArray(data)) {
        dataArr.push({
          className: styles.item,
          value: JSON.stringify(data)
        })
       } else {
        dataArr.push({
          className: styles.item,
          value: JSON.stringify(data, null, 4)
        })
      }
      setDataArr([...dataArr])
    }
    const clear = () => {
      dataArr = []
      setDataArr([])
    }
    useEffect(() => {
      clear()
      try {
        children({log, clear, console: {log}})
      } catch (e) {
        console.error(e)
        dataArr.push({
          className: classnames(styles.item, styles.error),
          value: JSON.stringify(e.toString(), null, 4)
        })
        setDataArr([...dataArr])
      }
    }, [children])
    return (<section className={styles.cont}>
      <h4>控制台输出:</h4>
      {dataArr.map((data, i) => {
        return (<pre className={data.className} key={i}>{data.value}</pre>)
      })}
    </section>)
  }
}
