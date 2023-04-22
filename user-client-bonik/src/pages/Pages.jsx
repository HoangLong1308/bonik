import React, { memo, useState, useEffect } from 'react';
import Home from '../components/MainPage/Home';
import FlashDeals from '../components/flashDeals/FlashDeals';
import TopCate from '../components/top/TopCate';
import NewArrivals from '../components/newarrivals/NewArrivals';
import Discount from '../components/discount/Discount';
import Annocument from '../components/annocument/Annocument';
import Wrapper from '../components/wrapper/Wrapper';
import ShopHome from '../components/shops/ShopHome';
import TopSales from '../components/topsales/TopSales';
import CategorySlider from '../components/categoryslider/CategorySlider';
import { BASE, PRODUCT, FILTER } from '../constants/index';
import { BASE_USER, INFO } from '../constants/user';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../services/axios';
import TokenService from '../services/tokenService';
import { useDispatch, useSelector } from 'react-redux';
import { mergeAnnonCart } from '../services/cartService';
import { INIT, LOGIN } from '../redux/actions/AuthAction';
import { Modal, Button, Input } from 'antd';
const Pages = ({ productItems, addToCart, CartItem, shopItems, isAuth }) => {
    const size = 10;
    const navigate = useNavigate();
    const [smartphones, setSmartPhones] = useState([]);
    const [laptop, setLaptop] = useState([]);
    //fetch smartPhones
    useEffect(() => {
        axios({
            method: 'post',
            url: `${BASE}${PRODUCT}${FILTER}`,
            data: [
                {
                    key: 'category',
                    value: 1,
                    operation: 'EQUAL',
                },
            ],
            params: { size: size, page: 0 },
        })
            .then((res) => {
                setSmartPhones(() => res.data.data);
                return res.data;
            })
            .catch((error) => error);
    }, []);
    //fetch laptop
    useEffect(() => {
        axios({
            method: 'post',
            url: `${BASE}${PRODUCT}${FILTER}`,
            data: [
                {
                    key: 'category',
                    value: 2,
                    operation: 'EQUAL',
                },
            ],
            params: { size: size, page: 0 },
        })
            .then((res) => {
                setLaptop(() => res.data.data);
                return res.data;
            })
            .catch((error) => error);
    }, []);
    //handle login google success
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const emailAlreadyExistsInAccount = searchParams.get('error');
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [formError, setFormError] = useState('');
    const handlePhone = (e) => {
        setPhone(e.target.value);
    };
    const handleOk = async () => {
        let userInfo;
        await axios.get(`${BASE_USER}${INFO}`).then((res) => {
            const data = res.data;
            userInfo = {
                email: data.email,
                full_name: data.full_name,
                phone: phone,
            };
        });
        axios({
            method: 'put',
            url: `${BASE_USER}${INFO}`,
            data: userInfo,
        })
            .then((res) => {
                setConfirmLoading(true);
                setTimeout(() => {
                    setOpen(false);
                    setConfirmLoading(false);
                }, 1000);
            })
            .catch((err) => {
                setFormError(err.response.data.phone);
                setConfirmLoading(true);
                setTimeout(() => {
                    setConfirmLoading(false);
                }, 1000);
            });
    };

    useEffect(async () => {
        if (access_token && refresh_token) {
            //set httponly cookie with token
            await axios
                .get(process.env.REACT_APP_URL + 'un/token-login-google', {
                    params: {
                        accessToken: access_token,
                        refreshToken: refresh_token,
                    },
                })
                .then((res) => {
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isAuthenticated: true,
                            fullName: null,
                            role: res.data.roles[0].authority,
                            accessToken: res.data.access_token,
                        },
                    });

                    dispatch(mergeAnnonCart());
                });
            //get user info
            await axios.get(`${BASE_USER}${INFO}`).then((res) => {
                if (res.data.phone == null) {
                    navigate('/');
                    setOpen(true);
                } else {
                    TokenService.setCookieAccessToken(access_token);
                    navigate('/');
                }
            });
        }

        if (emailAlreadyExistsInAccount) {
            const error = decodeURIComponent(emailAlreadyExistsInAccount);
            navigate('/login', { state: { error: error } });
        }
    }, []);
    return (
        <>
            <Modal
                title="Vui lòng điền đầy đủ thông tin dưới đây để tiếp tục đăng nhập!"
                open={open}
                confirmLoading={confirmLoading}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        loading={confirmLoading}
                        onClick={handleOk}
                    >
                        Xác nhận
                    </Button>,
                ]}
            >
                <Input
                    onChange={handlePhone}
                    value={phone}
                    maxLength={10}
                    placeholder="Vui lòng nhập số điện thoại"
                />
                <p style={{ color: 'red' }}>{formError}</p>
            </Modal>
            <Home CartItem={CartItem} />
            <FlashDeals productItems={productItems} addToCart={addToCart} />
            {/* <TopCate /> */}
            <NewArrivals />
            <Discount />
            <TopSales isAuth={isAuth} />
            {/* <CategorySlider /> */}
            {smartphones && smartphones.length != 0 && (
                <ShopHome
                    isAuth={isAuth}
                    shopItems={smartphones}
                    title={'Điện thoại'}
                />
            )}
            {laptop && laptop.length != 0 && (
                <ShopHome isAuth={isAuth} shopItems={laptop} title={'Laptop'} />
            )}

            <Annocument />
            <Wrapper />
        </>
    );
};

export default memo(Pages);
