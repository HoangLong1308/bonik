import React, { useState, useEffect, memo, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Ddata from './Ddata';
import '../newarrivals/style.css';
import axios from '../../services/axios';
import { PRODUCT_BIG_DISCOUNT, BASE } from '../../constants';
import { getImage } from '../../common/img';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
const Dcard = () => {
    const SampleNextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="control-btn" onClick={onClick}>
                <button className="next">
                    <i className="fa fa-long-arrow-alt-right"></i>
                </button>
            </div>
        );
    };
    const SamplePrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="control-btn" onClick={onClick}>
                <button className="prev">
                    <i className="fa fa-long-arrow-alt-left"></i>
                </button>
            </div>
        );
    };
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    const [productDiscount, setProductDiscount] = useState([]);
    const [loading, setLoading] = useState(true);
    const size = useRef(10);
    const page = useRef(0);
    useEffect(() => {
        axios
            .get(`${BASE}${PRODUCT_BIG_DISCOUNT}`, {
                params: {
                    page: page.current,
                    size: size.current,
                },
            })
            .then((res) => {
                const value = res.data;
                setProductDiscount(value.data);
                setLoading(false);
            })
            .catch((error) => {
                // console.log(error)
                setLoading(false);
            });
    }, []);
    return (
        <>
            <Slider {...settings}>
                {!loading &&
                    productDiscount.length !== 0 &&
                    productDiscount.map((value, index) => {
                        return (
                            <Link
                                key={index}
                                to={'/product-detail/' + value.id}
                            >
                                <div className="box product" key={index}>
                                    <div
                                        className="img"
                                        style={{ height: 180 }}
                                    >
                                        <img
                                            src={getImage(value.image)}
                                            alt=""
                                            width="100%"
                                        />
                                        {value.discount != 0 && (
                                            <span
                                                style={{ color: 'white' }}
                                                className="discount"
                                            >
                                                -{value.discount}% Off
                                            </span>
                                        )}
                                    </div>
                                    <h4 style={{ height: 40 }}>
                                        {value.product_name}
                                    </h4>
                                    {value.discount != 0 ? (
                                        <span>
                                            <NumericFormat
                                                value={value.discount_price}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' VNĐ'}
                                            />
                                        </span>
                                    ) : (
                                        <span>
                                            <NumericFormat
                                                value={value.price}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' VNĐ'}
                                            />
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
            </Slider>
        </>
    );
};

export default memo(Dcard);
