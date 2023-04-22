import { RssFeed } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';
import axios from '../../services/axios';
import {
    fetchCartFromSever,
    getGuestRequestCartDetail,
} from '../../services/cartService';

const convertGuestCartResponse = (res) => {
    return {
        id: res.id,
        baseAmount: res.price_sum,
        items: res.cartDetails,
        time: res.create_date,
    };
};
const initialState = {
    isAnonymous: true,
    id: null,
    items: [],
    total: 0.0,
    baseAmount: 0.0,
    totalCount: 0,
    discount: 0.0,
};

const generateAutoIncrId = (arr) => {
    console.log('generate id');
    if (!arr || arr.length === 0) return 1;
    else {
        return Math.max(...arr.map((e) => e.id)) + 1;
    }
};
// export const CartSlice =  createSlice(async () => {return {
export const CartSlice =  createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
       reset: () => {
            window.localStorage.removeItem('persist:root');
            return {
                isAnonymous: true,
                id: null,
                items: [],
                total: 0.0,
                baseAmount: 0.0,
                totalCount: 0,
                discount: 0.0,
            }
        },
        // reset: (state,action) => {
        //     console.log('reset');
        //     return  initialState ;
        // },
        addToCart: {
            reducer: (state, action) => {
                console.log('action in addToCart', action.payload);
                let id = generateAutoIncrId(state.items);
                let cart_item = { ...action.payload, id: id };
                console.log('cart_item: ', cart_item);
                // state.items.push(cart_item);
                state.items.unshift(cart_item);
            },
        },
        newCart: (state, action) => {
            state = {
                ...initialState,
                // isAnonymous: false,
                ...convertGuestCartResponse(action.payload),
            };
            console.log('newcart: ', state.cart);
            return { ...state };
        },
        increment: (state, action) => {
            console.log('increment......: ', action.payload);
            const { items } = state;
            const index = items.findIndex((i) => i.id === action.payload.id);
            const product = { ...action.payload };

            state.items[index] = product;
        },
        decrement: (state, action) => {
            console.log('decrement....', action.payload);
            const { items } = state;
            const index = items.findIndex((i) => i.id === action.payload.id);
            state.items[index] = { ...action.payload };
        },
        removeFromCart: (state, action) => {
            if (state.items.length !== 0) {
                let index = state.items.findIndex(
                    (item) => item.id === action.payload.id,
                );
                if (index !== -1) {
                    console.log('removed...');
                    state.items.splice(index, 1);
                }
            }
        },
        meregeCart: (state) => {},
        clearCart: (state) => {},
        getCartItems: (state, action) => {
            return state.items;
        },
        getCart: (state) => {
            return { ...state };
        },
        getItemsCount: (state, action) => {
            console.log('getItemsCount');
            if (state.items.length !== 0) {
                let cartCount = state.items.reduce((total, item) => {
                    return item.quantity + total;
                }, 0);
                console.log('cartCount', cartCount);
                state.totalCount = cartCount;
            } else {
                state.totalCount = 0;
            }
            console.log('state: ', state.cart);
        },
        getBaseAmount: (state, action) => {
            console.log('update..base ammount');
            if (state.items.length !== 0) {
                state.baseAmount = state.items.reduce(
                    (sub, item) => sub + item.price_detail,
                    0,
                );
            } else {
                state.baseAmount = 0;
            }

            console.log('state: ', state);
        },
        getTotal: (state, action) => {
            if (state.items.length !== 0) {
                let { items } = state;
                state.total = state.baseAmount - state.discount;
            } else {
                state.total = 0;
            }
            console.log('state: ', state.cart);
        },
        getDiscountAmount: (state, action) => {
            console.log('get discount: ');
            if (state.items.length !== 0) {
                let discount = state.items.reduce((d, item) => {
                    return d + item.discount_amount * item.quantity;
                }, 0);
                state.discount = discount;
            } else {
                state.discount = 0;
            }

            console.log('state: ', state.cart);
        },
        getCartFromSever: (state, action) => {
            console.log('action', action);
            state.id = action.payload.id;
            state.items = action.payload.cartDetails;
            state.baseAmount = action.payload.price_sum;
            let cartCount = state.items.reduce((total, item) => {
                // console.log(item);
                return item.quantity + total;
            }, 0);
            state.totalCount = cartCount;
            const discountAmount = state.items.reduce((d, i) => {
                return i.discount_amount * i.quantity + d;
            }, 0);
            // console.log('discountAmount: ', discountAmount);
            state.discount = discountAmount;
            state.total = state.baseAmount - state.discount;
        },
        authenticateCart: (state, action) => {
            state.isAnonymous = action.payload;
            console.log('state: ', state);
        },
        clearAfterCheckOut: (state, action) => {
           state.baseAmount = 0.0;
           state.discount = 0.0;
           state.items = [];
           state.total = 0.0;
           state.totalCount = 0;            
        },
        updateGuestCart: (state,action) => {
            console.log(action.payload);
            const updated = convertGuestCartResponse(action.payload);
            const updatedCart = {...updated};
            console.log('updated cart: ');
            console.log(updatedCart);
            state = {...state ,...updatedCart}
            return {...state};
        }
    }

});

export const {
    addToCart,
    removeFromCart,
    meregeCart,
    clearCart,
    getCartItems,
    getItemsCount,
    getBaseAmount,
    increment,
    decrement,
    getCart,
    getCartFromSever,
    authenticateCart,
    reset,
    newCart,
    getTotal,
    getDiscountAmount,
    clearAfterCheckOut,
    updateGuestCart
} = CartSlice.actions;

export default CartSlice.reducer;
