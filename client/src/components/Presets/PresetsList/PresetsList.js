import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import List from 'material-ui/List'
import Preset from '../Preset/Preset'

class PresetsList extends Component {
  render () {
    return (
      <Grid container>
        {this.props.presets.map((preset, index) => {
          const { name, preset: { columns, orderBy, filters } } = preset
          return (
            <Grid key={index} item xs={12}>
              <List>
                <Preset
                  name={name}
                  columns={columns}
                  orderBy={orderBy}
                  filtering={filters}
                  onDeleteBtnClick={this.props.onDeleteBtnClick}
                  choosePreset={this.props.choosePreset(preset)}
                />
              </List>
            </Grid>
          )
        })}
      </Grid>
    )
  }
}

export default PresetsList
