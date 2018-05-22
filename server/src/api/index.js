import SIGN_IN from './methods/SIGN_IN'
import GET_DISTRIBUTION_CENTERS from './methods/GET_DISTRIBUTION_CENTERS'
import GET_BREWERIES_WH from './methods/GET_BREWERIES_WH'
import LOAD_MORE_GUIDES from './methods/LOAD_MORE_GUIDES'
import LOAD_MORE_PRODUCTS from './methods/LOAD_MORE_PRODUCTS'
import DELETE_PRODUCTS from './methods/DELETE_PRODUCTS'
import UPDATE_PRODUCT from './methods/UPDATE_PRODUCT'
import ADD_PRODUCT from './methods/ADD_PRODUCT'
import GET_FILES_LIST from './methods/GET_FILES_LIST'
import GET_PRODUCT_MODEL from './methods/GET_PRODUCT_MODEL'
import GET_THIS_PRODUCT from './methods/GET_THIS_PRODUCT'
import GET_ORDERS_FOR_PRODUCT from './methods/GET_ORDERS_FOR_PRODUCT'
import BREWERIES_LOAD from './methods/BREWERIES_LOAD'
import WHOLESALERS_LOAD from './methods/WHOLESALERS_LOAD'
import ADD_TO_ORDER from './methods/ADD_TO_ORDER'
// ORDERS
import GET_ORDER_MODEL from './methods/GET_ORDER_MODEL'
import LOAD_MORE_ORDERS from './methods/LOAD_MORE_ORDERS'
import UPDATE_ORDER from './methods/UPDATE_ORDER'
// PRESETS
import PRESETS_GET from './methods/PRESETS_GET'
import PRESETS_SAVE from './methods/PRESETS_SAVE'
import PRESETS_REMOVE from './methods/PRESETS_REMOVE'

import GET_WHOLESALERS from './methods/GET_WHOLESALERS'
import SPLITS_GET_MODEL from './methods/SPLITS_GET_MODEL'
import SPLITS_LOAD_MORE from './methods/SPLITS_LOAD_MORE'
import SPLITS_PRESETS_SAVE from './methods/SPLITS_PRESETS_SAVE'
import SPLITS_PRESETS_REMOVE from './methods/SPLITS_PRESETS_REMOVE'
import SPLITS_PRESETS_GET from './methods/SPLITS_PRESETS_GET'
import GET_THIS_ORDER from './methods/GET_THIS_ORDER'
import TRANSFERS_LOAD from './methods/TRANSFERS_LOAD'

export default {
  SPLITS_GET_MODEL,
  SPLITS_LOAD_MORE,
  SPLITS_PRESETS_SAVE,
  SPLITS_PRESETS_REMOVE,
  SPLITS_PRESETS_GET,
  SIGN_IN,
  LOAD_MORE_GUIDES,
  GET_DISTRIBUTION_CENTERS,
  GET_BREWERIES_WH,

  LOAD_MORE_PRODUCTS,
  DELETE_PRODUCTS,
  UPDATE_PRODUCT,
  ADD_PRODUCT,
  GET_PRODUCT_MODEL,

  GET_FILES_LIST,
  GET_THIS_PRODUCT,
  GET_ORDERS_FOR_PRODUCT,
  BREWERIES_LOAD,
  WHOLESALERS_LOAD,

  GET_ORDER_MODEL,
  LOAD_MORE_ORDERS,
  ADD_TO_ORDER,
  UPDATE_ORDER,

  PRESETS_GET,
  PRESETS_SAVE,
  PRESETS_REMOVE,

  GET_WHOLESALERS,
  GET_THIS_ORDER,
  TRANSFERS_LOAD
}