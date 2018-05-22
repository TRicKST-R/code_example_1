import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import Button from 'material-ui/Button'
import styles from './theme'
import Tooltip from 'material-ui/Tooltip'

class Files extends Component {
  dateToFormat (date) {
    const formattedDate = new Date(date)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return formattedDate.toLocaleString('en-US', options)
  }

  sizeToFormat (size) {
    if (size === '0') return ''
    let res = ''
    if (size.length > 0 && size.length < 4) res = `${size}b`
    if (size.length > 0 && size.length < 7) res = `${size.slice(0, 4)}kb`
    else res = `${(size / 1000000).toFixed(1)}mb`
    return res
  }

  componentWillMount () {
    const { getFiles } = this.props
    getFiles()
  }

  render () {
    const { classes } = this.props
    const { files } = this.props.filesState

    return (
      <div className={classes.wrapper}>
        {files &&
          files.map((file, index) => {
            return (
              <a href={file.link} target='_blank' key={index}>
                <Tooltip title='Click to download' placement='left'>
                  <div className={classes.file}>
                    <Typography variant='headline' component='h2'>
                      {file.name}
                    </Typography>
                    <Typography component='p'>
                      {this.sizeToFormat(file.size)}
                    </Typography>
                    <Typography component='p'>
                      {this.dateToFormat(file.date)}
                    </Typography>
                  </div>
                </Tooltip>
                <Divider />
              </a>
            )
          })}
        {false && (
          <div className={classes.upload}>
            <Divider />
            <input
              accept='image/*'
              className={classes.input}
              id='raised-button-file'
              multiple
              type='file'
            />
            <label htmlFor='raised-button-file'>
              <Button className={classes.uploadButton} component='span'>
                Upload New File
              </Button>
            </label>
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Files)
