import React from 'react'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import Input from 'material-ui/Input'
import SearchIcon from 'material-ui-icons/Search'
import IconButton from 'material-ui/IconButton'
import InfiniteScroll from 'react-infinite-scroller'
import styles from './theme'
import config from '../../config'
import { getObjOfURLParams } from '../../modules/navigation'

class UserGuidelinesPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      filters: {
        userGuidelinesSearch: ''
      }
    }
    this.timerId = ''
    this.handleChange = this.handleChange.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  handleLoadMore () {
    const { loadGuides } = this.props
    const { guidelines } = this.props.guidlines
    loadGuides({
      offset: guidelines.length,
      searchQuery: this.state.filters.userGuidelinesSearch
    })
  }

  handleChange (name) {
    return ({ target: { value } }) => {
      const { setFilter, reset } = this.props
      /* when we are typing something we do not want to send all that data to server */
      clearTimeout(this.timerId)
      this.setState(state => ({
        filters: {
          ...state.filters,
          userGuidelinesSearch: value
        }
      }))
      /* if we are not typing timeBeforeRequest ms -
      * we sure that here is a good time to get data with filters
      * */
      this.timerId = setTimeout(() => {
        /* one function, for all filters - in one place: set filter into URL */
        setFilter({ userGuidelinesSearch: value })
        /* clear list before fetching data with other filters */
        reset()
        this.handleLoadMore()
      }, config.timeBeforeRequest)
    }
  }

  dateToFormat (date) {
    const formattedDate = new Date(date)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return formattedDate.toLocaleString('en-US', options)
  }

  contentCutter (content) {
    if (content.length > 190) return `${content.slice(0, 190)}...`
    return content
  }

  componentDidMount () {
    const { location, filters } = this.props
    if (location.search && location.search.length > 0) {
      let filtersFromUrl = getObjOfURLParams(location.search)

      this.setState(
        state => ({
          filters: {
            ...filters,
            ...filtersFromUrl
          }
        }),
        () => {
          this.handleLoadMore()
        }
      )
    } else {
      this.handleLoadMore()
    }
  }

  componentWillUnmount () {
    const { reset } = this.props
    reset()
  }

  render () {
    const { classes } = this.props
    const { guidelines, hasMore = false } = this.props.guidlines
    let items = []

    if (guidelines) {
      guidelines.map(guide => {
        items.push(
          <Paper className={classes.paperPost} elevation={4} key={items.length}>
            <Typography
              variant='headline'
              component='h2'
              className={classes.postHeader}
            >
              {guide.title}
            </Typography>
            <Typography className={classes.title}>
              {`v2.53.11 from ${this.dateToFormat(guide.createdAt)}`}
            </Typography>
            <img
              src='https://thumbs.dreamstime.com/t/banner-design-template-material-background-business-brochure-flyer-geometric-96634286.jpg'
              className={classes.poster}
            />
            <Typography component='p'>
              {this.contentCutter(guide.content)}
              <br />
              {guide.tags}
            </Typography>
          </Paper>
        )
      })
    }

    const loader = (
      <div key={items.length} className='loader'>
        Loading ...
      </div>
    )

    return (
      <div>
        <Paper className={classes.paperSearch} elevation={4}>
          <IconButton className={classes.button} aria-label='Delete'>
            <SearchIcon />
          </IconButton>
          <Input
            placeholder='Search'
            id='searchQuery'
            label='searchQuery'
            className={classes.searchField}
            value={this.state.filters.userGuidelinesSearch}
            onChange={this.handleChange('userGuidelinesSearch')}
            autoFocus
            disableUnderline
          />
        </Paper>
        {items && items.length === 0 ? (
          <div>Empty</div>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={this.handleLoadMore}
            hasMore={hasMore}
            loader={loader}
            initialLoad={false}
          >
            {items}
          </InfiniteScroll>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(UserGuidelinesPage)
