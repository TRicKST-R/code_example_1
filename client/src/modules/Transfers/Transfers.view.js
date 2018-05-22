import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import InfiniteScroll from 'react-infinite-scroller'
import { withStyles } from 'material-ui/styles'

const styles = {
  enableScrollParent: {
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  enableScrollChild: {
    width: '100%',
    height: '100%',
    overflowX: 'scroll'
  },
  setPadding: {
    padding: '24px'
  }
}

class Transfers extends Component {
  constructor (props) {
    super(props)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  handleLoadMore () {
    const { loadTransfers } = this.props
    const { transfers } = this.props.transfers
    const brwId = this.props.session.company_id
    loadTransfers({
      brwId,
      offset: transfers.length
    })
  }

  componentDidMount () {
    this.handleLoadMore()
  }

  render () {
    const { transfers, hasMore } = this.props.transfers
    const { classes } = this.props

    let body = null
    if (transfers.length > 0) {
      const rows = transfers.map((t, idx) => {
        return (
          <TableRow key={idx}>
            <TableCell>{t.transfer_id}</TableCell>
            <TableCell>{t.date}</TableCell>
            <TableCell>{t.count}</TableCell>
            <TableCell>{t.id}</TableCell>
            <TableCell>{t.brand}</TableCell>
            <TableCell>{t.sender}</TableCell>
            <TableCell>{t.sender_name}</TableCell>
            <TableCell>{t.sender_state}</TableCell>
            <TableCell>{t.receiver}</TableCell>
            <TableCell>{t.receiver_name}</TableCell>
            <TableCell>{t.receiver_state}</TableCell>
          </TableRow>
        )
      })

      const loader = (
        <Paper key={transfers.length} className='loader'>
          Loading ...
        </Paper>
      )

      body = (
        <Paper zDepth={3} className={classes.enableScrollChild}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell rowspan='2'>ID</TableCell>
                <TableCell rowspan='2'>Date</TableCell>
                <TableCell rowspan='2'>Count</TableCell>
                <TableCell colspan='2'>Product</TableCell>
                <TableCell colspan='3'>From DC</TableCell>
                <TableCell colspan='3'>To DC</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>brand</TableCell>
                <TableCell>id</TableCell>
                <TableCell>name</TableCell>
                <TableCell>state</TableCell>
                <TableCell>id</TableCell>
                <TableCell>name</TableCell>
                <TableCell>state</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <InfiniteScroll
                pageStart={0}
                loadMore={this.handleLoadMore}
                hasMore={hasMore}
                loader={loader}
                initialLoad={false}
              >
                {rows}
              </InfiniteScroll>
            </TableBody>
          </Table>
        </Paper>
      )
    } else {
      body = (
        <Paper className={classes.setPadding} zDepth={3}>
          Nothing to show
        </Paper>
      )
    }

    return <div className={classes.enableScrollParent}>{body}</div>
  }
}

export default withStyles(styles)(Transfers)
