import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import React, { memo } from 'react';
import { getImage } from '../../common/img';
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
const CatCard = ({categories}) => {
    console.log('catCard: ', categories);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: categories.length<5?  categories.length :  5,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };

    return (
        <>
            <Slider {...settings}>
                {categories.map((catItems) => {
                    return (
                        <div className="catslide box">
                            <div className="cate">
                                <div className="img">
                                    <img src={getImage(catItems.img)} alt="" />
                                </div>
                                <div className="cat-details">
                                    <h4>{catItems.title}</h4>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </>
    );
};
export default memo(CatCard);
