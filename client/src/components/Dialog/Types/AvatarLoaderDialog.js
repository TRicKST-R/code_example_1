import React, { Component } from 'react'
import { DialogContent, DialogActions } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import { dialog as styles } from '../theme'
import Divider from 'material-ui/Divider'
import classNames from 'classnames'
import Undo from 'material-ui-icons/Undo'
import Redo from 'material-ui-icons/Redo'
import Check from 'material-ui-icons/Check'
import PersonOutline from 'material-ui-icons/PersonOutline'
import DoneAll from 'material-ui-icons/DoneAll'
import Replay from 'material-ui-icons/Replay'

import AvatarEditor from 'react-avatar-editor'

class AvatarLoaderDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedImage: undefined,
      croppedImage: undefined,
      width: 250,
      height: 250,
      border: 10,
      color: [255, 255, 255, 0.6],
      scale: 1,
      rotate: 0
    }
    this.handleSelectImage = this.handleSelectImage.bind(this)
    this.rotateLeft = this.rotateLeft.bind(this)
    this.rotateRight = this.rotateRight.bind(this)
    this.handleScale = this.handleScale.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.saveCroppedImage = this.saveCroppedImage.bind(this)
    this.dismissCroppedImage = this.dismissCroppedImage.bind(this)
    this.setEditorRef = this.setEditorRef.bind(this)
  }

  handleSelectImage (e) {
    this.setState({ selectedImage: e.target.files[0] })
  }

  rotateLeft () {
    this.setState({
      rotate: this.state.rotate - 90
    })
  }

  rotateRight () {
    this.setState({
      rotate: this.state.rotate + 90
    })
  }

  handleScale (e) {
    const scale = parseFloat(e.target.value)
    this.setState({ scale })
  }

  handleSave () {
    const img = this.editor.getImageScaledToCanvas().toDataURL()

    this.setState({ croppedImage: img, selectedImage: undefined })
  }

  saveCroppedImage () {
    this.props.dialogProps.setSelectedImage(this.state.croppedImage)
  }
  dismissCroppedImage () {
    this.setState({ croppedImage: undefined, selectedImage: undefined })
  }

  setEditorRef (editor) {
    if (editor) this.editor = editor
  }

  render () {
    const {
      selectedImage,
      croppedImage,
      width,
      height,
      rotate,
      border
    } = this.state
    const { classes, actions } = this.props
    return (
      <div className={classes.wrap}>
        <DialogContent className={classes.volumesWrap}>
          {selectedImage && (
            <AvatarEditor
              ref={this.setEditorRef}
              image={selectedImage}
              width={width}
              height={height}
              border={border}
              scale={parseFloat(this.state.scale)}
              rotate={parseFloat(rotate)}
              onSave={this.handleSave}
              className={classes.canvas}
              style={{
                margin: '0 auto 16px auto',
                display: 'block',
                cursor: 'move'
              }}
            />
          )}
          {!croppedImage && (
            <div>
              <input
                style={{ display: 'none' }}
                accept='image/*'
                id='select-image-input'
                type='file'
                className={classes.input}
                onChange={this.handleSelectImage}
              />
              <label
                htmlFor='select-image-input'
                className={classes.chooseButtonLabel}
              >
                <Button
                  color='primary'
                  raised
                  component='span'
                  className={classes.chooseButton}
                >
                  change avatar
                  <PersonOutline className={classes.rightIcon} />
                </Button>
              </label>
            </div>
          )}

          {selectedImage && (
            <div>
              <Divider style={{ marginTop: 24 }} />
              <div className={classes.controlsWrap}>
                <DialogActions className={classes.actionWrap}>
                  <div>
                    Zoom:
                    <br />
                    <input
                      name='scale'
                      type='range'
                      onChange={this.handleScale}
                      min='1'
                      max='3'
                      step='0.01'
                      defaultValue='1'
                      className={classes.rangeInput}
                    />
                  </div>
                </DialogActions>
                <DialogActions className={classes.actionWrap}>
                  <div>
                    Rotate: <br />
                    <Button
                      raised
                      color='primary'
                      // className={classes.button}
                      onClick={this.rotateLeft}
                      className={classes.rotateButtons}
                    >
                      Left
                      <Undo className={classes.rightIcon} />
                    </Button>{' '}
                    <Button
                      raised
                      color='primary'
                      // className={classes.button}
                      onClick={this.rotateRight}
                      className={classes.rotateButtons}
                    >
                      Right
                      <Redo className={classes.rightIcon} />
                    </Button>
                  </div>
                </DialogActions>
              </div>
              <Divider />
              <DialogActions className={classes.actionWrapRight}>
                <div>
                  <Button color='primary' raised onClick={this.handleSave}>
                    Crop
                    <Check className={classes.rightIcon} />
                  </Button>
                </div>
              </DialogActions>
            </div>
          )}
          {croppedImage && (
            <div>
              <img src={croppedImage} className={classes.croppedImage} />
              <Divider />
              <DialogActions className={classes.croppedActionWrap}>
                <Button
                  raised
                  onClick={() => {
                    this.dismissCroppedImage()
                    actions.hideDialog()
                  }}
                >
                  Cancel
                  <Replay
                    className={classNames(classes.rughtIcon, classes.iconGray)}
                  />
                </Button>
                <Button
                  raised
                  onClick={() => {
                    this.saveCroppedImage()
                    actions.hideDialog()
                  }}
                  color='primary'
                >
                  Save
                  <DoneAll className={classes.rightIcon} />
                </Button>
              </DialogActions>
            </div>
          )}
        </DialogContent>
      </div>
    )
  }
}

export default withStyles(styles)(AvatarLoaderDialog)
