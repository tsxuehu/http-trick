import React from 'react'

interface IIf {
  condition: boolean
  renderer: React.ReactNode | (() => React.ReactNode)
}

const If: React.FC<IIf> = (props) => {
  const { condition, renderer } = props

  return <>{condition ? (typeof renderer === 'function' ? renderer() : renderer) : null}</>
}
export default If
