import React, { useState, useEffect, useCallback, memo, useContext } from 'react';
import { Col, Row, Space } from 'antd';
import { Button, Checkbox, Form, Input, Radio, Select } from 'antd';
import { PAYMETHOD, ENV_URL } from '../../constants/index';
import { USER_INFOS, USER_ADDRESS_LIST, USER_ADDRESS_DEFAULT } from '../../constants/user';
import axios from '../../services/axios';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse } from 'antd';
import AddressForm from './AddressForm';

import { AimOutlined } from '@ant-design/icons';
import { REQUEST, CHECKOUT_TYPE, CheckoutContext } from './Checkout';
const { Panel } = Collapse;
export const ADDRESS_FIELD = {
    PROVINCE: Symbol('province'),
    WARDS: Symbol('wards'),
    LINE: Symbol('address_line'),
    DISTR: Symbol('district'),
    POSTID: Symbol('postal_id'),
};
const getConfigAddressForm = (name) => {
    const { PROVINCE, WARDS, LINE, DISTR } = ADDRESS_FIELD;
    let field = '';
    switch (name) {
        case PROVINCE:
            field = 'Tỉnh/Thành';
            break;
        case WARDS:
            field = 'Phuờng/Xã';
            break;
        case DISTR:
            field = 'Quận/Huyện';
            break;
        case LINE:
            field = 'Địa chỉ';
            break;
        default:
            field = 'unknown';
    }

    return {
        rules: [
            {
                type: 'object',
                required: true,
                message: `Vui lòng nhập ${field}`,
            },
        ],
    };
};

const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: '',
        },
    ],
};

