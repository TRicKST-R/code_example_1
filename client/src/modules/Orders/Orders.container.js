import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import OrdersView from './Orders.view'
import { push } from 'react-router-redux'

import {
  forceRender,
  getPresets,
  savePreset,
  removePreset,
  setOrdersColumns,
  getOrderModel,
  loadMoreOrders,
  showMoreOrders,
  applyOrdersListSettings,
  requireOrderUpdate
} from './Orders.state'

export default connect(
  ({ ordersState, session }) => ({
    ordersState,
    session
  }),
  dispatch => ({
    getPresets: bindActionCreators(getPresets, dispatch),
    savePreset: bindActionCreators(savePreset, dispatch),
    removePreset: bindActionCreators(removePreset, dispatch),

    getOrderModel: bindActionCreators(getOrderModel, dispatch),
    showMoreOrders: bindActionCreators(showMoreOrders, dispatch),
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
)(OrdersView)
