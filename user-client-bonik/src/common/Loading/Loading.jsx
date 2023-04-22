import React from 'react'
import style from './style.module.css'
import { useSelector } from 'react-redux'
const Loading = () => {
const {isLoading} = useSelector(state=>state.ModalReducer)
  return (
    <div>
        {isLoading ? 
         <div className={style.container}>
         <img src={'./images/loading.gif'} alt="#"  />
     </div> : ''
    }
       
    </div>
    
  )
}

export default Loading