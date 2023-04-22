import React from 'react'
import { useState, useEffect } from 'react';
import styles from "./Style.module.css"; 
import {ArrowUpOutlined} from '@ant-design/icons'
const BackToTop = () => {
    const [showButton, setShowButton] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
          const position = window.pageYOffset;
          setShowButton(position > 100);
        };
      
        window.addEventListener('scroll', handleScroll, { passive: true });
      
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);


  return (
    <div className={styles.backToTop}>
    {/* your page content goes here */}
    {showButton && (
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="back-to-top"
      >
        <ArrowUpOutlined />
      </button>
    )}
  </div>
  )
}

export default BackToTop