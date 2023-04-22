import React, { useState, useEffect } from 'react';
import './darkMode.css';
const ButtonDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const element = document.documentElement;
    const theme = localStorage.getItem('theme');
    useEffect(() => {
        switch (theme) {
            case 'dark':
                setIsDarkMode(true);
                element.classList.add('dark');
                break;
            case 'light':
                setIsDarkMode(false);
                break;
            default:
                break;
        }
    }, []);
    const handleMode = () => {
        if(isDarkMode){
            setIsDarkMode(false)
            localStorage.setItem('theme','light')
            element.classList.remove('dark');
            
        }else{
            setIsDarkMode(true)
            localStorage.setItem('theme','dark')
            element.classList.add('dark');
        }
    };

    return (
        <div className='ButtonDarkMode_darkMode'>
            <button
                onClick={() => {
                   handleMode()
                }}
            >
                {isDarkMode ? (
                    <i class="fa fa-sun"></i>
                ) : (
                    <i class="fa fa-moon"></i>
                )}
            </button>
        </div>
    );
};

export default ButtonDarkMode;