const CheckoutForm = ({ form, onFinish }) => {
    const { dispatch, CheckoutReducer } = useContext(CheckoutContext);
    const { PROVINCE, WARDS, LINE, DISTR } = ADDRESS_FIELD;
    const { METHOD } = REQUEST;
    const { PAYMENT: ACTION_PAY, ADDRESS: ACTION_ADDR, OTHER_ADDRESS: ACTION_OTHER_ADDR, PROMO, CHECKOUT } = CHECKOUT_TYPE;
    const initalInputAddress = {
        address_line: '',
        district: '',
        postal_id: '',
        province: '',
        wards: '',
    };
    // const [form] = Form.useForm();

    const inputAddressLine = Form.useWatch('input_addressline', form);
    const inputProvince = Form.useWatch('input_province', form);
    const inputDistrict = Form.useWatch('input_district', form);
    const inputWard = Form.useWatch('input_ward', form);
    const paymentfield = Form.useWatch('payment', form);

    // const inputDistrict = Form.useWatch();

    const [payMethods, setPayMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState(undefined);
    const [userInfo, setUserInfo] = useState({});
    const [userAddresses, setUserAddresses] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState({});
    const [otherAddress, setOtherAddress] = useState(false);

    const [inputAddress, setInputAddress] = useState(initalInputAddress);
    // const [inputProvince, setInputProvince] = useState('');

    const [activeKey, setActiveKey] = useState([]);

    const fetchUserInfo = async () => {
        return axios.get(`${ENV_URL}${USER_INFOS}`);
    };
    const fetchPaymentMethod = async () => {
        return axios.get(`${ENV_URL}${PAYMETHOD}`);
    };
    const fetchUserAddress = async () => {
        return axios.get(`${ENV_URL}${USER_ADDRESS_LIST}`);
    };

    useEffect(() => {
        console.log('Ceh: ', CheckoutReducer);
    }, [CheckoutReducer]);
    useEffect(() => {
        // await fetchData();
        setLoading(true);
        const fetch = async () => {
            console.log('getPayMethod....');
            await getPayMethods();
            console.log('finish getPayMethod....');
            console.log('');
            console.log('getUserInfo....');
            await getUserInfo();
            console.log('finish getUserInfo....', userInfo);

            console.log('');
            console.log('getAddress....');
            await getAddresses();
            form.setFieldsValue({ payment: undefined });
            // console.log('finish Address....');
        };
        fetch();

        setLoading(false);
        console.log('after fetch userInfo....', userInfo);
        console.log('finish getInfo....', getInfo());
        // getAddresses();
    }, []);
    useEffect(() => {
        setLoading(true);
        getInfo();
        getAddresses();

        setLoading(false);
    }, [userInfo]);
    useEffect(() => {
        setLoading(true);
        let index = userAddresses.findIndex((a) => a.id === getDefaultAddress().id);
        console.log('index: ', index);
        // getInfo();
        // getAddresses();
        setSelectedAddress(index);

        console.log('usserAddresses: ', userAddresses);

        if (userAddresses.length === 0) {
            setOtherAddress(true);
        } else {
            setOtherAddress(false);
        }
        setLoading(false);
    }, [userAddresses]);

    useEffect(() => {
        setLoading(true);
        // getAddresses();
        getSelectedAddress();
        setLoading(false);
        const timeOutId = setTimeout(() => {
            dispatch({ type: ACTION_ADDR, payload: getSelectedAddress() });
        }, 200);
        return () => clearTimeout(timeOutId);
    }, [selectedAddress]);

    useEffect(() => {
        const timeOutId = setTimeout(
            () =>
                setInputAddress((prev) => {
                    return { ...prev, address_line: inputAddressLine };
                }),
            200,
        );
        return () => clearTimeout(timeOutId);
    }, [inputAddressLine]);
    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setInputAddress((prev) => {
                return { ...prev, district: inputDistrict };
            });
        }, 200);
        return () => clearTimeout(timeOutId);
    }, [inputDistrict]);
    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setInputAddress((prev) => {
                return { ...prev, province: inputProvince };
            });
        }, 200);
        return () => clearTimeout(timeOutId);
    }, [inputProvince]);
    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setInputAddress((prev) => {
                return { ...prev, wards: inputWard };
            });
        }, 200);
        return () => clearTimeout(timeOutId);
    }, [inputWard]);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            dispatch({ type: ACTION_OTHER_ADDR, payload: inputAddress });
        }, 300);
        return () => clearTimeout(timeOutId);
    }, [inputAddress]);

    const getSelectedAddress = (ADDRESS_FIELD) => {
        if (!userAddresses || userAddresses === undefined || selectedAddress === undefined) return undefined;
        if (!ADDRESS_FIELD) return { ...userAddresses[selectedAddress] };

        // console.log('getUserAddress: ', userAddresses[selectedAddress]);
        if (userAddresses[selectedAddress] === undefined) return '';
        // console.log(':  ', ADDRESS_FIELD.description);
        let { [ADDRESS_FIELD.description]: f } = userAddresses[selectedAddress];
        return f;
    };

    const getInputAddress = () => {};
    const getPayMethods = async () => {
        try {
            let methods = await (await fetchPaymentMethod()).data;
            setPayMethods((prev) => [...methods]);
        } catch (e) {
            console.log(e.message);
        }
    };
    const getUserInfo = async () => {
        try {
            let user_info = await (await fetchUserInfo()).data;
            console.log('user info; ', user_info);
            // setUserInfo((prev) =>{ return {...prev,...user_info}} );
            setUserInfo(user_info);
        } catch (e) {
            console.log(e.message);
        }
    };
    const getInfo = () => {
        const { full_name: name, email, phone, addresses } = userInfo;

        return { name: name, email, phone, addresses };
    };

    const getAddresses = async () => {
        console.log(' inside getAddress...');
        const { addresses } = getInfo();
        console.log('userInfo addresses: ', addresses);

        const inital = [
            {
                id: -1,
                address_line: '',
                district: '',
                postal_id: '',
                province: '',
                wards: '',
            },
        ];
        try {
            console.log('fetch address----------');
            await fetchUserAddress().then((res) => {
                console.log('fetch data: ');
                console.log(res.data);
                setUserAddresses((prev) => {
                    return res.data;
                });
            });
        } catch (error) {
            let { response } = error;
            if (response.status === '404') {
                setUserAddresses((prev) => {
                    return [...inital];
                });
            }
            console.log('fetch address error: ' + error.response.status);
        }
    };

    function getDefaultAddress() {
        // console.log("userAddress: ", userAddresses);
        let defaultAddress = userAddresses.filter((a) => a.is_default);
        // console.log(defaultAddress[0]);
        return { ...defaultAddress[0] };
    }

    const methodOnChangeHandler = (target) => {
        let value = target.target.value;
        console.log('radio checked', value);
        form.setFieldsValue({ payment: value });
        // let value =  e.target.value;
        // let selected = payMethods.findIndex((i) => i.id === value);
        // console.log('selected: ', payMethods[selected]);
        setSelectedMethod((prev) => {
            return value;
        });
    };

    useEffect(() => {
        console.log('call dispatch');
        const timeOutId = setTimeout(() => {
            dispatch({ type: ACTION_PAY, payload: selectedMethod });
        }, 200);
        return () => clearTimeout(timeOutId);
    }, [selectedMethod]);

    const onChangeUsingAddressHandler = () => {
        console.log('other address failed');
        setOtherAddress(false);
        if (userAddresses !== undefined && userAddresses.length > 0) {
            console.log('selected addreess: ', selectedAddress);
            console.log('sele');
            let index = selectedAddress;
            console.log(userAddresses[selectedAddress]);
            setSelectedAddress((prev) => {
                return prev;
            });
        }
    };
    const onChangeUsingOtherAddressHandler = () => {
        if (otherAddress) return;

        console.log('other address true');
        setOtherAddress(true);
        form.setFieldsValue({ input_addressline: undefined });
        form.setFieldsValue({ input_province: undefined });
        form.setFieldsValue({ input_district: undefined });
        form.setFieldsValue({ input_ward: undefined });
    };

    useEffect(() => {
        console.log('otherAddress state: ', otherAddress);
        let key = otherAddress ? [1] : [];
        setActiveKey((prev) => key);
    }, [otherAddress]);

    return (
        <>
            {isLoading && <div>Loadding</div>}
            {!isLoading && (
                <section className="checkout-form">
                    <Row justify="center" className="form_row" gutter={[22, 22]}>
                        <Col span={22} className="form_col p-1">
                            <Form
                                scrollToFirstError={{
                                    behavior: 'smooth',
                                    block: 'center',
                                    inline: 'center',
                                }}
                                className="checkout-form-f"
                                layout="vertical"
                                name="basic"
                                form={form}
                                validateTrigger={onFinish}
                                //  initialValues={{ province: `${!getDefaultAddress().province? "dda" : ''}`}}
                            >
                                <Form.Item
                                    name="payment"
                                    value={selectedMethod}
                                    onChange={methodOnChangeHandler}
                                    className="payment-form"
                                    label={<h4>Phương thức thanh toán</h4>}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn phương thức thanh toán',
                                        },
                                    ]}
                                >
                                    {form.getFieldError('payment') !== undefined ? <span>{form.getFieldError('payment')[0]} </span> : ''}

                                    <Radio.Group>
                                        <Space wrap size={[5, 12]} style={{ width: '400px' }}>
                                            {payMethods.map((item, index) => {
                                                return (
                                                    <Radio className={selectedMethod ? 'checked' : ''} key={index + Math.random() * 100} value={item.id}>
                                                        {item.method}
                                                    </Radio>
                                                );
                                            })}
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                {/* <div> */}
                                <Row className="form_row contact-info">
                                    <Col span={24} className="form_col checkout-form-user-info">
                                        <h4>Thông tin khách hàng</h4>
                                        <div className="info-container">
                                            <div className="info-row">
                                                {/* <div> */}
                                                <div>Họ tên: </div>
                                                <div className="content"> {getInfo().name} </div>
                                                {/* </div> */}
                                            </div>
                                            <div className="info-row">
                                                {/* <div> */}
                                                <div>Email: </div>
                                                <div className="content"> {getInfo().email} </div>
                                                {/* </div> */}
                                            </div>
                                        </div>

                                        <div className="info-container">
                                            <div className="info-row">
                                                {/* <div> */}
                                                <div>Số điện thoại: </div>
                                                <div className="content"> {getInfo().phone} </div>
                                                {/* </div> */}
                                            </div>
                                        </div>
                                        {userAddresses !== undefined && userAddresses.length === 0 ? (
                                            <div className="info-container address">
                                                <div className="info-row">Không tìm thấy dịa chỉ mặc định</div>
                                            </div>
                                        ) : (
                                            <div className="info-container address">
                                                <div className="info-row">
                                                    {getDefaultAddress().id === -1 && <div>Địa chỉ khác</div>}

                                                    {getDefaultAddress().id >= 0 && (
                                                        <Row className="default-area" align="middle" justify="space-around">
                                                            <Button className="default-btn" disabled={!otherAddress} onClick={onChangeUsingAddressHandler}>
                                                                Sử dụng địa chỉ mặc định
                                                            </Button>
                                                            <Form.Item
                                                                {...{
                                                                    labelCol: {
                                                                        span: 6,
                                                                    },
                                                                    wrapperCol: {
                                                                        span: 24,
                                                                    },
                                                                }}
                                                                className="address-selected"
                                                                // label={`Địa chỉ giao hàng: ${
                                                                //     getDefaultAddress().id
                                                                // }`}
                                                            >
                                                                <Radio.Group
                                                                    disabled={otherAddress}
                                                                    className="address-selected-radio-group"
                                                                    value={selectedAddress}
                                                                    onChange={(e) =>
                                                                        setSelectedAddress((prev) => {
                                                                            console.log('choose user address');
                                                                            return e.target.value;
                                                                        })
                                                                    }
                                                                >
                                                                    {userAddresses.map((value, index) => (
                                                                        <Radio.Button value={index}>{`${value.is_default ? 'Mặc định' : `Địa chỉ ${index}`}`}</Radio.Button>
                                                                    ))}
                                                                </Radio.Group>
                                                            </Form.Item>
                                                        </Row>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="user-address">
                                        <h4>{getDefaultAddress().id === -1 && <div>Địa chỉ khác</div>}</h4>
                                        <div>
                                            {!isLoading && userAddresses !== undefined && (
                                                <>
                                                    <Row>
                                                        <h4
                                                            style={{
                                                                paddingBottom: '.5rem',
                                                            }}
                                                        >
                                                            Địa chỉ giao hàng{' '}
                                                        </h4>
                                                    </Row>
                                                    <Row className="address-row" span={24}>
                                                        <Col className="icon" span={4}>
                                                            <AimOutlined
                                                                style={{
                                                                    fontSize: '20px',
                                                                }}
                                                            ></AimOutlined>
                                                        </Col>
                                                        {!otherAddress && (
                                                            <Col className="user-add-def-container" span={20}>
                                                                <Row className={'top-field'} gutter={[16, 16]}>
                                                                    <Col className="address-field" span={12}>
                                                                        <span className="title">
                                                                            Tỉnh/Thành:
                                                                            {`  `}
                                                                        </span>

                                                                        <span>{getSelectedAddress(PROVINCE)}</span>
                                                                    </Col>
                                                                    <Col className="address-field">
                                                                        <span className="title">Quận/Huyện: </span>

                                                                        <span>{getSelectedAddress(DISTR)}</span>
                                                                    </Col>
                                                                </Row>
                                                                <Row gutter={[16, 16]}>
                                                                    <Col className="address-field">
                                                                        <span className="title">Địa chỉ: </span>
                                                                        <span>
                                                                            {getSelectedAddress(LINE)}, {getSelectedAddress(WARDS)}
                                                                        </span>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        )}
                                                        {otherAddress && (
                                                            <Col className="user-add-def-container" span={20}>
                                                                <Row span={24}>
                                                                    <Col className="address-field" span={12}>
                                                                        <span className="title">
                                                                            Tỉnh/Thành:
                                                                            {`  `}
                                                                        </span>

                                                                        <span>{inputProvince}</span>
                                                                    </Col>
                                                                    <Col className="address-field">
                                                                        <span className="title">Quận/Huyện: </span>

                                                                        <span>{inputDistrict}</span>
                                                                    </Col>
                                                                </Row>
                                                                <Row span={24}>
                                                                    <Col className="address-field" span={24}>
                                                                        <span className="title">
                                                                            Phường/Xã: {`  `}
                                                                            {inputWard !== undefined && `${inputWard}`}
                                                                        </span>
                                                                    </Col>
                                                                </Row>
                                                                <Row span={24}>
                                                                    <Col className="address-field">
                                                                        <span className="title">
                                                                            Địa chỉ: {`  `}
                                                                            {inputAddressLine !== undefined && inputAddressLine.length > 0 ? inputAddressLine + ' ' : ''}
                                                                        </span>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        )}
                                                    </Row>
                                                </>
                                            )}
                                        </div>
                                    </Col>
                                </Row>

                                <></>
                                <Collapse collapsible={otherAddress ? 'disabled' : 'header'} className="other-address-collapse" onChange={onChangeUsingOtherAddressHandler} activeKey={activeKey}>
                                    <Panel showArrow={true} header={`Sử dụng địa chỉ khác `} key="1">
                                        <AddressForm otherAddress={otherAddress} form={form}></AddressForm>
                                    </Panel>
                                </Collapse>

                                {/* </div> */}
                            </Form>
                        </Col>
                    </Row>
                </section>
            )}
        </>
    );
};
export default memo(CheckoutForm);
