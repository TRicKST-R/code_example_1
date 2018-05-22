import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ProductDetailsView from './ProductDetails.view'
import {
  setProductDetailsColumns,
  getThisProduct,
  showThisProduct,
  getOrdersForProduct,
  showOrdersForProduct,
  resetProductDetails
} from './ProductDetails.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    productDetailsState: state.productDetailsState
  }),
  dispatch => ({
    setProductDetailsColumns: bindActionCreators(
      setProductDetailsColumns,
      dispatch
    ),
    getThisProduct: bindActionCreators(getThisProduct, dispatch),
    showThisProduct: bindActionCreators(showThisProduct, dispatch),
    getOrdersForProduct: bindActionCreators(getOrdersForProduct, dispatch),
    showOrdersForProduct: bindActionCreators(showOrdersForProduct, dispatch),
    resetProductDetails: bindActionCreators(resetProductDetails, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(ProductDetailsView)
