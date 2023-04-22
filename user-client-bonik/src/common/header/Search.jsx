import React, { memo, useState, useContext, useRef } from 'react';
import logo from '../../components/assets/images/logo.svg';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { reset } from '../../redux/slices/CartSlice';
import { Badge, List } from 'antd';
import VirtualList from 'rc-virtual-list';
import './Header.css';

import HoverCartPopover from '../../common/header/HoverCartPopover';

const Search = () => {
    // fixed Header
    window.addEventListener('scroll', function () {
        const search = document.querySelector('.search');
        search.classList.toggle('active', window.scrollY > 100);
    });
    const auth = useSelector((state) => state.auth);
    const Cart = useSelector((state) => state.cart);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        console.log('logout...');
        await axiosInstance
            .post(process.env.REACT_APP_URL + 'un/logout')
            .catch((error) => console.log(error));

        dispatch(reset());
        window.localStorage.removeItem('cart');
        // dispatch(resetToGuestCart());
        window.location.reload('/');
    };
    const [modalBell, setModalBell] = useState(false);
    const handleNotification = () => {
        modalBell ? setModalBell(false) : setModalBell(true);
    };
    const ContainerHeight = 600;
    const data = [
        {
            title: ' Title 1',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
        {
            title: ' Title 2',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
        {
            title: 'Title 3',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
        {
            title: 'Title 4',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
        {
            title: 'Title 4',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
        {
            title: 'Title 4',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
        {
            title: 'Title 4',
            img: 'https://cdn.tgdd.vn/Products/Images/1363/292623/mieng-dan-lung-iphone-14-ta-thumb-600x600.jpg',
            content:
                'Vui lòng kiểm tra tất cả các sản phẩm trong đơn hàng trước khi xác nhận "Đã nhận được hàng".',
        },
    ];
    const [keyWord, setKeyWord] = useState('');
    const handleSearch = (e) => {
        setKeyWord(e.target.value);
    };
    return (
        <>
            <section className="search search-bar">
                <div className="container c_flex">
                    <div className="logo width left">
                        <Link to="/">
                            {' '}
                            <img src={logo} alt="" />{' '}
                        </Link>
                        {/* <img src={logo} alt="" /> */}
                    </div>

                    <div className="search-box f_flex">
                        <i className="fa fa-search"></i>
                        <input
                            type="text"
                            placeholder="Nhấn enter đề tìm kiếm..."
                            onChange={handleSearch}
                            value={keyWord}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    navigate('/product#section-product', {
                                        state: { keySearch: keyWord },
                                    });
                                    setKeyWord('');
                                }
                            }}
                        />
                        <span>All Category</span>
                    </div>

                    {/* <CartPopover></CartPopover> */}

                    <div className="icon my_icon f_flex width right">
                        {/* <div className="cart popup-link" data-popup="Giỏ hàng">
                            <Link
                                // className="popup-link"
                                data-popup="Giỏ hàng"
                                to="/cart"
                            >
                                <i className="fa fa-shopping-bag icon-circle"></i>
                                <span>
                                    {Cart.totalCount === 0
                                        ? 0
                                        : Cart.totalCount}
                                </span>
                            </Link>
                        </div>
                      
                        {auth.isAuthenticated ? (
                            <>
                                {' '}
                                <div
                            className=" popup-link notification "
                            style={{color:'#4183c4'}}
                            onClick={handleNotification}
                            data-popup="Thông báo"
                        >
                            <Link
                            >
                                <span>
                                    <Badge count={data.length}>
                                        <i
                                            className="fa fa-bell icon-circle"
                                            style={{ color: '#4183c4' }}
                                        ></i>
                                    </Badge>
                                </span>
                            </Link>
                        </div>
                        </div> */}
                        <HoverCartPopover Cart={Cart}></HoverCartPopover>
                        {auth.isAuthenticated ? (
                            <>
                                {' '}
                                <Link
                                    to="/profile"
                                    className="popup-link"
                                    data-popup="Tài khoản"
                                >
                                    <i className="fa fa-user icon-circle"></i>
                                </Link>
                                <Link
                                    className="popup-link"
                                    data-popup="Đăng xuất"
                                    onClick={handleLogout}
                                >
                                    <i className="fa fa-sign-out icon-circle"></i>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="popup-link"
                                    data-popup="Đăng nhập"
                                    to="/login"
                                >
                                    <i className="fa fa-sign-in icon-circle"></i>
                                </Link>
                                <Link
                                    className="popup-link"
                                    data-popup="Đăng kí"
                                    to="/signUp"
                                >
                                    <i className="fa fa-key icon-circle"></i>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                {modalBell ? (
                    <div className="myList_v1">
                        <List>
                            <VirtualList
                                data={data}
                                height={ContainerHeight}
                                itemHeight={47}
                                itemKey="title"
                            >
                                {(item) => (
                                    <List.Item>
                                        <div className="myItem_List">
                                            <img
                                                src={item.img}
                                                alt="#"
                                                style={{
                                                    width: 60,
                                                    paddingRight: 10,
                                                }}
                                            />
                                            <div>
                                                <h2
                                                    style={{
                                                        fontSize: 16,
                                                        margin: 0,
                                                    }}
                                                >
                                                    {item.title}
                                                </h2>
                                                <p>{item.content}</p>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </div>
                ) : (
                    ''
                )}
            </section>
        </>
    );
};

export default memo(Search);
