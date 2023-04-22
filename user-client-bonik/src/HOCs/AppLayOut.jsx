import React from 'react'
import Header from '../common/header/Header'
import Footer from '../common/footer/Footer'
const AppLayOut = (props) => {
  return (
    <>
    <Header  />
    {props.children}
    <Footer />
</>
  )
}

export default AppLayOut