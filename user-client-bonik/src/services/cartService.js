// import { createSlice } from '@reduxjs/toolkit';
import axios from './axios';
import Moment from 'react-moment';
import { CART, CART_ITEM, NEW_GUEST_CART, GUEST_CART_DETAIL, MERGE_CART, UPDATE_GUEST_CART, UPDATE_AUTH_CART } from '../constants/user';
import { addToCart, removeFromCart, getItemsCount, getBaseAmount, getCartFromSever, increment, decrement, newCart, getTotal, getDiscountAmount, authenticateCart, updateGuestCart } from '../redux/slices/CartSlice';

const ENV_URL = process.env.REACT_APP_URL;
export const fetchCartFromSever = () => async (dispatch, getState) => {
    console.log('fetchCartFromSErver,,,,');
    try {
        const { isAnonymous } = getState().cart;
        console.log('isAnnon', isAnonymous);
        const promt_path = !isAnonymous ? CART : null;
        if (!isAnonymous) {
            console.log('is not annon');
            await axios
                .get(ENV_URL + promt_path)
                .then((response_cart) => {
                    console.log(response_cart.data);
                    dispatch(getCartFromSever(response_cart.data));
                })
                .catch((error) => {
                    console.log(error);

                    return;
                });
        } else {
            const { time } = getState().cart;
            console.log('get from localstorage');
            const { id: cartId } = getState().cart;
            // console.log('cartId: ', cartId);
            if (!cartId) {
                console.log('get fresh guest cart...');
                dispatch(resetToGuestCart());
            }
        }
    } catch (e) {
        console.log('error');
        console.log(e.message);
    }
};

export const resetToGuestCart = () => async (dispatch, getState) => {
    console.log('get fresh guest cart...');
    const cart_new = await getFreshCartForGuest();
    dispatch(newCart(cart_new));
    // dispatch(updateCart());
};
// {
//     "cart_id": 0,
//     "product_variant_id": 0,
//     "quantity": 5
//   }
export const removeItemFromCart = (requestItem) => async (dispatch, getState) => {
    const { isAnonymous } = getState().cart;
    if (!isAnonymous) {
        console.log('send remove request...');
        const { id: cart_id } = getState().cart;
        console.log(getState());
        console.log('cartId: ', cart_id);
        console.log('requestItem: ', requestItem);
        await axios
            .delete(`${ENV_URL}${CART}${cart_id}${CART_ITEM}`, {
                data: { ...requestItem },
            })
            .then((res) => {
                console.log('removed !');
                //
                dispatch(fetchCartFromSever());
            })
            .catch((error) => {
                console.log('erorr: ', error.message);
                return 0;
            });
    } else {
        console.log('remove item in localstroge...');
        console.log('remove_request: ', requestItem);

        dispatch(removeFromCart(requestItem));
        // dispatch(updateCart());
    }
};
export const addItemToCart = (request) => async (dispatch, getState) => {
    const { id: cart_id, isAnonymous, items } = getState().cart;
    if (!isAnonymous) {
        await axios
            .post(`${ENV_URL}${CART}${cart_id}${CART_ITEM}`, {
                ...request,
            })
            .then((res) => {
                dispatch(fetchCartFromSever());
            });
        console.log('send add request...');
    } else {
        console.log('update state in localStorge...');

        let requestIndex = checkItemInGuestCart(items, request);
        if (requestIndex >= 0) {
            console.log('variant already in cart: ');
            console.log('Move to increase... ');
            console.log('request: ', request);
            // dispatch(incrementItemQuantity({...request, index:requestIndex}));
            dispatch(
                guestCarIncrementItemQuantity({
                    ...request,
                    index: requestIndex,
                }),
            );
        } else {
            let res = await getGuestRequestCartDetail(request);
            console.log('guest cart detail response: ', res);
            dispatch(addToCart(res));
        }
        // dispatch(updateCart());
    }
};

export const guestCarIncrementItemQuantity = (request) => async (dispatch, getState) => {
    const { items } = getState().cart;
    console.log('request: ', request);
    let { quantity: reQty, index } = request;
    // let itemIndex = items.findIndex(i => i.id === id)
    let item = items[index];

    console.log('item: ', item);
    let id = item.id;
    let oldQty = item.quantity;
    console.log('reQty: ', reQty);
    let newQty = oldQty + reQty;

    request = { ...request, quantity: newQty };
    console.log('increase state in localStorge..');
    console.log('increase: ', request);
    let req = await getGuestRequestCartDetail(request);
    dispatch(increment({ ...req, index: index, id: id }));
    // dispatch(updateCart());
};

