import React, { useState, useRef, useEffect, memo } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import HalfRatingRead from '../../common/rating/HalfRatingRead';
import Favorite from '../../common/favorite/Favorite';
import { NumericFormat } from 'react-number-format';
import { getImage } from '../../common/img';
import axios from '../../services/axios';
import { USER, WISHLISTS } from '../../constants/user';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar } from 'antd';
import Slider from 'react-slick';
const { Meta } = Card;
const ShopCart = ({ shopItems, isAuth, isLoading }) => {
    const [count, setCount] = useState(0);
    const [isFavorite, setFavorite] = useState([]);
    let navigate = useNavigate();
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
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    //fetch wishlists of user
    useEffect(() => {
        if (isAuth) {
            axios({
                method: 'get',
                url: `${process.env.REACT_APP_URL}${USER}${WISHLISTS}`,
            })
                .then((res) => {
                    setFavorite(res.data); // if user wishlists is match with product id then fill red color
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [isAuth]);

    function addWishlists(product_id) {
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_URL}${USER}${WISHLISTS}`,
            data: [{ product_id: product_id }],
        }).catch((error) => {
            console.log(error);
        });
    }
    function removeWishlists(product_id) {
        axios({
            method: 'delete',
            url: `${process.env.REACT_APP_URL}${USER}${WISHLISTS}`,
            data: [{ product_id: product_id }],
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleChangeFavorite = (e, index, productId) => {
        if (isAuth) {
            //check if wishlists is exists
            let existsFavorite = isFavorite.findIndex(
                (item) => item.product_id === productId,
            );
            if (existsFavorite != -1) {
                //if exists then remove
                removeWishlists(productId);
                setFavorite(
                    isFavorite.filter(
                        ({ product_id }) => product_id !== productId,
                    ),
                );
            } else {
                //if user is not like then add
                addWishlists(productId);
                setFavorite([...isFavorite, { product_id: productId }]);
            }
        } else return navigate('/login');
    };
    return (
        <>
            {!isLoading ? (
                shopItems.map((shopItems, index) => {
                    return (
                        <div key={index} className="box myShop_Style">
                            <div className="product top">
                                <div className="img">
                                    {shopItems.discount !== 0 && (
                                        <span className="discount">
                                            -{shopItems.discount}% Off
                                        </span>
                                    )}
                                    {shopItems.quantity == 0 && (
                                        <span
                                            className="discount"
                                            style={{
                                                color: 'white',
                                            }}
                                        >
                                            Hết hàng
                                        </span>
                                    )}
                                    <Link
                                        to={`/product-detail/${shopItems.id}`}
                                    >
                                        <img
                                            style={{
                                                height: 180,
                                                objectFit: 'contain',
                                            }}
                                            src={getImage(shopItems.image)}
                                            alt="#"
                                        />
                                    </Link>

                                    <div className="product-like">
                                        <Favorite
                                            value={shopItems.id}
                                            onChange={(e) =>
                                                handleChangeFavorite(
                                                    e,
                                                    index,
                                                    shopItems.id,
                                                )
                                            }
                                            isFavorite={isFavorite}
                                        />
                                    </div>
                                </div>
                                <div className="product-details">
                                    <Link
                                        to={`/product-detail/${shopItems.id}`}
                                    >
                                        <h3
                                            style={{
                                               
                                                height: 40,
                                                marginBottom: 14,
                                                marginTop: 26,
                                            }}
                                        >
                                            {shopItems.product_name}
                                        </h3>
                                    </Link>
                                    <div className="rate">
                                        <HalfRatingRead
                                            value={shopItems.average_point}
                                        />
                                    </div>
                                    <div className="price">
                                        {shopItems.discount != 0 ? (
                                            <h4>
                                                <NumericFormat
                                                    value={
                                                        shopItems.discount_price
                                                    }
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' VNĐ'}
                                                />
                                            </h4>
                                        ) : (
                                            <h4>
                                                <NumericFormat
                                                    value={shopItems.price}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={' VNĐ'}
                                                />
                                            </h4>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <>
                    {new Array(10).fill(null).map((index) => {
                        return (
                            <Card
                                loading={isLoading}
                                style={{
                                    marginBottom: 16,
                                    marginTop: 16,
                                }}
                            >
                                <div key={index} className="box">
                                    <div className="product mtop">
                                        <div className="img">
                                            <span className="discount">
                                                50% Off
                                            </span>
                                            {/* <Link
                                            to={`/product-detail/${shopItems.id}`}
                                        >
                                            <img
                                                src={getImage(shopItems.image)}
                                                alt=""
                                            />
                                        </Link> */}
                                            <div className="product-like">
                                                {/* <Favorite
                                                value={shopItems.id}
                                                onChange={(e) =>
                                                    handleChangeFavorite(
                                                        e,
                                                        index,
                                                        shopItems.id,
                                                    )
                                                }
                                                isFavorite={isFavorite}
                                            /> */}
                                            </div>
                                        </div>
                                        <div className="product-details">
                                            {/* <Link
                                            to={`/product-detail/${shopItems.id}`}
                                        >
                                            <h3 style={{ color: 'black' }}>
                                                {shopItems.product_name}
                                            </h3>
                                        </Link> */}
                                            <div className="rate">
                                                {/* <HalfRatingRead
                                                value={shopItems.average_point}
                                            /> */}
                                            </div>
                                            <div className="price">
                                                <h4>
                                                    {/* <NumericFormat
                                                    value={shopItems.price}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    suffix={'đ'}
                                                /> */}
                                                </h4>
                                                {/* step : 3  
                     if hami le button ma click garryo bahne 
                    */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </>
            )}
        </>
    );
};

export default memo(ShopCart);
