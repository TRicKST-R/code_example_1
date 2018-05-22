import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import { withStyles } from 'material-ui/styles'

const styles = {
  wrap: {
    flexWrap: 'wrap'
  },
  borderTop: {
    borderTop: '1px solid #eeeeee'
  }
}

class Panel extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isExpanded: props.defaultExpanded
    }
  }

  getPanelState (e, expanded) {
    let { isExpanded } = this.state
    isExpanded = expanded
    this.setState({ isExpanded })
  }

  render () {
    return (
      <ExpansionPanel
        defaultExpanded={this.props.defaultExpanded}
        onChange={this.getPanelState.bind(this)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid>
            <Typography variant='title'>{this.props.title}</Typography>
            {/* {this.state.isExpanded && (
              <Typography variant='subheading'>Click to collapse</Typography>
            )} */}
          </Grid>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          className={this.props.classes.wrap}
          children={this.props.details}
        />
        {this.props.actions && (
          <ExpansionPanelActions
            children={this.props.actions}
            className={this.props.classes.borderTop}
          />
        )}
      </ExpansionPanel>
    )
  }
}

export default withStyles(styles)(Panel)
