import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TransactionsView from './Transactions.view'
import { transactions } from './Transactions.state'
import { push } from 'react-router-redux'

export default connect(
  state => ({
    transactionsState: state.transactionsState
  }),
  dispatch => ({
    transactions: bindActionCreators(transactions, dispatch),
    push: bindActionCreators(push, dispatch)
  })
)(TransactionsView)
