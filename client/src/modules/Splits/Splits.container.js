import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SplitsView from './Splits.view'
import {
  getSplitsColumns,
  applyListSettings,
  savePreset,
  forceRender,
  removePreset,
  getPresets,
  loadMore
} from './Splits.state'
import { push } from 'react-router-redux'

export default connect(
  ({ splitsState }) => ({
    splitsState
  }),
  dispatch => ({
    getSplitsColumns: bindActionCreators(getSplitsColumns, dispatch),
    applyListSettings: bindActionCreators(applyListSettings, dispatch),
    savePreset: bindActionCreators(savePreset, dispatch),
    removePreset: bindActionCreators(removePreset, dispatch),
    getPresets: bindActionCreators(getPresets, dispatch),
    push: bindActionCreators(push, dispatch),
    loadMore: bindActionCreators(loadMore, dispatch),
    forceRender: bindActionCreators(forceRender, dispatch)
  })
)(SplitsView)
