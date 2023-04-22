    import { React, useState, memo, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Col,
    Row,
    Card,
    Button,
    Checkbox,
    Space,
    Radio,
    Form,
    Alert,
    Spin,
} from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import HalfRatingRead from '../../common/rating/HalfRatingRead';
import CustomizedNotification from '../../common/notification/Notification';
import ListSpecification from './ListSpecification';
import TabReviewAndDescription from './TabReviewAndDescription';
import RatingForm from '../../common/rating/RatingForm';
import { useParams } from 'react-router-dom';
import axios from '../../services/axios';
import ProductDetailQuantityCounter from '../counterInc/ProductDetailQuantityCounter';
import CartNotification from '../../common/notification/CartNotification';
import CartNotification_TYPE from '../../common/notification/CartNotification';
import {
    addItemToCart,
    updateCart,
    updateGuestCartState,
    incrementItemQuantity,
    decrementItemQuantity,
} from '../../services/cartService.js';
import scrollIntoView from 'scroll-into-view-if-needed';
import './style.css';
import {
    QTY_MAX,
    QTY_MIN,
    getCartDetailRequest,
    CartRequestTYPE,
} from '../../common/Cart/CartUtil';

import {
    FETCH_PRODUCTS_PENDING,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_ERROR,
    fetchProductsPending,
    fetchProductsSuccess,
    fetchProductsError,
} from '../../common/action/action';
// import "./components/axios/author"
import {
    BASE,
    PRODUCT,
    PRODUCT_COLOR,
    PRODUCT_DETAIL,
    PRODUCT_STORAGE,
    PRODUCT_INVENTORY,
} from '../../constants/index';
import { getImage } from '../../common/img';
import { NumericFormat } from 'react-number-format';
import { USER, WISHLISTS } from '../../constants/user';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ isAuth }) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const Cart = useSelector((state) => state.cart);
    const { productId } = useParams();
    const [color, setColor] = useState([]);
    const [storage, setStorage] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productDetail, setProductDetail] = useState({});
    const [selectedStorage, setSelectedStorage] = useState();
    const [selectedColor, setSelectedColor] = useState();
    const [cartQty, setCartQty] = useState(1);
    const [cartButtonDisabled, setCartbuttonDisabled] = useState(false);
    const [inventory, setInventory] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const myRef = useRef(null);
    const  Navigate = useNavigate();
    const  {isAuthenticated}  = useSelector(state => state.auth)
    const [cartAddedNotif, setCartAddedNotif] = useState({
        title: 'Thêm vào giỏ hàng',
        message: '',
        type: CartNotification_TYPE.SUCCESS,
        content: null,
        isSuccess: null,
    });
    const  handleBuy = async () =>{
        if( isAuthenticated){
           await handleAddToCart()
            navigate('/cart')
        }else{
            Navigate('/login')
        }
    }
    const productBody = useRef({
        productId: productId,
        colorId: null,
        storageId: null,
    });
    const specificationTable = useRef([]);
    // console.log(productId);
    function fetchColor(id) {
        console.log('fetchColor: ', id);
        return axios({
            method: 'get',
            url: `${BASE}${PRODUCT_COLOR}/${id}`,
        })
            .then((res) => {
                productBody.current.colorId = res.data[0].id;
                setColor(res.data);
                setSelectedColor(res.data[0].id);
            })
            .catch((error) => error);
    }

    function fetchStorage(productId, colorId) {
        return axios({
            method: 'get',
            url: `${BASE}${PRODUCT_STORAGE}/${productId}/${colorId}`,
        })
            .then((res) => {
                productBody.current.storageId = res.data[0].id;
                // console.log('storeage: ', res.data);
                setSelectedStorage(res.data[0].id);
                setStorage(res.data);
                // console.log('storeage: ', res.data);
            })
            .catch((error) => error);
    }

    function fetchProductDetail() {
        console.log('productBody.current', productBody.current);
        return axios({
            method: 'post',
            url: `${BASE}${PRODUCT_DETAIL}`,
            data: productBody.current,
        })
            .then((res) => {
                // console.log('product-detail: ', res.data);
                setProductDetail((prev) => res.data);
                // console.log('p detail: ', productDetail);
                specificationTable.current = res.data.product_productAttributes;

                //
                if (isProductIncart(res.data.id)) {
                    let q = findCartItemQuantity(
                        findIndexOfProductId(res.data.id),
                    );
                    setCartQty((prev) => q);
                } else {
                    // console.log('set cart qty: ', cartQty);
                    setCartQty((prev) => 1);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }

    async function fetchInventory() {
        const reQty = cartQty;
        const variantId = productDetail.id;
        console.log('variant id: ', variantId);
        const request = {
            product_variant_id: variantId,
            request_quantity: cartQty,
        };
        axios
            .post(`${BASE}${PRODUCT_INVENTORY}`, request)
            .then((res) => {
                console.log(res.data);
                setInventory(res.data);
            })
            .catch((e) => {
                console.log('fetch invetory error');
                console.log(e.message);
            });
        // cartQty
    }

    async function getProductDetail() {
        await fetchColor(productId);
        await fetchStorage(productId, productBody.current.colorId);
        await fetchProductDetail();
    }

    useEffect(() => {
        getProductDetail();
        executeScroll();
    }, []);

    useEffect(async () => {
        setIsLoading(true);
        await fetchInventory();
        setIsLoading(false);
    }, [productDetail, cartQty]);

    const isProductIncart = (id = null) => {
        if (id !== null) return findIndexOfProductId(id);

        return findIndexOfCurrentProductInCart() > -1;
    };

    const findCartItemQuantity = (cartIndex) => {
        const { items } = Cart;
        const { quantity: c_qty } = items[cartIndex];
        return c_qty;
    };

    const findIndexOfCurrentProductInCart = () => {
        const { items } = Cart;
        const item_id = productDetail.id;
        return items.findIndex((item) => item.productVariant.id === item_id);
    };
    const findIndexOfProductId = (id) => {
        const { items } = Cart;
        return items.findIndex((item) => item.productVariant.id === id);
    };

    useEffect(() => {
        setIsLoading(true);
        // console.log('out of stock: ' , inventory.outOfStock);

        if (inventory.need_changed) {
            // alert('neeed changed')
            let checkCart = isProductIncart();

            // console.log('inCart: ', checkCart);
            // console.log('nene: ', inventory.need_changed);
            setIsChanged((prev) => inventory.need_changed);
            if (checkCart) {
                let quantity = findCartItemQuantity(
                    findIndexOfCurrentProductInCart(),
                );

                let index = findIndexOfCurrentProductInCart();
                let max = inventory.max_quantity;
                if (quantity > max) {
                    // alert('updaete cart')
                    dispatch(updateGuestCartState());
                }
            } else if (cartQty >= inventory.max_quantity) {
                setCartQty(inventory.max_quantity);
            }

            if (inventory.outOfStock) {
                setCartbuttonDisabled(true);
            }
        } else if (!inventory.outOfStock) {
            setCartQty((prev) => prev);
            setCartbuttonDisabled(false);
        } else if (inventory.outOfStock) {
            // alert('out stock')
            setCartbuttonDisabled(true);

            let checkCart = isProductIncart();
            if (checkCart) dispatch(updateGuestCartState());

            setCartQty((prev) => 1);
        }
        // else {
        //     setCartbuttonDisabled(false);
        //     setCartQty(prev => 1);
        // }
        setIsLoading(false);
    }, [inventory]);
    const executeScroll = () => {
        scrollIntoView(myRef.current, { behavior: 'smooth' });
    };

    useEffect(() => {
        if (Cart.isAnonymous) {
            // console.log('updateCart()');
            dispatch(updateCart());
        }
    }, [Cart]);
    const fetchWhenClickAddCart = async () => {
        setIsLoading(true);
        await fetchInventory();
        setIsLoading(false);
    };
    //End
    const handleAddToCart = async (callback) => {
        // fetchWhenClickAddCart().then((res) => {
        //     const mess_message = productDetail.display_name;

        //     const mess_title = 'Thêm vào giỏ hàng';
        //     // console.log('handlemessage', mess_message);
        //     // console.log('title:', cartAddedNotif.title);
        //     console.log('cart: ', Cart);

        //     const item_id = productDetail.id;
        //     console.log('item_id: ', item_id);
        //     const { items } = Cart;

        //     // console.log('%cITEMS: ', 'color:red', items);

        //     // console.log('items: ', items);
        //     let cartIndex = findIndexOfCurrentProductInCart();

        //     const request = {
        //         cart_id: Cart.id,
        //         id: item_id,
        //         product_variant_id: item_id,
        //         quantity: cartQty,
        //     };
        //     const {
        //         max_quantity: MAXQTY,
        //         current_inventory: CUR_INVENTORY,
        //         outOfStock: OUTOFSTOCK,
        //     } = inventory;
        //     // sản phẩm có trong giỏ
        //     if (cartIndex >= 0) {
        //         const requestz = {
        //             cart_id: Cart.id,
        //             id: items[cartIndex].id,
        //             product_variant_id: item_id,
        //             quantity: cartQty,
        //         };

        //         const { quantity: c_qty } = items[cartIndex];
        //         // console.log('current quty; ', c_qty);
        //         // if (c_qty >= QTY_MAX) {
        //         if (c_qty > MAXQTY) {
        //             isLoading(true);
        //             dispatch(updateGuestCartState);
        //             isLoading(false);
        //             return;
        //         }
        //         // if (c_qty >= MAXQTY) {
        //         if (c_qty == QTY_MAX && cartQty == c_qty) {
        //             setCartAddedNotif((prev) => {
        //                 return {
        //                     ...prev,
        //                     message: `Bạn đã có ${QTY_MAX} sản phẩm trong giỏ. Số lượng sản phẩm trong giỏ không quá  sản phẩm`,
        //                     title: 'Không thể thêm vào giỏ',
        //                     isSuccess: false,
        //                 };
        //             });
        //         } else if (
        //             (c_qty == MAXQTY && cartQty == c_qty) ||
        //             (cartQty > MAXQTY && c_qty > MAXQTY && CUR_INVENTORY <= 5)
        //         ) {
        //             setCartAddedNotif((prev) => {
        //                 return {
        //                     ...prev,
        //                     message: `Sản phẩm chỉ còn lại ${MAXQTY}, không đủ để thêm tiếp vào giỏ`,
        //                     title: 'Không thể cập nhật giỏ hàng',
        //                     isSuccess: false,
        //                 };
        //             });
        //         } else {
        //             // alert('i[da')
        //             const currentItem = items.find;
        //             let fixedQty = cartQty;
        //             if (cartQty > c_qty) {
        //                 const requestItemz = getCartDetailRequest(
        //                     { ...requestz, quantity: fixedQty },
        //                     CartRequestTYPE.UPDATE,
        //                 );
        //                 dispatch(incrementItemQuantity(requestItemz));
        //             } else if (cartQty < c_qty) {
        //                 const requestItemz = getCartDetailRequest(
        //                     { ...requestz, quantity: fixedQty },
        //                     CartRequestTYPE.DECR,
        //                 );
        //                 dispatch(decrementItemQuantity(requestItemz));
        //             }
        //             // c_qty + cartQty > QTY_MAX ? QTY_MAX - c_qty : cartQty;

        //             // const requestItem = getCartDetailRequest(
        //             //     { ...request, quantity: fixedQty },
        //             //     CartRequestTYPE.UPDATE,
        //             // );
        //             // console.log(' requestItem', requestItem);
        //             setCartAddedNotif((prev) => {
        //                 return {
        //                     ...prev,
        //                     message: mess_message + `\nSố lượng:${cartQty}`,
        //                     title: 'Cập nhật giỏ hàng thành công',
        //                     isSuccess: true,
        //                 };
        //             });
        //             // dispatch(addItemToCart(requestItem));
        //         }
        //     } else {
        //         const requestItem = getCartDetailRequest(
        //             request,
        //             CartRequestTYPE.ADD,
        //         );
        //         console.log(' requestItem', requestItem);
        //         dispatch(addItemToCart(requestItem));
        //         setCartAddedNotif((prev) => {
        //             return {
        //                 ...prev,
        //                 message: mess_message,
        //                 title: mess_title,
        //                 isSuccess: true,
        //             };
        //         });
        //     }
        // });
        
        const mess_message = productDetail.display_name;

        const mess_title = 'Thêm vào giỏ hàng';
        // console.log('handlemessage', mess_message);
        // console.log('title:', cartAddedNotif.title);
        // console.log('cart: ', Cart);

        const item_id = productDetail.id;
        // console.log('item_id: ', item_id);
        const { items } = Cart;

        // console.log('%cITEMS: ', 'color:red', items);

        const request = {
            cart_id: Cart.id,
            id: item_id,
            product_variant_id: item_id,
            quantity: cartQty,
        };
        // console.log('items: ', items);
        let cartIndex = items.findIndex(
            (item) => item.productVariant.id === item_id,
        );
        // console.log('cartIndex', cartIndex);
        // console.log('san pham trong gio? ', cartIndex);
        // sản phẩm có trong giỏ
        if (cartIndex >= 0) {
            const { quantity: c_qty } = items[cartIndex];
            // console.log('current quty; ', c_qty);
            if (c_qty >= QTY_MAX) {
                // console.log('failed');
                setCartAddedNotif((prev) => {
                    return {
                        ...prev,
                        message: `Số lượng sản phẩm trong giỏ không quá ${QTY_MAX} sản phẩm`,
                        title: 'Không thể thêm vào giỏ',
                        isSuccess: false,
                    };
                });
            } else {
                const currentItem = items.find;
                let fixedQty =
                    c_qty + cartQty > QTY_MAX ? QTY_MAX - c_qty : cartQty;
                const requestItem = getCartDetailRequest(
                    { ...request, quantity: fixedQty },
                    CartRequestTYPE.ADD,
                );
                // console.log(' requestItem', requestItem);
                setCartAddedNotif((prev) => {
                    return {
                        ...prev,
                        message: mess_message,
                        title: mess_title,
                        isSuccess: true,
                    };
                });
                dispatch(addItemToCart(requestItem));
            }
        } else {
            const requestItem = getCartDetailRequest(
                request,
                CartRequestTYPE.ADD,
            );
            // console.log(' requestItem', requestItem);
            dispatch(addItemToCart(requestItem));
            setCartAddedNotif((prev) => {
                return {
                    ...prev,
                    message: mess_message,
                    title: mess_title,
                    isSuccess: true,
                };
            });
        }
    };

    const setSuccessNull = () => {
        setCartAddedNotif((prev) => {
            return {
                ...prev,

                isSuccess: null,
            };
        });
    };

    function fetchIsWishlist(productId) {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_URL}${USER}${WISHLISTS}/${productId}`,
        })
            .then((res) => {
                setFavorite(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    //fetch wishlist
    useEffect(() => {
        if (isAuth) {
            fetchIsWishlist(productId);
        }
    }, [isAuth]);
    //add wishlist
    function addWishlists(product_id) {
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_URL}${USER}${WISHLISTS}`,
            data: [{ product_id: product_id }],
        }).catch((error) => {
            console.log(error);
        });
    }
    //remove wishlist
    function removeWishlists(product_id) {
        axios({
            method: 'delete',
            url: `${process.env.REACT_APP_URL}${USER}${WISHLISTS}`,
            data: [{ product_id: product_id }],
        }).catch((error) => {
            console.log(error);
        });
    }

    const [isFavorite, setFavorite] = useState(false);
    //handleWishlist
    const handleFavoriteClick = () => {
        if (isAuth) {
            if (isFavorite) {
                removeWishlists(productId);
                setFavorite(false);
            } else {
                addWishlists(productId);
                setFavorite(true);
            }
        } else return navigate('/login');
    };
    //fetch detail product
    async function fetchProductDetailByColor(color) {
        await fetchStorage(productId, color);

        await fetchProductDetail();
    }
    const onChangeColor = useCallback(({ target: { value } }) => {
        // console.log('color-value', value);
        setSelectedColor((prev) => {
            return value;
        });
        productBody.current.colorId = value;
        console.log('prodcut body: ', productBody.current);
        console.log('selectedColor id: ', selectedColor);

        fetchProductDetailByColor(value);
    });

    useEffect(() => {
        // fetch sau khi select = setSelected khong cap nhap ngay
        fetchProductDetail();
    }, [selectedColor, selectedStorage]);

    const handleStorageChange = useCallback(({ target: { value } }) => {
        setSelectedStorage(value);
        productBody.current.storageId = value;
    });

    // cartQtyHandler
    const cartQtyOnChangeHandler = useCallback(async (value) => {
        setCartQty((prev) => {
            return value;
        });
        await fetchInventory();
    });

    return (
        <>
            {isLoading ? (
                <div ref={myRef} id="top-product-page">
                    <Space
                        direction="vertical"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Spin tip="Loading">
                            <Alert
                                message="Alert message title"
                                description="Further details about the context of this alert."
                                type="info"
                            />
                        </Spin>
                    </Space>
                </div>
            ) : (
                <div
                    id="top-product-page"
                    ref={myRef}
                    style={{
                        scrollMarginBotom: '8vh',
                    }}
                    className='top-product-page-v2'
                >
                    <div className="productDetail">
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    p: 1,
                                    padding: '0px',
                                    flexDirection: {
                                        xs: 'column', // mobile
                                        sm: 'row', // tablet and up
                                    },
                                }}
                            >
                                <div
                                    className="product_style"
                                    style={{
                                        display: 'flex',
                                        p: 1,

                                        flexDirection: {
                                            xs: 'column', // mobile
                                            sm: 'row', // tablet and up
                                        },
                                        width: '70%',
                                    }}
                                >
                                    <div
                                    className='img'
                                        style={{
                                            position: 'relative',
                                            display: 'inline-block',
                                        }}
                                    
                                    >
                                        <img
                                            width="300"
                                            height="300"
                                            alt="example"
                                            src={getImage(productDetail.image)}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 2,
                                                borderRadius: '50%',
                                                right: '20rem',
                                                top: 0,
                                                transform: 'translateY(50%)',
                                            }}
                                        >
                                            <Button
                                                onClick={handleFavoriteClick}
                                                shape="circle"
                                                icon={
                                                    isFavorite ? (
                                                        <HeartFilled
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        />
                                                    ) : (
                                                        <HeartOutlined />
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginLeft: 2 }}>
                                        {/*Ten va so sao san pham*/}
                                        <div>
                                            {productDetail.display_name}
                                            <HalfRatingRead
                                                value={
                                                    productDetail.product_averagePoint
                                                }
                                            />
                                        </div>
                                        {/*Gia san pham*/}
                                        <div>
                                            {productDetail.discount != 0 ? (
                                                <span
                                                    style={{
                                                        color: 'red',
                                                        marginRight: '5px',
                                                    }}
                                                >
                                                    <NumericFormat
                                                        value={
                                                            productDetail.discount_price
                                                        }
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'đ'}
                                                    />
                                                </span>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: 'red',
                                                        marginRight: '5px',
                                                    }}
                                                >
                                                    <NumericFormat
                                                        value={
                                                            productDetail.price
                                                        }
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'đ'}
                                                    />
                                                </span>
                                            )}

                                            {productDetail.discount != 0 && (
                                                <span
                                                    style={{
                                                        textDecoration:
                                                            'line-through',
                                                    }}
                                                >
                                                    <NumericFormat
                                                        value={
                                                            productDetail.price
                                                        }
                                                        displayType={'text'}
                                                        thousandSeparator={true}
                                                        suffix={'đ'}
                                                    />
                                                </span>
                                            )}
                                            {productDetail.discount != 0 && (
                                                <span
                                                    style={{
                                                        color: 'red',
                                                        marginLeft: '5px',
                                                    }}
                                                >
                                                    -{productDetail.discount}%
                                                    off
                                                </span>
                                            )}
                                        </div>
                                        {/*Phần ram và dung lượng*/}
                                        <Form name="validate_other">
                                            <Form.Item
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Please pick an item!',
                                                    },
                                                ]}
                                            >
                                                <Radio.Group
                                                    onChange={
                                                        handleStorageChange
                                                    }
                                                    value={selectedStorage}
                                                >
                                                    <Space
                                                        wrap
                                                        size={[5, 12]}
                                                        style={{
                                                            width: '400px',
                                                        }}
                                                    >
                                                        {storage.map((item) => (
                                                            <Radio.Button
                                                                key={item.id}
                                                                value={item.id}
                                                            >
                                                                <div
                                                                    style={{
                                                                        textAlign:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <div>
                                                                        {
                                                                            item.storage_name
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Radio.Button>
                                                        ))}
                                                    </Space>
                                                </Radio.Group>
                                                {/*Phần màu sản phẩm nếu có*/}
                                            </Form.Item>
                                        </Form>
                                        <Form name="validate_other">
                                            <Form.Item
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Please pick an item!',
                                                    },
                                                ]}
                                            >
                                                <Radio.Group
                                                    onChange={onChangeColor}
                                                    value={selectedColor}
                                                >
                                                    <Space
                                                        wrap
                                                        size={[1, 1]}
                                                        style={{
                                                            width: '400px',
                                                        }}
                                                    >
                                                        <div
                                                            className='text'
                                                            style={{
                                                                padding: '1px',
                                                            }}
                                                        >
                                                            Chọn màu để xem giá
                                                        </div>
                                                        <Space
                                                            wrap
                                                            size={[5, 12]}
                                                            style={{
                                                                width: '400px',
                                                            }}
                                                        >
                                                            {color.map(
                                                                (item) => (
                                                                    <Radio.Button
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                textAlign:
                                                                                    'center',
                                                                            }}
                                                                        >
                                                                            <div>
                                                                                {
                                                                                    item.color_name
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Radio.Button>
                                                                ),
                                                            )}
                                                        </Space>
                                                    </Space>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Form>
                                        {/* Counter cho so luong */}

                                        <ProductDetailQuantityCounter
                                            cartQty={cartQty}
                                            cartQtyOnChangeHandler={
                                                cartQtyOnChangeHandler
                                            }
                                            fetchInventory={fetchInventory}
                                            inventory={inventory}
                                            isButtonDisabled={
                                                cartButtonDisabled
                                            }
                                            // setCartbuttonDisabled={setCartbuttonDisabled}
                                        ></ProductDetailQuantityCounter>

                                        {/*Them vaoo gio*/}
                                        <div className='btn_flex'>
                                        <div className='btn' >
                                            <CartNotification
                                                key={cartAddedNotif}
                                                isButtonDisabled={
                                                    cartButtonDisabled
                                                }
                                                title={cartAddedNotif.title}
                                                type={cartAddedNotif.type}
                                                message={cartAddedNotif.message}
                                                handleClick={handleAddToCart}
                                                isSuccess={
                                                    cartAddedNotif.isSuccess
                                                }
                                                setSuccessNull={setSuccessNull}
                                            ></CartNotification>
                                            {/* <CustomizedNotification
                                    buttonContent="Thêm vào giỏ"
                                    handleClick={handleAddToCart}
                                    type="success"
                                    placement="bottomRight"
                                    message="Đã thêm vào giỏ"
                                    style={{ width: '90%' }}
                                /> */}
                                        </div>
                                        <div className='btn_buy' onClick={handleBuy}>
                                            <button type='button' onClick={
                                                handleAddToCart
                                                }>Mua Ngay</button>
                                        </div>
                                        </div>
                                        
                                        
                                    </div>
                                </div>

                                {/*Thông số kỹ thuật*/}
                                <div
                                    className="product_tskt"
                                    style={{ width: '30%' }}
                                >
                                    {specificationTable.current && (
                                        <ListSpecification
                                            data={specificationTable.current}
                                        />
                                    )}
                                </div>
                                {/*Đánh giá và mô tả*/}
                            </div>
                            <TabReviewAndDescription
                                listReview={productDetail.rating}
                                description={
                                    productDetail.product_description
                                        ? productDetail.product_description
                                        : 'chưa có mô tả'
                                }
                                loading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default memo(ProductDetail);
