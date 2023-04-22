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
const { Meta } = Card;
const ShopProduct = ({ shopItems, isLoading }) => {
    return (
        <>
            {shopItems.length !== 0 && !isLoading ? (
                shopItems.map((shopItems, index) => {
                    return (
                        <div key={shopItems.id} className="box myShop_Style">
                            <div className="product top">
                                <div
                                    className="img"
                                    style={{
                                        height: 180,
                                        objectFit: 'contain',
                                    }}
                                >
                                    {shopItems.discount !== 0 &&
                                        shopItems.quantity !== 0 && (
                                            <span className="discount">
                                                {shopItems.discount}% Off
                                            </span>
                                        )}
                                    {shopItems.quantity === 0 && (
                                        <span className="discount">
                                            Hết hàng
                                        </span>
                                    )}
                                    <Link
                                        to={`/product-detail/${shopItems.id}`}
                                    >
                                        <img
                                            src={getImage(shopItems.image)}
                                            alt=""
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </Link>
                                </div>
                                <div className="product-details">
                                    <Link
                                        to={`/product-detail/${shopItems.id}`}
                                    >
                                        <h3
                                            style={{
                                             
                                                height: 40,
                                                marginTop: 26,
                                                marginBottom: 14,
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
                                        <h4>
                                            <NumericFormat
                                                value={shopItems.price}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' VNĐ'}
                                            />
                                        </h4>
                                        {/* step : 3  
                 if hami le button ma click garryo bahne 
                */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <>
                    {new Array(10).fill(null).map((value, index) => {
                        return (
                            <Card
                                key={index}
                                loading={isLoading}
                                style={{
                                    marginBottom: 16,
                                    marginTop: 16,
                                }}
                            >
                                <div className="box">
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

export default memo(ShopProduct);
