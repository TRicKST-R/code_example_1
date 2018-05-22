import React, { Component } from 'react'
import Panel from '../Panel/Panel'
import PresetsList from './PresetsList/PresetsList'
// import Actions from './Actions/Actions'
import PropTypes from 'prop-types'

class Presets extends Component {
  constructor (props) {
    super(props)
    this.deletePreset = this.deletePreset.bind(this)
    this.state = {
      presets: this.props.presets || []
    }
  }

  componentWillReceiveProps ({ presets }) {
    this.setState({
      presets
    })
  }

  deletePreset (name) {
    const { presets } = { ...this.state }
    const { removePreset } = this.props
    const idx = presets.findIndex(preset => {
      return preset.name === name
    })
    removePreset(presets[idx])
    presets.splice(idx, 1)
    this.setState({ presets })
  }

  render () {
    return (
      <Panel
        defaultExpanded={this.props.defaultExpanded}
        title='Filter presets'
        details={
          <PresetsList
            presets={this.state.presets}
            onDeleteBtnClick={this.deletePreset}
            choosePreset={this.props.choosePreset}
          />
        }
      />
    )
  }
}

Presets.propTypes = {
  preset: PropTypes.object,
  presets: PropTypes.arrayOf(PropTypes.object),
  choosePreset: PropTypes.func,
  removePreset: PropTypes.func,
  savePreset: PropTypes.func
}

export default Presets
