import React, { useState, useEffect, memo, useCallback } from 'react';
import { Col, Row, Form, Button, Select, Tooltip } from 'antd';
import { Button as MUIButton, Tooltip as MUITooltip, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';
import { CloseOutlined } from '@ant-design/icons';
import { USER_PROMO_VALID, USER_PROMO_ORDER } from '../../constants/user.js';
import { ENV_URL } from '../../constants/index';
import { getCurrencyFormatComp, getPromotion, getPromotionValue, getVariantDetail, getColorOfCartItem, getDiscountAmountOfItem, getPriceDetail } from '../../common/Cart/CartUtil';
import axios from '../../services/axios';
import { getImage } from '../../common/img';
const OrderList = ({ disableCheckoutBtn, onClickOrder, onAddPromotion }) => {
    const [PromoForm] = Form.useForm();
    const [promoOptions, setPromoOptions] = useState([]);
    const [promotionList, setPromotionList] = useState([]);
    const [selectedPromo, setSelectedPromo] = useState(-1);

    const promoCode = Form.useWatch('promo_code', PromoForm);
    const Cart = useSelector((state) => {
        return state.cart;
    });
    const { items } = Cart;
    const list = items.map((item, index) => {
        return <OrderListItem key={index} product={item}></OrderListItem>;
    });
    useEffect(() => {
        fetchPromoUserForOrder();
    }, []);
    const fetchPromoUserForOrder = useCallback(() => {
        const request = {
            order_total: Cart.total,
            code: '0000',
        };
        axios
            .post(`${ENV_URL}${USER_PROMO_ORDER}`, { ...request })
            .then((res) => {
                console.log('res data: ');
                console.log(res.data);
                if (res.data == undefined || res.data.length === 0) return;

                const options = res.data.map((p) => {
                    return { ...p, label: p.promotion_code, value: p.id };
                });
                setPromoOptions((prev) => options);
            })
            .then((e) => console.log(e.message));
    });

    const getDiscountAmmountByCode = () => {
        if (selectedPromo == -1) return '';
        let index = findIndexOfSelectedPromo();
        let codeObj = promoOptions[index];
        let { discount_value } = codeObj;
        let is_percent = codeObj.is_percent === null ? false : codeObj.is_percent;

        if (!is_percent) {
            return discount_value;
        } else {
            return Cart.total * (discount_value * 0.01);
        }
    };

    const getTotalAfterAddPromo = () => {
        let t = Cart.total - getDiscountAmmountByCode();
        return t <= 0 ? 0.0 : t;
    };

    useEffect(() => {
        console.log('useEffec selec promo');
        const timeout = setTimeout(() => {
            getSelectedCode();
            description();
            getDiscountAmmountByCode();
            onAddPromotion(selectedPromo);
        }, 400);

        return () => {
            clearTimeout(timeout);
        };
    }, [selectedPromo]);
    const description = (conditionOnly = false) => {
        if (selectedPromo === -1) return '';
        let index = findIndexOfSelectedPromo();
        let promo = promoOptions[index];
        let { promotion_type_namePromotionType: type_name, name_promotion_user: promo_name, is_percent, discount_value } = promo;
        let expiration_date = promo.expiration_date;
        let min = promo.promotion_type_conditionMinimum;
        let discount_type = is_percent ? `Giảm ${discount_value}% ` : `Giảm ${discount_value} `;
        let condition = min !== null ? `${discount_type} cho đơn từ` : `${discount_type} cho mọi đơn hàng`;

        if (conditionOnly)
            return (
                <span>
                    {' '}
                    {condition} {min !== null && <NumericFormat value={min} displayType={'text'} thousandSeparator={true} />}{' '}
                </span>
            );
        return (
            <div id="promo-pop-tooltip" className="d_flex_col pop-tooltip">
                <span> {` Loại: ${type_name}`}</span>
                <span> {` Promo:  ${promo.name_promotion_user}`}</span>
                <span>
                    {' '}
                    {condition} {min !== null && <NumericFormat value={min} displayType={'text'} thousandSeparator={true} />}{' '}
                </span>
                <span> {`${expiration_date !== null ? `Ngày hết hạn: ${formateDate(new Date(expiration_date))}` : ''}`}</span>
            </div>
        );
    };
    const changeDescription = ({ target }) => {
        console.log('hover value: ');
        console.log(target);
    };
    const onOrderHandler = () => {
        onClickOrder();
    };
    const findIndexOfSelectedPromo = () => {
        return promoOptions.findIndex((p) => p.value === selectedPromo);
    };
    const getSelectedCode = () => {
        if (selectedPromo == -1) return '';
        let index = findIndexOfSelectedPromo();
        return promoOptions[index].label;
    };
    const onChange = (value) => {
        console.log(value);
        PromoForm.setFieldsValue({ promo_code: value });
        console.log(promoCode);
    };
    const addPromoCode = () => {
        console.log('add promo');
        PromoForm.validateFields()
            .then((res) => {
                console.log('valued ');
                setSelectedPromo((prev) => promoCode);
            })
            .catch((e) => console.log(e));

        // setSelectedPromo(prev => promoCode)
    };
    const removeCode = () => {
        setSelectedPromo((prev) => -1);
        PromoForm.setFieldsValue({ promo_code: undefined });
        PromoForm.resetFields();
    };
    return (
        <section className="order-list">
            <h4>
                Đơn hàng{`  `} (<span>{Cart.totalCount}</span>)
            </h4>
            <ul className="order-list-container">{list}</ul>

            <div className="coupon-container">
                <Form layout="vertical" className="promo-form-f" name="coupon" form={PromoForm}>
                    <h4 className="coupon-container-title"> Mã giảm giá</h4>
                    {selectedPromo !== -1 && (
                        <div className="selected-coupon d_flex_jus_center">
                            <span className="coupon-code">
                                {/* <MUITooltip className="promo-help-tooltip" placement="top" title={description()}>
                                    <IconButton className="help-button">
                                        <HelpIcon></HelpIcon>
                                    </IconButton>
                                </MUITooltip> */}
                                {getSelectedCode()}
                            </span>
                            <Button className="remove-promo" onClick={removeCode} type="text" icon={<CloseOutlined />} />
                        </div>
                    )}

                    <div className="d_flex_jus_center">
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọ mã giảm giá',
                                },
                            ]}
                            name="promo_code"
                            style={{ flex: '1' }}
                        >
                            <Tooltip style={{ fontSize: '12px' }} placement="top" title={description()}>
                                <Select
                                    showSearch
                                    placeholder="Chọn mã giảm giá"
                                    optionFilterProp="children"
                                    onFocus={changeDescription}
                                    onChange={onChange}
                                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={promoOptions}
                                />
                            </Tooltip>
                        </Form.Item>

                        <Form.Item>
                            <Button onClick={addPromoCode}>Áp dụng</Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className="order-total">
                <div className="box box-quantity">
                    <h3>Số lượng</h3>
                    <div className="quantity">{Cart.totalCount}</div>
                </div>
                <div className="box base">
                    <h3>Tạm tính: </h3>
                    <div className="base">{getCurrencyFormatComp(Cart.baseAmount, true)}</div>
                </div>
                <div className="box dis">
                    <h3>Giảm giá: </h3>
                    <div className="dis">{getCurrencyFormatComp(Cart.discount, true)}</div>
                </div>
                {selectedPromo !== -1 && (
                    <div className="box dis">
                        <h3>
                            {' '}
                            Giảm mã:
                            <MUITooltip className="promo-help-tooltip" placement="top" title={description(true)}>
                                <IconButton className="help-button">
                                    <HelpIcon></HelpIcon>
                                </IconButton>
                            </MUITooltip>
                        </h3>
                        <div className="dis">{getCurrencyFormatComp(getDiscountAmmountByCode(), true)}</div>
                    </div>
                )}
                {selectedPromo === -1 ? (
                    <div className="box total">
                        <h3>Tổng tiền</h3>
                        <div className="total">{getCurrencyFormatComp(Cart.total, true)}</div>
                    </div>
                ) : (
                    <div className="box total">
                        <h3>Tổng tiền</h3>
                        <div className="total">{getCurrencyFormatComp(getTotalAfterAddPromo(), true)}</div>
                    </div>
                )}
            </div>
            <div className="order-btn">
                <Button disabled={disableCheckoutBtn} onClick={onOrderHandler}>
                    Đặt hàng
                </Button>
            </div>
        </section>
    );
};

