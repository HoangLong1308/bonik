import axios from './axios';

export const BASE = 'https://provinces.open-api.vn/api/';
export const PROVINCE_URL = `${BASE}p/`;
export const DISTRICT_URL = `${BASE}d/`;
export const PROVINCE_SEARCH_URL = `${BASE}p/search/?q=`;
export const DISTRICT_SEARCH_URL = `${BASE}p/`;
export const WARD_SEARCH_URL = `${BASE}d/`;
// https://provinces.open-api.vn/api/d/62?depth=2
const getProvince = async () => {
    const response = await axios({
        method: 'get',
        url: PROVINCE_URL,
        withCredentials: false,
    });

    // console.log('respone data: ');
    // console.log(response.data);
    return response.data;
};

const getSearchProvince = async (input) => {
    const response = await axios({
        method: 'get',
        url: PROVINCE_SEARCH_URL + input + '*',
        withCredentials: false,
        //  responseType: 'stream'
    });
    return response.data;
};

const getDistrict = async () => {
    const response = await axios({
        method: 'get',
        url: DISTRICT_URL,
        withCredentials: false,
    });
    return response.data;
};

const getSearchDistrict = async (provinceId) => {
    // p/4?depth=2
    const response = await axios({
        method: 'get',
        url: `${DISTRICT_SEARCH_URL}${provinceId}?depth=2`,
        withCredentials: false,
    });
    return response.data;
};

const getSearchWard = async (districtId) => {
    // https://provinces.open-api.vn/api/d/62?depth=2
    const response = await axios({
        method: 'get',
        url: `${WARD_SEARCH_URL}${districtId}?depth=2`,
        withCredentials: false,
    });
    return response.data;
};

export { getProvince, getSearchProvince, getDistrict, getSearchDistrict, getSearchWard };
