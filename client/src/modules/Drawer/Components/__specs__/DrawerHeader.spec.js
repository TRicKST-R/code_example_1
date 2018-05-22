import React from 'react'
import { shallow } from 'enzyme'
import { HeaderBlock } from '../DrawerHeader'

describe('DrawerHeader', () => {
  let toggleHiddenBlock, primary, secondary, classes, wrapper
  beforeEach(() => {
    toggleHiddenBlock = jest.fn()
    primary = 'primary'
    secondary = 'secondary'
    classes = {
      drawerHeader: 'drawerHeader',
      avatarText: 'avatarText',
      listItemText: 'listItemText'
    }
    wrapper = shallow(
      <HeaderBlock
        classes={classes}
        toggleHiddenBlock={toggleHiddenBlock}
        primary={primary}
        secondary={secondary}
      />
    )
  })

  it('should renders as expected', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should handle onClick()', () => {
    wrapper
      .childAt(0)
      .props()
      .onClick()
    expect(toggleHiddenBlock.mock.calls.length).toEqual(1)
  })

  it('should render ListItemText with primary and secondary text', () => {
    expect(
      wrapper
        .childAt(0)
        .childAt(1)
        .props().primary
    ).toEqual(primary)
    expect(
      wrapper
        .childAt(0)
        .childAt(1)
        .props().secondary
    ).toEqual(secondary)
  })

  it('should render elements with defined classes', () => {
    expect(wrapper.props().className).toEqual(classes.drawerHeader)
    expect(
      wrapper
        .childAt(0)
        .childAt(1)
        .props().classes
    ).toMatchObject({
      root: classes.avatarText,
      text: classes.listItemText
    })
  })
})
