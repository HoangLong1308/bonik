import React, { memo } from 'react';
import './Header.css';
import './../header/CartPopover.css'
import Search from './Search';
import Navbar from './Navbar';

const Header = () => {
    return (
        <>
            <Search  />
            <Navbar />
        </>
    );
};

export default memo(Header);
