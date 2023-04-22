// {
//     "payment_method_id": 0,
//     "promotionUser_id": 0,
//     "district": "string",
//     "addressLine": "string",
//     "province": "string",
//     "postalId": "string"
//   }
import axios from './axios';
import { useDispatch, useSelector } from 'react-redux';
import { CHECKOUT } from '../constants/user';

const checkout = async (requestCheckout) => {
    await axios
        .post(`${CHECKOUT}`, {
            data: { ...requestCheckout },
        })
        .then((data) => {
            console.log('redirect, fetch cart');
        });
};
