import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AllocationsView from './Allocations.view'
import {
  forceRender,
  getPresets,
  savePreset,
  removePreset,
  setOrdersColumns,
  getOrderModel,
  loadMoreOrders,
  showMoreAllocations,
  applyOrdersListSettings,
  requireOrderUpdate
} from './Allocations.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    allocationsState: state.allocationsState
  }),
  dispatch => ({
    getPresets: bindActionCreators(getPresets, dispatch),
    savePreset: bindActionCreators(savePreset, dispatch),
    removePreset: bindActionCreators(removePreset, dispatch),

    getOrderModel: bindActionCreators(getOrderModel, dispatch),
    showMoreAllocations: bindActionCreators(showMoreAllocations, dispatch),
    setOrdersColumns: bindActionCreators(setOrdersColumns, dispatch),
    loadMoreOrders: bindActionCreators(loadMoreOrders, dispatch),
    requireOrderUpdate: bindActionCreators(requireOrderUpdate, dispatch),

    forceRender: bindActionCreators(forceRender, dispatch),
    applyOrdersListSettings: bindActionCreators(
      applyOrdersListSettings,
      dispatch
    ),
    push: bindActionCreators(push, dispatch)
  })
)(AllocationsView)
