import React from 'react'
import { shallow } from 'enzyme'
import SharedSelectTextField from '../SharedSelectTextField'

describe('<SharedSelectTextField />', () => {
  let wrapper, data, label, inputStyles, handleChange, value
  beforeEach(() => {
    data = [
      {
        value: 'value',
        label: 'label'
      }
    ]
    label = 'label'
    value = 'value'
    inputStyles = 'inputStyles'
    handleChange = jest.fn()
    wrapper = shallow(
      <SharedSelectTextField
        data={data}
        label={label}
        value={value}
        inputStyles={inputStyles}
        handleChange={handleChange}
      />
    )
  })
  it('should renders as expected', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
