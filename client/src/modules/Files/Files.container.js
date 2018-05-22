import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FilesView from './Files.view'
import { getFiles } from './Files.state'

export default connect(
  state => ({
    filesState: state.filesState
  }),
  dispatch => ({
    getFiles: bindActionCreators(getFiles, dispatch)
  })
)(FilesView)
