import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import AboutPage from './../components/AboutPage'
import NotFoundPage from './../components/NotFoundPage'
import DialogPage from './../modules/Dialog'
import SignIn from './../modules/SignIn'
import Orders from './../modules/Orders'
import Splits from './../modules/Splits'
import Transactions from './../modules/Transactions'
import Allocations from './../modules/Allocations'
import Files from './../modules/Files'
import ProductsList from './../modules/ProductsList'
import UsersList from './../modules/UsersList'
import UserGuidelines from './../modules/UserGuidelinesPage'

import ProfileDetails from './../modules/ProfileDetails'
import ProductDetails from './../modules/ProductDetails'
import OrderDetails from './../modules/OrderDetails'
import UserDetails from './../modules/UserDetails'

import Dashboard from './../modules/Dashboard'
import Transfers from './../modules/Transfers'
import Breweries from './../modules/Breweries'
import Wholesalers from './../modules/Wholesalers'

import Inventory from './../modules/Inventory'

import {
  WithAuth,
  userIsNotAuthenticated,
  userIsBrewery,
  userIsWhs
} from './Auth'
import AvatarLoaderPage from './../modules/AvatarLoaderPage'

export default class Routes extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={userIsNotAuthenticated(SignIn)} />
        <WithAuth>
          <Route path='/about' component={AboutPage} />
          <Route path='/dialog' component={DialogPage} />
          <Route path='/settings' component={AvatarLoaderPage} />
          <Route path='/orders' component={Orders} />
          <Route path='/files' component={Files} />
          <Route path='/products' component={ProductsList} />
          <Route path='/users' component={UsersList} />
          <Route path='/guidelines' component={UserGuidelines} />
          <Route path='/profile-details' component={ProfileDetails} />
          <Route path='/product-details' component={ProductDetails} />
          <Route path='/order-details' component={OrderDetails} />
          <Route path='/user-details' component={UserDetails} />
          <Route
            path='/breweries'
            component={userIsWhs(Breweries)}
            role='WHOLESALER'
          />
          <Route
            path='/inventory'
            component={userIsWhs(Inventory)}
            role='WHOLESALER'
          />
          <Route
            path='/transactions'
            component={userIsWhs(Transactions)}
            role='WHOLESALER'
          />
          <Route path='/allocations' component={Allocations} />
          <Route
            path='/dashboard'
            component={userIsBrewery(Dashboard)}
            role='BREWERY'
          />
          <Route
            path='/transfers'
            component={userIsBrewery(Transfers)}
            role='BREWERY'
          />
          <Route
            path='/wholesalers'
            component={userIsBrewery(Wholesalers)}
            role='BREWERY'
          />
          <Route
            path='/splits'
            component={userIsBrewery(Splits)}
            role='BREWERY'
          />
        </WithAuth>
        <Route component={NotFoundPage} />
      </Switch>
    )
  }
}
