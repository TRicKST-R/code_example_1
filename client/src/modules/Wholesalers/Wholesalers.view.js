import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import InfiniteScroll from 'react-infinite-scroller'

export default class Wholesalers extends Component {
  constructor (props) {
    super(props)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  handleLoadMore () {
    const { loadWholesalers } = this.props
    const { wholesalers } = this.props.wholesalers
    const brwId = this.props.session.company_id
    loadWholesalers({
      brwId,
      offset: wholesalers.length,
      orderBy: 'companies.id',
      direction: 'ASC'
    })
  }

  componentDidMount () {
    this.handleLoadMore()
  }

  render () {
    const { wholesalers, hasMore } = this.props.wholesalers

    let body = null
    if (wholesalers.length > 0) {
      const rows = wholesalers.map((wh, idx) => {
        return (
          <TableRow key={idx}>
            <TableCell>{wh.company_id}</TableCell>
            <TableCell>{wh.name}</TableCell>
            <TableCell>{wh.state}</TableCell>
            <TableCell>{wh.orders_count}</TableCell>
          </TableRow>
        )
      })

      const loader = (
        <Paper key={wholesalers.length} className='loader'>
          Loading...
        </Paper>
      )

      body = (
        <Paper>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.handleLoadMore}
            hasMore={hasMore}
            loader={loader}
            initialLoad={false}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Wholesaler name</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Orders count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </InfiniteScroll>
        </Paper>
      )
    } else {
      body = <Paper>Nothing to show</Paper>
    }

    return <div>{body}</div>
  }
}
