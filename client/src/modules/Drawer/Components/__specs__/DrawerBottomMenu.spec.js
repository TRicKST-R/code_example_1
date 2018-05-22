import React from 'react'
import { shallow } from 'enzyme'
import { BottomBlock } from '../DrawerBottomMenu'

describe('DrawerBottomMenu', () => {
  let toggleDrawer, items, opened, wrapper
  beforeEach(() => {
    toggleDrawer = jest.fn()
    items = [{ label: 'testItem1' }]
    opened = true
    wrapper = shallow(
      <BottomBlock opened={opened} toggleDrawer={toggleDrawer} items={items} />
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
})
