import React, { Component } from 'react'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import ErrorBoundary from '../components/ErrorBoundary'
import config from './../config'

const locationHelper = locationHelperBuilder({})

export const userIsNotAuthenticated = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the wholesalers page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // If selector is true, wrapper will not redirect
  // So if there user is not logged in then we show the page
  authenticatedSelector: ({ session: { isLoggedIn } }) => isLoggedIn === false,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: ({ session: { isLoggedIn } }) => isLoggedIn,
  wrapperDisplayName: 'UserIsAuthenticated'
})

export const userIsBrewery = connectedRouterRedirect({
  /* note: it is false case - when you are loged in not in that role */
  /* so, if we are brewery - here must be Whs default page */
  redirectPath: '/orders',
  authenticatedSelector: ({ session: { isLoggedIn, role } }) =>
    role === config.roles.brewery,
  wrapperDisplayName: 'userIsBrewery'
})

export const userIsWhs = connectedRouterRedirect({
  /* note: it is false case - when you are loged in not in that role */
  /* so, if we are Whs - here must be Brewery default page */
  redirectPath: '/dashboard',
  authenticatedSelector: ({ session: { isLoggedIn, role } }) =>
    role === config.roles.wholesaler,
  wrapperDisplayName: 'userIsWhs'
})

export class WithAuth extends Component {
  render () {
    const { children } = this.props
    return (
      <div>
        {React.Children.map(children, element => (
          <ErrorBoundary>
            {React.cloneElement(element, {
              component: userIsAuthenticated(element.props.component)
            })}
          </ErrorBoundary>
        ))}
      </div>
    )
  }
}
