/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react'
import Header from './Components/DrawerHeader'
// import HiddenMenu from './Components/DrawerHiddenMenu'
import CenterMenu from './Components/DrawerCenterMenu'
import BottomMenu from './Components/DrawerBottomMenu'
import SignList from './Components/DrawerSignList'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Hidden from 'material-ui/Hidden'
import { styles } from './theme'
import ExitToAppIcon from 'material-ui-icons/ExitToApp'
import SettingsIcon from 'material-ui-icons/Settings'
import ShoppingCart from 'material-ui-icons/ShoppingCart'
import Pages from 'material-ui-icons/Pages'
import People from 'material-ui-icons/People'
import Equalizer from 'material-ui-icons/Equalizer'
import AttachMoney from 'material-ui-icons/AttachMoney'
import Folder from 'material-ui-icons/Folder'
import School from 'material-ui-icons/School'
import Dashboard from 'material-ui-icons/Dashboard'
import CompareArrows from 'material-ui-icons/CompareArrows'
import Domain from 'material-ui-icons/Domain'

export class ResponsiveDrawer extends Component {
  constructor (props) {
    super(props)
    const { push, signOut } = props
    this.menuItems = {
      center: [
        {
          label: 'Dashboard',
          Icon: Dashboard,
          allowTo: {
            BREWERY: true,
            WHOLESALER: false
          },
          onClick: () => push('/dashboard')
        },
        {
          label: 'Users',
          Icon: People,
          allowTo: {
            BREWERY: false,
            WHOLESALER: false
          },
          onClick: () => push('/users')
        },
        {
          label: 'Products',
          Icon: Pages,
          allowTo: {
            BREWERY: true,
            WHOLESALER: true
          },
          onClick: () => push('/products')
        },
        {
          label: 'Transfers',
          Icon: CompareArrows,
          allowTo: {
            BREWERY: true,
            WHOLESALER: false
          },
          onClick: () => push('/transfers')
        },
        {
          label: 'Breweries',
          Icon: Domain,
          allowTo: {
            BREWERY: false,
            WHOLESALER: true
          },
          onClick: () => push('/breweries')
        },
        {
          label: 'Wholesalers',
          Icon: Domain,
          allowTo: {
            BREWERY: true,
            WHOLESALER: false
          },
          onClick: () => push('/wholesalers')
        },
        {
          label: 'Splits',
          Icon: Equalizer,
          allowTo: {
            BREWERY: true,
            WHOLESALER: false
          },
          onClick: () => push('/splits')
        },
        {
          label: 'Transactions',
          Icon: AttachMoney,
          allowTo: {
            BREWERY: false,
            WHOLESALER: true
          },
          onClick: () => push('/transactions')
        },
        {
          label: 'Orders',
          Icon: ShoppingCart,
          allowTo: {
            BREWERY: true,
            WHOLESALER: true
          },
          onClick: () => push('/orders')
        }, /*        {          label: 'Allocations',          Icon: LocalOffer,
          allowTo: {
            BREWERY: true,
            WHOLESALER: true
          },
          onClick: () => push('/allocations')
        }, */
        {
          label: 'Files',
          Icon: Folder,
          allowTo: {
            BREWERY: true,
            WHOLESALER: true
          },
          onClick: () => push('/files')
        },
        {
          label: 'User Guidelines',
          Icon: School,
          allowTo: {
            BREWERY: false,
            WHOLESALER: true
          },
          onClick: () => push('/guidelines')
        }
      ],
      bottom: [
        {
          label: 'Sign out',
          Icon: ExitToAppIcon,
          onClick: () => signOut()
        }
      ],
      hidden: [
        {
          label: 'Settings',
          Icon: SettingsIcon,
          onClick: () => push('/settings')
        }
      ]
    }
  }

  render () {
    // Access control
    let centerItemsToShow = []
    if (this.props.session.role !== undefined) {
      centerItemsToShow = this.menuItems.center.filter(
        ({ allowTo }) => allowTo[this.props.session.role]
      )
    }

    const {
      classes,
      drawerActions,
      drawerState,
      showDialog,
      signIn,
      changeUser,
      removeUser,
      session: { name = '', email = '' },
      localUsers
    } = this.props
    const { toggleDrawer, toggleHiddenBlock } = drawerActions
    const { showedHiddenBlock, opened } = drawerState

    const drawer = (
      <div className={classes.flexWrapper}>
        <Header
          toggleHiddenBlock={toggleHiddenBlock}
          primary={name}
          secondary={email}
        />

        {showedHiddenBlock ? (
          <SignList
            showDialog={showDialog}
            signIn={signIn}
            changeUser={changeUser}
            removeUser={removeUser}
            toggleHiddenBlock={toggleHiddenBlock}
            userList={localUsers.otherUsers}
          />
        ) : null}

        {/* showedHiddenBlock ? (
          <HiddenMenu
            opened={opened}
            toggleDrawer={toggleDrawer}
            items={this.menuItems.hidden}
          />
        ) : null */}

        <CenterMenu
          opened={opened}
          toggleDrawer={toggleDrawer}
          items={centerItemsToShow}
        />

        <BottomMenu
          opened={opened}
          toggleDrawer={toggleDrawer}
          items={this.menuItems.bottom}
        />
      </div>
    )

    return (
      <div>
        <Hidden>
          <Drawer
            variant='temporary'
            open={opened}
            classes={{
              paper: opened ? classes.drawerPaperDis : classes.drawerPaper
            }}
            onRequestClose={() => {
              if (showedHiddenBlock) {
                toggleHiddenBlock()
              }
              return toggleDrawer()
            }}
            ModalProps={{
              onBackdropClick: toggleDrawer
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation='css'>
          <div className={opened ? classes.insideHide : classes.inside} />
          <Drawer
            variant='persistent'
            open={!opened}
            classes={{
              paper: opened ? classes.drawerPaperDis : classes.drawerPaper
            }}
            ModalProps={{
              onBackdropClick: toggleDrawer
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer)
