import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import OrderDetailsView from './OrderDetails.view'
import { updateOrder, getThisOrder } from './OrderDetails.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    orderDetailsState: state.orderDetailsState,
    session: state.session
  }),
  dispatch => ({
    updateOrder: bindActionCreators(updateOrder, dispatch),
    getThisOrder: bindActionCreators(getThisOrder, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(OrderDetailsView)
