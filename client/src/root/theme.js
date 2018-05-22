import { createMuiTheme } from 'material-ui/styles'
import { drawerWidth } from './../modules/Drawer/theme'

export default createMuiTheme({
  // https://material-ui-next.com/customization/themes/#the-other-variables
  // overrides
})

export const appBar = theme => ({
  appBar: {
    position: 'fixed',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  appBarFull: {
    position: 'fixed',
    marginLeft: 0,
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

export const rootStyle = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing.unit * 3,
    zIndex: 1
    // overflow: 'hidden'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  content: {
    boxSizing: 'border-box',
    margin: 'auto',

    // padding: '16px',
    position: 'relative',

    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64
    },
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth + 20}px)`
    }
  }
})
