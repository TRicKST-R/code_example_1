import React from 'react'

import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import Button from 'material-ui/Button'
import PhotoCamera from 'material-ui-icons/PhotoCamera'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

const styles = {
  root: {
    padding: 16
  },
  avatarContainer: {
    width: '25%',
    // height: 'auto',
    position: 'relative'
  },
  avatar: {
    borderRadius: '50%',
    maxWidth: '100%',
    maxHeight: '100%'
  },
  chooseAvatarButton: {
    position: 'absolute',
    top: '75%',
    left: '70%'
  }
}

class AvatarLoaderPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedImage: undefined
    }
    this.setSelectedImage = this.setSelectedImage.bind(this)
  }

  setSelectedImage (image) {
    this.setState({ selectedImage: image })
  }

  render () {
    const { classes, showDialog } = this.props
    const { selectedImage } = this.state
    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography variant='headline' component='h3' gutterBottom>
            Avatar Settings
          </Typography>
          <Divider />
          <Typography component='div' className={classes.root}>
            <div className={classes.avatarContainer}>
              <img
                className={classes.avatar}
                src={
                  selectedImage === null
                    ? 'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png'
                    : selectedImage
                }
              />
              <br />
              <Button
                className={classes.chooseAvatarButton}
                fab
                color='primary'
                aria-label='add'
                onClick={() =>
                  showDialog('AvatarLoaderDialog', {
                    setSelectedImage: this.setSelectedImage,
                    title: 'Choose an avatar'
                  })}
              >
                <PhotoCamera />
              </Button>
            </div>
          </Typography>
        </Paper>
        <div />
        <br />
        <Divider />
      </div>
    )
  }
}

export default withStyles(styles)(AvatarLoaderPage)
