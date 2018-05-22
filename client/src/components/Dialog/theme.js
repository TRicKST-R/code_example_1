export const dialog = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  buttonInDialog: {
    marginTop: theme.spacing.unit
  },
  wrap: {
    [theme.breakpoints.up('sm')]: {
      width: 800
    },
    [theme.breakpoints.down('sm')]: {
      width: 480
    },
    [theme.breakpoints.down('xs')]: {
      width: 320
    }
  },
  chooseButtonLabel: {
    display: 'block',
    margin: '0 auto',
    width: 'fit-content'
  },
  canvas: {
    margin: '0 auto 24px auto',
    display: 'block'
  },
  volumesWrap: {
    display: 'block'
  },
  actionWrap: {
    display: 'block',
    margin: '24px auto 24px auto'
  },
  rangeInput: {
    '-webkit-appearance': 'none',
    margin: '30px 0',
    width: 296,
    '&:focus': {
      outline: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      width: 240
    },
    '&::-webkit-slider-runnable-track': {
      width: '100%',
      height: 14,
      cursor: 'pointer',
      background: '#999999',
      borderRadius: 6
    },
    '&::-webkit-slider-thumb': {
      cursor: 'pointer',
      '-webkit-appearance': 'none',
      marginTop: -3,
      height: 20,
      width: 20,
      borderRadius: '50%',
      boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.6)',
      // transition: '-webkit-transform linear .08s, background-color linear .08s',
      transition: 'transform linear .08s, background-color linear .08s',
      willChange: 'transform',
      backgroundColor: '#fafafa'
    },
    '&:focus::-webkit-slider-runnable-track': {
      boxShadow: '0 1px 5px 0 rgba(45,166,247,1)'
    },
    '&::-moz-range-track': {
      width: '100%',
      height: 14,
      cursor: 'pointer',
      background: '#999999',
      borderRadius: 6
    },
    '&::-moz-range-thumb': {
      cursor: 'pointer',
      '-webkit-appearance': 'none',
      marginTop: -3,
      height: 20,
      width: 20,
      borderRadius: '50%',
      boxShadow: '0 1px 5px 0 rgba(0, 0, 0, 0.6)',
      backgroundColor: '#fafafa'
    },
    '&::-ms-track': {
      width: '100%',
      height: 14,
      cursor: 'pointer',
      animate: '0.2s',
      background: 'transparent',
      borderColor: 'transparent',
      borderWidth: '16px 0',
      color: 'transparent'
    },
    '&::-ms-fill-lower': {
      background: '#2a6495',
      border: '0.2px solid #010101',
      borderRadius: 2.6,
      boxShadow: '1px 1px 1px #000000, 0px 0px 1px #0d0d0d'
    },
    '&::-ms-thumb': {
      boxShadow: '1px 1px 1px #000000, 0px 0px 1px #0d0d0d',
      border: '1px solid #000000',
      height: 20,
      width: 20,
      borderRadius: 10,
      background: '#ffffff',
      cursor: 'pointer'
    },
    '&:focus::-ms-fill-lower': {
      background: '#3071a9'
    },
    '&:focus::-ms-fill-upper': {
      background: '#367ebd'
    }
  },
  controlsWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  rotateButtons: {
    margin: 16
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  actionWrapRight: {
    margin: '24px auto 8px auto'
  },
  croppedImage: {
    margin: '0 auto 24px auto',
    display: 'block'
  },
  croppedActionWrap: {
    width: 250,
    margin: '24px auto 8px auto',
    display: 'flex',
    justifyContent: 'space-around'
  },
  iconGray: {
    color: 'rgba(0,0,0,0.65)'
  }
})
