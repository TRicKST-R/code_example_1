import React from 'react'
import { shallow } from 'enzyme'
import { CenterBlock } from '../DrawerCenterMenu'

describe('DrawerCenterMenu', () => {
  let toggleDrawer, items, opened, wrapper, classes
  beforeEach(() => {
    toggleDrawer = jest.fn()
    items = [{ label: 'testItem1' }]
    classes = {
      flexCenter: 'flexCenter',
      centerList: 'centerList'
    }
    opened = true
    wrapper = shallow(
      <CenterBlock
        opened={opened}
        classes={classes}
        toggleDrawer={toggleDrawer}
        items={items}
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
    expect(toggleDrawer.mock.calls.length).toEqual(1)
    wrapper.setProps({ opened: false })
    wrapper
      .childAt(0)
      .props()
      .onClick()
    expect(toggleDrawer.mock.calls.length).toEqual(1)
  })

  it('should render DrawerCenterMenu with label', () => {
    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .props().label
    ).toEqual(items[0].label)
  })

  it('should render elements with defined classes', () => {
    expect(wrapper.props().className).toEqual(classes.flexCenter)
    expect(wrapper.childAt(0).props().className).toEqual(classes.centerList)
  })
})
