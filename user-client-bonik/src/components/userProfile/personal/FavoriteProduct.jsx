import { React, memo, useEffect, useState, useCallback } from 'react';
import { Card, Col, Row, Button } from 'antd';
import axios from '../../../services/axios';
import { USER_WISHLIST, USER, WISHLISTS } from '../../../constants/user';
import { ENV_URL } from '../../../constants/index';
import { Link } from 'react-router-dom';
import { getImage } from '../../../common/img';

import { useNavigate } from 'react-router-dom';
import FavoriteProductCard from './FavoriteProductCard';

const ITEM_PER_PAGE = 3;
const SIZE_PARAM = `?size=${ITEM_PER_PAGE}`;
const PAGE_PARAM = `page=`;
const FavoriteProduct = () => {
    console.log('load FavoriteProduct');
    const navigate = useNavigate();
    const [favList, setFavList] = useState({});
    const [favItems, setFaveItems] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchMoreFaveItems();
        return () => {
            setPage((prev) => prev + 1);
        };
    }, []);

    const fetchListBy = async (page, size) => {
        let res = await await (
            await axios({
                method: 'GET',
                url: `${ENV_URL}${USER_WISHLIST}`,
                params: { size: size, page: page },
            })
        ).data;
        return res;
    };
    const fetchMoreFaveItems = async () => {
        // console.log('current page -----', page);
        let res = await fetchListBy(page, ITEM_PER_PAGE);
        setFavList(res);
        let itemList = res.data;
        let { totalPage, page: curPage, size } = res;
        setPage((prev) => prev + 1);
        setFaveItems((prev) => {
            return prev.concat(itemList);
        });
        setHasMore(curPage + 1 < totalPage);
        // console.log('data: ', res);
        // console.log('items: ', favItems);
        // console.log('hasMore: ', hasMore);
    };
    const onClickLoadMore = () => {
        fetchMoreFaveItems();
    };

    console.log('fava', favList);
    let { data: favItemsz, totalPage, page: curPage, size } = favList;

    if (!favItemsz) favItemsz = [];
    // console.log('%cITEMS: ', 'color:hotpink', favItems);

    function wishlistItemDetail(item) {
        const {
            product_name: name,
            product_image: image,
            product_category_name: cate,
            product_id: id,
        } = item;
        return { name: name, image: image, cate: cate, id: id, isRemoved: false };
    }
    const handleFavoriteClick = useCallback(async function (item) {
        let itemIndex = favItems.findIndex((i) => i.product_id === item.id);
        // console.log('item index in list: ', itemIndex);
        setFaveItems((prev) => {
            return [...prev.filter((value, index) => index !== itemIndex)];
        });

        // console.log('set false item: ', item.id);
        // console.log('faveItems after removed; ', favItems);
        let list = await removeWishlists(item.id);
        pushMore(list);
        // console.log('current page; ', page);
    });

    async function pushMore(list) {
        if (list.length === 0) return;
        if (page === 1) {
            let res = await fetchListBy(0, ITEM_PER_PAGE);
            let { totalPage, page: curPage, size } = res;
            setFavList(res);
            setPage((prev) => {
                return 1;
            });
            setFaveItems((prev) => {
                return [...res.data];
            });
            setHasMore(curPage + 1 < totalPage);
        } else {
            let totalLoaded = favItems.length;
            let res = await fetchListBy(0, totalLoaded);
            let { totalPage, page: curPage, size } = res;
            setFavList(res);
            setPage((prev) => {
                return prev + 1;
            });
            setFaveItems((prev) => {
                return [...res.data];
            });
            setHasMore(curPage + 1 < totalPage);
        }
    }
    useEffect(() => {
        // console.log('load remove fave');
        // console.log('faveItems after removed; ', favItems);
    }, [favItems]);
    //remove wishlist
    async function removeWishlists(product_id) {
        try {
            return await axios({
                method: 'delete',
                url: `${ENV_URL}${USER}${WISHLISTS}`,
                data: [{ product_id: product_id }],
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div
            style={{
                width: '100%',
                minHeight: '750px',
                // backgroundColor: 'rgba(0,0,0,.09)',
                overflow: 'hidden',
            }}>
            {!favItems || favItems.length === 0 ? (
                <div
                    className="d_flex"
                    style={{
                        width: '100%',
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: 'column',
                        minHeight: '500px'
                    }}>
                    <h3> Danh sách yêu thích trống</h3>
                    <Link to="/product">Đến trang sản phẩm</Link>
                </div>
            ) : (
                <div
                    className="site-card-wrapper wishlist-container"
                    style={{ padding: '2rem .5rem' , margin: '4rem auto' }}
                >
                    {/* <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                        <div></div>
                        <span>Tổng sản phẩm: {favItems.length}</span>
                        <span>Tổng trang: {totalPage}</span>
                        <span>Size: {size}</span>
                        <span>curreent: {curPage + 1} </span>
                    </div> */}
                    <div></div>
                    <Row gutter={[16, 24]} justify="center">
                        {favItems.map((value, index) => {
                            return (
                                <Col span={8}>
                                    <FavoriteProductCard
                                        wishlistItemDetail={wishlistItemDetail}
                                        value={value}
                                        handleFavoriteClick={handleFavoriteClick}
                                        className="wishlist-card"></FavoriteProductCard>
       
                                </Col>
                            );
                        })}
                    </Row>
                    <div style={{ width: '100%', textAlign: 'center', margin: '2rem 2rem' }}>
                       {hasMore &&  <Button
                            style={{
                                width: '50%',
                                textAlign: 'center',
                                height: '30px',
                                margin: '0 auto',
                            }}
                            disabled={!hasMore}
                            onClick={onClickLoadMore}>
                            Xem thêm
                        </Button>
                       }
                    </div>
                </div>
            )}
            {/* { favItems.length === 0  && (<div>Danh sách yêu thích trống<div/>) } */}
        </div>
    );
};

export default memo(FavoriteProduct);
