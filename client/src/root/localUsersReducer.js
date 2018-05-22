import ls from '../utils/ls'
import {
  SESSION_STATE,
  REMOVE_USER,
  ADD_USER,
  CHANGE_USER,
  SIGN_OUT
} from '../redux/actionTypes'
import {showSnack} from '../redux/snackReducer'

const initialState = {
  otherUsers: [],
  currentUser: {}
}

const localUsersReducer = {
  [SESSION_STATE]: (state, payload) => {
    return {
      ...state,
      currentUser: { email: payload.email, name: payload.name },
      otherUsers: ls.get('localUsers') ? ls.get('localUsers') : []
    }
  },
  [ADD_USER]: (state, payload) => {

    console.log(showSnack)
    showSnack('test')

    let existingEmails = []
    state.otherUsers.map( user => existingEmails.push(user.email))
    existingEmails.push(state.currentUser.email)

    if(existingEmails.indexOf(payload.email) !== -1){
      showSnack('User was added earlier')
      alert('User was added earlier')
      return state
    }
    else{
      ls.save('localUsers', [
        ...state.otherUsers,
        {
          email: state.currentUser.email,
          name: state.currentUser.name,
          token: ls.get('token')
        }
      ])
      ls.save('token', payload.token)
      window.location.reload()
    }
  },
  [CHANGE_USER]: (state, payload) => {
    const newToken = state.otherUsers[payload].token
    const newOtherUsers = state.otherUsers.slice()
    newOtherUsers[payload] = {
      email: state.currentUser.email,
      name: state.currentUser.name,
      token: ls.get('token')
    }
    ls.save('localUsers', newOtherUsers)
    ls.save('token', newToken)
    window.location.reload()
  },
  [REMOVE_USER]: (state, payload) => {
    let newOtherUsers = state.otherUsers.slice()
    newOtherUsers = newOtherUsers.filter(
      (user, index) => index !== parseInt(payload)
    )
    ls.save('localUsers', newOtherUsers)
    return {
      ...state,
      otherUsers: newOtherUsers
    }
  },
  [SIGN_OUT]: state => {
    ls.remove('token')
    ls.remove('localUsers')
    return state
  }
}

export const changeUser = index => ({
  type: CHANGE_USER,
  payload: index
})

export const removeUser = index => ({
  type: REMOVE_USER,
  payload: index
})

export const localUsersRootReducer = (state = initialState, action) => {
  let reducer = localUsersReducer[action.type]
  return reducer ? reducer(state, action.payload) : state
}
