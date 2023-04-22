import React, { useState, useEffect, memo, useRef } from 'react';
import axios from '../../services/axios';
import { PRODUCT_NEW_ARRIVAL, BASE } from '../../constants';
import { getImage } from '../../common/img';
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
const Cart = () => {
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
    const [productArrival, setProductArrival] = useState([]);
    const [loading, setLoading] = useState(true);
    const size = useRef(10);
    const page = useRef(0);
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        speed: 300,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        // variableWidth: true
    };
    useEffect(() => {
        axios
            .get(`${BASE}${PRODUCT_NEW_ARRIVAL}`, {
                params: {
                    page: page.current,
                    size: size.current,
                },
            })
            .then((res) => {
                const value = res.data;
                // console.log(value.data);
                setProductArrival(value.data);
                setLoading(false);
            })
            .catch((err) => {
                // console.log(err);
                setLoading(false);
            });
        // console.log(productArrival);
    }, []);
    return (
        <>
            <Slider {...settings}>
                {!loading &&
                    productArrival.length !== 0 &&
                    productArrival.map((value, index) => {
                        return (
                            <Link
                                key={index}
                                to={'/product-detail/' + value.id}
                            >
                                <div className="box product" key={index}>
                                    <div
                                        className="img"
                                        style={{ height: 180, padding: '0px 5px'}}
                                    >
                                        <img
                                            src={getImage(value.image)}
                                            alt="#"
                                            width="100%"
                                        />
                                        {value.discount !== 0 &&
                                            value.quantity !== 0 && (
                                                <span
                                                    style={{
                                                        color: 'white',
                                                    }}
                                                    className="discount"
                                                >
                                                    -{value.discount}% Off
                                                </span>
                                            )}
                                        {value.quantity === 0 && (
                                            <span
                                                className="discount"
                                                style={{
                                                    color: 'white',
                                                }}
                                            >
                                                Hết hàng
                                            </span>
                                        )}
                                    </div>
                                    <h4 style={{ height: 40}}>
                                        {value.product_name}
                                    </h4>
                                    {value.discount !== 0 ? (
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

export default memo(Cart);
