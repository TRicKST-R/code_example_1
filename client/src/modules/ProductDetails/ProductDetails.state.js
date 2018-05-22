import {
  SET_PRODUCT_DETAILS_COLUMNS,
  GET_THIS_PRODUCT,
  SHOW_THIS_PRODUCT,
  GET_ORDERS_FOR_PRODUCT,
  SHOW_ORDERS_FOR_PRODUCT,
  PRODUCT_DETAILS_RESET
} from '../../redux/actionTypes'

const initialState = {
  productDescription: [
    {
      name: 'brand',
      key: 'brand'
    },
    {
      name: 'gpa',
      key: 'gpa'
    },
    {
      name: 'package',
      key: 'package'
    },
    {
      name: 'size',
      key: 'size'
    },
    {
      name: 'group',
      key: 'group'
    }
  ],
  inventory: [],
  orderColumns: [
    {
      name: 'wholesaler',
      key: 'wholesalerId'
    },
    {
      name: 'quantity',
      key: 'count'
    },
    // what is this?
    // {
    //   name: 'net doi',
    //   key: 'net doi'
    // },
    //
    {
      name: 'order date',
      key: 'order_date'
    },
    {
      name: 'accept date',
      key: 'accept_date'
    },
    {
      name: 'shipping',
      key: 'ship_date'
    },
    {
      name: 'order status',
      key: 'status'
    }
  ],
  products: [],
  orders: []
}

export const resetProductDetails = () => ({
  type: PRODUCT_DETAILS_RESET
})

export const setProductDetailsColumns = () => ({
  type: SET_PRODUCT_DETAILS_COLUMNS
})

export const getThisProduct = payload => ({
  type: GET_THIS_PRODUCT,
  payload
})

export const getOrdersForProduct = payload => ({
  type: GET_ORDERS_FOR_PRODUCT,
  payload
})

export const showOrdersForProduct = payload => ({
  type: SHOW_ORDERS_FOR_PRODUCT,
  payload
})

export const showThisProduct = payload => ({
  type: SHOW_THIS_PRODUCT,
  payload
})

const productDetailsReducers = {
  [SHOW_THIS_PRODUCT]: (state, payload) => {
    const { products, inventory } = payload
    return {
      ...state,
      products,
      inventory
    }
  },
  [SHOW_ORDERS_FOR_PRODUCT]: (state, orders) => {
    return {
      ...state,
      orders
    }
  },
  [PRODUCT_DETAILS_RESET]: () => initialState
}

export const productDetailsReducer = (state = initialState, action) => {
  let reducer = productDetailsReducers[action.type]
  return reducer ? reducer(state, action.payload) : state
}
