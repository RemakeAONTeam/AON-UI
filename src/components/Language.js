import React from 'react'
import { connect } from 'dva'
import { injectIntl, FormattedMessage } from 'react-intl'

// https://wmira.github.io/react-icons-kit
import { Icon } from 'react-icons-kit'
import { cog } from 'react-icons-kit/fa/cog'

// http://flag-icon-css.lip.is/
import 'flag-icon-css/css/flag-icon.css'

import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'
import '@trendmicro/react-buttons/dist/react-buttons.css'
import '@trendmicro/react-dropdown/dist/react-dropdown.css'

import styles from './Language.scss'

class Language extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.dispatch = props.dispatch
    const { locale, type } = this.props
    this.state = {
      locale: locale,
    }
  }

  /**
   * 更換語系
   * @param {String} locale 地區設定, 參見 models
   * @param {Object} locale 語系檔, 參見 models
   */
  changeLocale(locale, message) {
    this.setState({ locale: locale })
    this.dispatch({ type: 'language/update', payload: { locale: locale, key: locale, messages: message } })
  }

  render() {
    const { intl, lans } = this.props

    // 渲染方法 - http://www.cnblogs.com/qiaojie/p/6411199.html

    return (
      <div className={styles['lan-group']}>
        <Dropdown>
          <Dropdown.Toggle iconOnly noCaret>
            <span style={{ display: 'flex' }}>
              <Icon icon={cog} style={{ marginRight: 6 }} />
              {intl.formatMessage({ id: 'intl.lang' })}
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              // 請勿在本檔案新增語系
              // 欲增加語系請到 models / language.js
              lans.map((lan, index) => {
                return (
                  <MenuItem
                    key={`lan-${lan.locale}-${index}`}
                    active={this.state.locale === lan.locale}
                    onSelect={() => this.changeLocale(lan.locale, lan.messages)}
                  >
                    <span className={['flag-icon', `flag-icon-${lan.icon}`].join(' ')} style={{ marginRight: 6 }}></span>
                    {intl.formatMessage({ id: `intl.lang.${lan.locale}` })}
                  </MenuItem>
                )
              })
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

Language.propTypes = {}

function mapStateToProps(state) {
  return {
    key: state.language.key,
    locale: state.language.locale,
    messages: state.language.messages,
    type: state.language.type,
    lans: state.language.lans,
  }
}

export default connect(mapStateToProps)(injectIntl(Language))
