import { IdcardFilled } from "@ant-design/icons";
import React, { useEffect, useState,memo } from "react";
const fakeDataUrl =
  "https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo";
const ContainerHeight = 280;
const ListSpecification = ({data}) => {
  // const onScroll = (e) => {
  //   if (
  //     e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
  //     ContainerHeight
  //   ) {
  //   }
  // };
  return (
    <div className='technical_content'>
      <h3 >Thông số kỹ thuật</h3>
      
      <ul>
        {data.map(({ id,attribute_name, attribute_value }) => (
          <li className='items' key={id}>
            <p style={{margin:0}}>{attribute_name}</p>
            <div>{attribute_value}</div>
          </li>
        ))}
        </ul>
      
        
       
     
    </div>
    
  );
};
export default memo(ListSpecification);
