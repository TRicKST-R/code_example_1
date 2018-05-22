export let drawerWidth = 240

export const styles = theme => ({
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      height: '100%'
    }
  },
  drawerPaperDis: {
    minWidth: 300,
    [theme.breakpoints.up('md')]: {
      minWidth: 300,
      position: 'fixed',
      height: '100%'
    }
  },
  flexCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    display: 'flex'
  },
  flexStart: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'start',
    display: 'flex'
  },
  flexWrapper: {
    flex: '1 0 auto',
    flexDirection: 'column',
    justifyContent: 'center',
    display: 'flex'
  },
  centerList: {
    height: '97%'
  },
  inside: {
    width: 250,
    position: 'relative'
  },
  insideHide: {
    width: 0,
    position: 'relative'
  },
  avatarText: {
    maxHeight: '40px',
    width: '152px'
  },
  listItemText: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  popoverItem: {
    minWidth: drawerWidth
  }
})
