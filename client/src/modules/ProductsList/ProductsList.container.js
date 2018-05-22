import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import ProductsListView from './ProductsList.view'
import {
  getPresets,
  savePreset,
  showMoreProducts,
  setProductsColumns,
  loadMoreProducts,
  deleteProducts,
  updateProduct,
  updateProductsList,
  forceRender,
  applyProductsListSettings,
  addProduct,
  removePreset,
  getProductModel,
  addToOrder,
  getWholesalers,
  setWholesalers
} from './ProductsList.state'

export default connect(
  state => ({
    productsListState: state.productsListState,
    session: state.session
  }),
  dispatch => ({
    push: bindActionCreators(push, dispatch),
    getPresets: bindActionCreators(getPresets, dispatch),
    savePreset: bindActionCreators(savePreset, dispatch),
    removePreset: bindActionCreators(removePreset, dispatch),
    showMoreProducts: bindActionCreators(showMoreProducts, dispatch),
    setProductsColumns: bindActionCreators(setProductsColumns, dispatch),
    loadMoreProducts: bindActionCreators(loadMoreProducts, dispatch),
    deleteProducts: bindActionCreators(deleteProducts, dispatch),
    updateProduct: bindActionCreators(updateProduct, dispatch),
    updateProductsList: bindActionCreators(updateProductsList, dispatch),
    forceRender: bindActionCreators(forceRender, dispatch),
    applyProductsListSettings: bindActionCreators(
      applyProductsListSettings,
      dispatch
    ),
    addProduct: bindActionCreators(addProduct, dispatch),
    getProductModel: bindActionCreators(getProductModel, dispatch),
    addToOrder: bindActionCreators(addToOrder, dispatch),
    getWholesalers: bindActionCreators(getWholesalers, dispatch),
    setWholesalers: bindActionCreators(setWholesalers, dispatch)
  })
)(ProductsListView)