export const incrementItemQuantity = (request) => async (dispatch, getState) => {
    const { id: cart_id, isAnonymous } = getState().cart;
    if (!isAnonymous) {
        await axios
            .put(`${ENV_URL}${CART}${cart_id}${CART_ITEM}`, {
                ...request,
            })
            .then((res) => {
                dispatch(fetchCartFromSever());
            });
        console.log('send add request...');
    } else {
        let { id } = request;
        console.log('request_increase: ', request);
        let req = await getGuestRequestCartDetail(request);

        dispatch(increment({ ...req, id: id }));
        // dispatch(updateCart());
    }
};
export const decrementItemQuantity = (request) => async (dispatch, getState) => {
    const { id: cart_id, isAnonymous } = getState().cart;
    if (!isAnonymous) {
        await axios
            .put(`${ENV_URL}${CART}${cart_id}${CART_ITEM}`, {
                ...request,
            })
            .then((res) => {
                dispatch(fetchCartFromSever());
            });
        console.log('send add request...');
    } else {
        console.log('decrease state in localStorge..');
        console.log('request: ', request);
        let req = await getGuestRequestCartDetail(request);
        // let index = checkItemInGuestCart(items,request)
        // console.log('index: ',index);
        dispatch(decrement({ ...req, id: request.id }));
        // updateCart();
    }
};

const covertMergeCartRequest = (items, cart_id) => {
    return items.map((i) => {
        return {
            cart_id: cart_id,
            product_variant_id: i.productVariant.id,
            quantity: i.quantity,
        };
    });
};
const convertUpdateCartRequest = (items, cart_id) => {
    return items.map((i) => {
        let rndId = i.id === null || i.id === undefined || i.id === 0 ? Math.floor(Math.random() * 2000) + 1 : i.id;
        return {
            id: rndId,
            cart_id: cart_id,
            product_variant_id: i.productVariant.id,
            quantity: i.quantity,
        };
    });
};
export const mergeAnnonCart = () => async (dispatch, getState) => {
    console.log('inside merge');

    let { items } = getState().cart;
    let cart_id = await (await (await axios.get(`${ENV_URL}${CART}`)).data).id;
    let request = covertMergeCartRequest(items, cart_id);

    dispatch(updateGuestCartState());

    console.log('list request: ', request);
    if (request)
        await axios
            .post(`${ENV_URL}${MERGE_CART}`, request)
            .then((res) => {
                console.log('cart: ');
                console.log(res.data);
                return;
            })
            .catch((e) => {
                console.log(e.message);
            });
    dispatch(authenticateCart(false));
    dispatch(fetchCartFromSever());
};

export const getFreshCartForGuest = async () => {
    try {
        return await (
            await axios.get(`${ENV_URL}${NEW_GUEST_CART}`)
        ).data;
    } catch (e) {
        console.log(e.message);
    }
};

// {
//     "variant_id": 0,
//     "quantity": 5
//   }
const getGuestRequestCartDetail = async (request) => {
    const convertGuestRequest = (req) => {
        return {
            variant_id: request.product_variant_id,
            quantity: request.quantity,
        };
    };
    try {
        console.log('reqeustItem for guest: ', request);
        console.log(`${ENV_URL}${GUEST_CART_DETAIL}`);

        console.log('request send: ', convertGuestRequest(request));
        return await (
            await axios.post(`${ENV_URL}${GUEST_CART_DETAIL}`, {
                ...convertGuestRequest(),
            })
        ).data;
    } catch (e) {
        console.log(e.message);
    }
};

const checkItemInGuestCart = (items, request) => {
    const { product_variant_id } = request;
    console.log('request pv id: ', product_variant_id);
    return items.findIndex((item) => item.productVariant.id === request.product_variant_id);
};

export const updateCart = () => async (dispatch, getState) => {
    console.log('%cupdate cart: ', 'font: 20px, color: red', getState().cart);
    dispatch(getItemsCount());
    dispatch(getBaseAmount());
    dispatch(getDiscountAmount());
    dispatch(getTotal());
};

export const updateGuestCartState = () => async (dispatch, getState) => {
    let { items, id: cart_id, isAnonymous } = getState().cart;

    // let cart_id = await (await (await axios.get(`${ENV_URL}${CART}`)).data).id;

    if (!isAnonymous) {
        // alert('updated remote cart')
        await axios.get(`${ENV_URL}${UPDATE_AUTH_CART}`).then((res) => {
            console.log('res: ', res);
            if ((res.status = '409')) {
                dispatch(fetchCartFromSever());
            }
        });
    } else {
        let request = convertUpdateCartRequest(items, cart_id);
        console.log(request);
        if (request)
            await axios
                .post(`${ENV_URL}${UPDATE_GUEST_CART}`, request)
                .then((res) => {
                    console.log('cart: ');
                    console.log(res.data);
                    dispatch(updateGuestCart(res.data));

                    dispatch(updateCart);
                    console.log('finish updated: ', getState().cart);

                    return;
                })
                .catch((e) => {
                    console.log(e.message);
                });
    }
};

const generateAutoIncrId = (arr) => {
    console.log('generate id');
    if (!arr || arr.length === 0) return 1;
    else {
        return Math.max(...arr.map((e) => e.id)) + 1;
    }
};

export const clearAfterCheckOut = () => async (dispatch, getState) => {
    // alert('fetch ...');
    dispatch(fetchCartFromSever());
};
