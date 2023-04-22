import React, { useEffect, memo, useState, useRef } from 'react';
import './style.css';
import ShopProduct from './ShopProduct';
import axios from '../../services/axios';
import { PRODUCT_TOP_SALES, BASE } from '../../constants';
const TopSales = ({ isAuth }) => {
    const [topSales, setTopSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const size = useRef(10);
    const page = useRef(0);
    useEffect(() => {
        axios
            .get(`${BASE}${PRODUCT_TOP_SALES}`, {
                params: {
                    page: page.current,
                    size: size.current,
                },
            })
            .then((res) => {
                const value = res.data;
                setTopSales(value.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                // console.log(error);
            });
    }, []);
    return (
        <>
            <section className="TopSales background">
                <div className="container">
                    <div className="heading d_flex">
                        <div className="heading-left row  f_flex">
                            <img src="https://img.icons8.com/glyph-neue/64/26e07f/new.png" />
                            <h2>Bán chạy </h2>
                        </div>
                        <div className="heading-right row ">
                            <span className="expand-link">Tất cả</span>
                            <i className="fa-solid fa-caret-right"></i>
                        </div>
                    </div>
                    <section className="shop">
                        <div className="container">
                            <div className="contentWidthHome">
                                <div className="product-content  grid1">
                                    <ShopProduct
                                        shopItems={topSales}
                                        isAuth={isAuth}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>
        </>
    );
};

export default memo(TopSales);
