import {
    INIT_CART,
    ADD_ITEM,
    REMOVE_ITEM,
    MERGE_ITEM,
    CLEAR_CART,
} from '../actions/CartAction';
const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    cart: null,
};

const CartReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT_CART:
            console.log('find cart in localStorage');
            console.log(action.payload);
            console.log('INIT');
            return {
                ...state,
                isAuthenticated: false,
                isInitialised: false,
                cart: null,
            };
        case ADD_ITEM:
            console.log('ADD_ITEM');
            return {
                ...state,
                isAuthenticated: false,
                isInitialised: false,
                cart: null,
            };
        case REMOVE_ITEM:
            console.log('ADD_ITEM');
            return {
                isAuthenticated: false,
                isInitialised: false,
                cart: null,
            };
        case MERGE_ITEM:
            console.log('ADD_ITEM');
            return {
                ...state,
                isAuthenticated: false,
                isInitialised: false,
                cart: null,
            };
        case CLEAR_CART:
            console.log('ADD_ITEM');
            return {
                ...state,
                isAuthenticated: false,
                isInitialised: false,
                cart: null,
            };

        default:
            return { ...state };
    }
};

export default CartReducer;
