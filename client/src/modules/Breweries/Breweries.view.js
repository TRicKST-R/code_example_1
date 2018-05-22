import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'
import InfiniteScroll from 'react-infinite-scroller'

class Breweries extends Component {
  constructor (props) {
    super(props)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  handleLoadMore () {
    const { loadBreweries } = this.props
    const { breweries } = this.props.breweries
    const whsId = this.props.session.company_id
    loadBreweries({
      whsId,
      offset: breweries.length,
      orderBy: 'company_id',
      direction: 'ASC'
    })
  }

  componentWillUnmount () {
    const { resetBreweries } = this.props
    resetBreweries()
  }

  componentDidMount () {
    this.handleLoadMore()
  }

  render () {
    const { breweries, hasMore } = this.props.breweries

    let body = null
    if (breweries.length > 0) {
      const rows = breweries.map((b, idx) => {
        return (
          <TableRow key={idx}>
            <TableCell>{b.company_id}</TableCell>
            <TableCell>{b.name}</TableCell>
            <TableCell>{b.state}</TableCell>
            <TableCell>{b.orders_count}</TableCell>
          </TableRow>
        )
      })

      const loader = (
        <Paper key={breweries.length} className='loader'>
          Loading ...
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
                  <TableCell>Brewery name</TableCell>
                  <TableCell>HQ state</TableCell>
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

export default Breweries
