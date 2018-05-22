import React from 'react'
import { shallow } from 'enzyme'
import { ResponsiveDrawer } from '../Drawer.view'

describe('<ResponsiveDrawer />', () => {
  let toggleDrawer,
    toggleHiddenBlock,
    opened,
    wrapper,
    classes,
    disabled,
    drawerActions,
    showedHiddenBlock
  beforeEach(() => {
    classes = {
      navIconHide: 'navIconHide',
      drawerHeader: 'drawerHeader',
      drawerPaper: 'drawerPaper',
      drawerPaperDis: 'drawerPaperDis',
      flexCenter: 'flexCenter',
      flexWrapper: 'flexWrapper',
      inside: 'inside'
    }
    opened = true
    disabled = false
    drawerActions = {
      toggleDrawer: jest.fn(),
      toggleHiddenBlock: jest.fn()
    }
    showedHiddenBlock = true
    wrapper = shallow(
      <ResponsiveDrawer
        classes={classes}
        opened={opened}
        disabled={disabled}
        drawerActions={drawerActions}
        toggleHiddenBlock={toggleHiddenBlock}
        toggleDrawer={toggleDrawer}
        showedHiddenBlock={showedHiddenBlock}
      />
    )
  })
  it('should renders as expected', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should handle toggleHiddenBlock and toggleDrawer', () => {
    wrapper
      .childAt(0)
      .childAt(0)
      .props()
      .onRequestClose()
    expect(drawerActions.toggleHiddenBlock.mock.calls.length).toEqual(1)
    wrapper.setProps({ showedHiddenBlock: false })
    wrapper
      .childAt(0)
      .childAt(0)
      .props()
      .onRequestClose()
    expect(drawerActions.toggleDrawer.mock.calls.length).toEqual(2)
  })

  it('should render div className inside or insideHide, relates on props', () => {
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .props().className
    ).toEqual(classes.inside)
    wrapper.setProps({ disabled: true })
    expect(
      wrapper
        .childAt(1)
        .childAt(0)
        .props().className
    ).toEqual(classes.insideHide)
  })

  it('should render div className drawerPaper or drawerPaperDis, relates on props', () => {
    expect(
      wrapper
        .childAt(1)
        .childAt(1)
        .props().classes
    ).toMatchObject({
      paper: classes.drawerPaper
    })
    wrapper.setProps({ disabled: true })
    expect(
      wrapper
        .childAt(1)
        .childAt(1)
        .props().classes
    ).toMatchObject({
      paper: classes.drawerPaperDis
    })
  })
})
