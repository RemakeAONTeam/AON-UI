import React from 'react'
import { connect } from 'dva'
import { injectIntl, FormattedMessage } from 'react-intl'
import Tooltip from './Tooltip'
import styles from './BuffCD.scss'

import runReversal from '../utils/CDAnimation'
import InterfaceBuff from '../interface/Buff'

class BuffCD extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.dispatch = props.dispatch
    this.state = {
      total: 1000,
      finish: 1000,
      slice1style: {},
      slice2style: {},
      timer: undefined,
      during: 0,
      isRun: false,
    }
    this.start = this.start.bind(this)
  }

  componentDidMount() {
    // Create fake data
    // this.setState({ // eslint-disable-line
    //   slice1style: this.runReversal(1, this.state.finish, this.state.total),
    //   slice2style: this.runReversal(2, this.state.finish, this.state.total),
    // })
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  start() {
    const { index, Buffs } = this.props
    const buff = Buffs[index]

    this.setState({
      finish: this.state.finish + (50 / this.state.during),
    })

    // 執行完畢 或是 可能切換角色
    if (this.state.finish >= 1000 || buff.Duration === 0) {
      clearInterval(this.state.timer)
      this.setState({
        finish: 1000,
        isRun: false,
      })
    }

    this.setState({ // eslint-disable-line
      slice1style: runReversal(1, this.state.finish, this.state.total),
      slice2style: runReversal(2, this.state.finish, this.state.total),
    })

    // 每秒換算範例
    // millisecond = millisecond + 50
    // if (millisecond >= 1000) {
    //   millisecond = 0;
    //   console.log('1 second')
    // }
  }

  render() {
    const { index, Buffs } = this.props

    let buff = new InterfaceBuff()
    buff = Buffs[index]

    const percent = buff.MaxDuration > 0 ? Number(Number.parseFloat((buff.MaxDuration - buff.Duration) / buff.MaxDuration * 100).toFixed(0)) : 0

    // // 判斷 UE4 是否使用鍵盤觸發技能
    if (this.state.isRun === false && buff.Duration > 0) {
      this.setState({
        during: buff.MaxDuration,
        finish: percent * 10, // 要判斷當前的進度, 決定初始值 (0/1000) 度量衡使用千
        isRun: true,
        timer: setInterval(this.start, 50),
      })
    }

    return (
      <div
        className={styles['buff-box']}
        key={`buff-${index}`}
        data-tip
        data-for={`bufftip${index}`}
      >
        <div className={styles.pie} style={{ 'backgroundImage': `url(${buff.Webpath}` }}>
          <div className={styles.clip1}>
            <div className={styles.slice1} style={this.state.slice1style}></div>
          </div>
          <div className={styles.clip2}>
            <div className={styles.slice2} style={this.state.slice2style}></div>
          </div>
          <div className={styles.status}>
            {percent === 100 || percent === 0 ? '' : `${percent}%`}
          </div>
        </div>
        <Tooltip id={`bufftip${index}`} tooltip={buff.Tips} />
      </div>
    )
  }
}

BuffCD.propTypes = {}

function mapStateToProps(state) {
  return {
    Buffs: state.player.Buffs,
  }
}

export default connect(mapStateToProps)(injectIntl(BuffCD))
