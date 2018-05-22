import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table, {
  TableCell,
  TableHead,
  TableRow,
  TableBody
} from 'material-ui/Table'
import { withStyles } from 'material-ui/styles'
import Card, { CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import InfiniteScroll from 'react-infinite-scroller'
import Cell from './TableCell'
import _ from 'lodash'

const styles = theme => ({
  setMarginRight: {
    marginRight: '8px',
    paddingLeft: theme.spacing.unit
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    tableLayout: 'fixed'
  }
})

/* renders card with table and infinite scrol */
/* params: headersKeys: { accessKey: '', header: '' }, handleLoadMore: func, hasMore: boolean, list: array */
export class CardWithTable extends Component {
  shouldComponentUpdate (nextProps) {
    const { props } = this
    if (_.isEqual(nextProps, props)) {
      return false
    }
    return true
  }

  render () {
    const {
      classes,
      headersKeys,
      list = [],
      hasMore,
      handleLoadMore,
      children
    } = this.props
    let render
    if (list.length === 0) {
      render = <Typography variant={'subheading'}>No items</Typography>
    } else {
      render = (
        <InfiniteScroll
          pageStart={0}
          loadMore={handleLoadMore}
          hasMore={hasMore}
          initialLoad={false}
        >
          <Table className={classes.root}>
            <TableHead>
              <TableRow>
                {headersKeys.map(({ header }, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((wh, index) => (
                <TableRow key={index}>
                  {headersKeys.map(({ accessKey }, index) => (
                    <Cell key={index} value={wh[accessKey]} />
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfiniteScroll>
      )
    }

    return (
      <Card>
        <CardContent>
          <Typography variant={'title'}>{children}</Typography>
          {render}
        </CardContent>
      </Card>
    )
  }
}

CardWithTable.propTypes = {
  headersKeys: PropTypes.array,
  list: PropTypes.array,
  hasMore: PropTypes.bool,
  handleLoadMore: PropTypes.func
}

export default withStyles(styles)(CardWithTable)
