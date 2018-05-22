import React from 'react'
import DrawerMenuItem from '../DrawerMenuItem'
import { shallow } from 'enzyme'

describe('DrawerMenuItem', () => {
  let wrapper, onClick, label, Icon
  beforeEach(() => {
    label = 'test'
    onClick = jest.fn()
    Icon = jest.fn()
    wrapper = shallow(
      <DrawerMenuItem label={label} onClick={onClick} Icon={Icon} />
    )
  })

  it('should renders as expected', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('should handle onClick()', () => {
    wrapper.props().onClick()
    expect(onClick.mock.calls.length).toEqual(1)
  })

  it('should render ListItemText with label', () => {
    expect(wrapper.childAt(1).props().primary).toEqual(label)
  })
})
