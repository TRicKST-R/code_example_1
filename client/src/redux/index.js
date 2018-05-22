import { combineReducers } from 'redux'
import { dialogState } from '../modules/Dialog'
import { drawerState } from '../modules/Drawer'
import { routerReducer } from 'react-router-redux'

import { signInRootReducer } from '../modules/SignIn/SignIn.state'
import { ordersReducer } from '../modules/Orders/Orders.state'
import { splitsReducer } from '../modules/Splits/Splits.state'
import { transactionsReducer } from '../modules/Transactions/Transactions.state'
import { allocationsReducer } from '../modules/Allocations/Allocations.state'
import { filesReducer } from '../modules/Files/Files.state'
import { usersListReducer } from '../modules/UsersList/UsersList.state'
import { productsListReducer } from '../modules/ProductsList/ProductsList.state'

import { profileDetailsReducer } from '../modules/ProfileDetails/ProfileDetails.state'
import { productDetailsReducer } from '../modules/ProductDetails/ProductDetails.state'
import { orderDetailsReducer } from '../modules/OrderDetails/OrderDetails.state'
import { userDetailsReducer } from '../modules/UserDetails/UserDetails.state'

import { dashboardReducer } from '../modules/Dashboard/Dashboard.state'
import { transfersReducer } from '../modules/Transfers/Transfers.state'
import { breweriesReducer } from '../modules/Breweries/Breweries.state'
import { wholesalersReducer } from '../modules/Wholesalers/Wholesalers.state'

import { inventoryReducer } from '../modules/Inventory/Inventory.state'

import { snackRootReducer } from './snackReducer'
import { spinnerRootReducer } from './spinnerState'
import { sessionRootReducer } from './sessionState'
import { loadGuidesRootReducer } from '../modules/UserGuidelinesPage/UserGuidelinesPage.state'
import { localUsersRootReducer } from '../root/localUsersReducer'

const rootReducer = combineReducers({
  routing: routerReducer,

  signInState: signInRootReducer,
  ordersState: ordersReducer,
  splitsState: splitsReducer,
  transactionsState: transactionsReducer,
  allocationsState: allocationsReducer,
  filesState: filesReducer,
  productsListState: productsListReducer,
  usersListState: usersListReducer,
  userGuidelinesState: loadGuidesRootReducer,

  profileDetailsState: profileDetailsReducer,
  productDetailsState: productDetailsReducer,
  orderDetailsState: orderDetailsReducer,
  userDetailsState: userDetailsReducer,

  dashboardState: dashboardReducer,
  transfersState: transfersReducer,
  breweriesState: breweriesReducer,
  wholesalersState: wholesalersReducer,

  dialogState: dialogState,
  drawerState: drawerState,
  spinner: spinnerRootReducer,
  snack: snackRootReducer,
  session: sessionRootReducer,
  guidlines: loadGuidesRootReducer,
  localUsers: localUsersRootReducer,
  inventoryState: inventoryReducer
})

export default rootReducer
