import {useState} from 'react';
import Slider from 'react-slick';
import React, { memo } from 'react';
import CatCard from './CatCard';
import CatData from './CatData';
import './style.css';
import axios from 'axios';
import { ENV_URL, CATEGORY, API_UNAUTH_BASE } from '../../constants/index';
import { useEffect } from 'react';
const CategorySlider = () => {

    const [categories,setCategories] = useState([]);
    useEffect(() =>{
        getCategories();
    } ,[])
    const fetchCategories = async () => {
        // ${BASE}${CATEGORY}
        return await (
            await axios.get(`${ENV_URL}${API_UNAUTH_BASE}${CATEGORY}`)
        ).data;
    };

    let getCategories = async() => {
        let cat = await fetchCategories();
        
        let cate = cat.map(e => {
            let img = `cat_${e.title.replace(/\s/g, '')}.png`;
        console.log('img: ', img.toLowerCase());
            return  {...e, img: img.toLowerCase()};} );
        console.log('cat: ',cate);

        setCategories((prev) => {return cate;});
        }
      
    // console.log('ca: ', categories);

    return (
        <>
            <section className="flash category-flash">
                <div className="container">
                    <div className="heading f_flex">
                        <i className="fa fa-bolt"></i>
                        <h1>Danh mục</h1>
                    </div>
                    <CatCard categories={categories} />
                </div>
            </section>
        </>
    );
};
export default memo(CategorySlider);