const OrderListItem = ({ product }) => {
    console.log('orderItem:', product);
    const variant_detail = getVariantDetail(product);

    const { productVariant: detail, price_detail, discount_amount, quantity } = product;

    const { display_name: name, image } = variant_detail;

    return (
        <li key={product.id}>
            <div className="order-list-card">
                <div className="product-detail">
                    <Row>
                        <Col style={{ display: 'flex' }} span={10}>
                            <div className="image">
                                <img src={getImage(image)} alt="" />
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className="product-detail-info">
                                <div className="product-detail-top">
                                    <div className="discount-tag">{getPromotion(product) && <span className="discount-container"> Giảm: {getPromotionValue(product)}</span>}</div>
                                    <h3
                                        style={{
                                            fontSize: '16px',
                                            marginTop: '0.5rem',
                                        }}
                                    >
                                        {name}
                                    </h3>
                                </div>
                                <div className="product-detail-bottom">
                                    <div className="gen">
                                        <div className="quantity-container">
                                            Số lượng: <span className="quantity"> {quantity}</span>
                                        </div>
                                        <div className="price-container">Giá: {getCurrencyFormatComp(getPriceDetail(product), false, 'price-per-product')} </div>
                                        {/* <div>
                                            {getPromotion(product) && (
                                                <span className='discount-container'> Giảm: {getPromotionValue(product)}</span>
                                            )}
                                        </div> */}
                                    </div>

                                    <div className="price">
                                        {getCurrencyFormatComp(getPriceDetail(product), false, 'origin-price')}
                                        {getCurrencyFormatComp(getDiscountAmountOfItem(product), false, 'total')}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </li>
    );
};
const formateDate = (date) => {
    const format = new Intl.DateTimeFormat('ban', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
    return format.format(date).replace(', ', ' ');
    //   return  format.day + format.month + "/" + format.year  + " " + format.hour + ":" + format ;
};
export default memo(OrderList);
