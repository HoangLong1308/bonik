import { React, memo, useState, useEffect, useRef, useCallback } from 'react';
import {
    Card,
    Space,
    Button,
    Divider,
    List,
    Skeleton,
    Empty,
    notification,
    Modal,
} from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import RatingForm from '../../../common/rating/RatingForm';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from '../../../services/axios';
import './Purchase.css';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
    BASE_USER,
    ORDER_TRACKING,
    ORDER,
    RATING,
    IS_RATING,
    CANCEL_ORDER,
} from '../../../constants/user';
import { getImage } from '../../../common/img';
import { NumericFormat } from 'react-number-format';
const AllPurchase = ({ status }) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
        });
    };
    //Mở form đánh giá
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productRating, setProductRating] = useState([]);
    const [isRated, setIsRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const pagination = useRef();
    const page = useRef(0);
    const size = useRef(1);
    const { confirm } = Modal;
    const [formValueRating, setformValueRating] = useState([
        // {
        //     value: [
        //         // {
        //         //     point: 0,
        //         //     product_id: null,
        //         //     orderDetail_id: null,
        //         //     content: '',
        //         // },
        //     ],
        //     orderId: null,
        // },
    ]);
    let orderIndex = useRef(-1);
    function fetchRatingProductOfUser(orderId) {
        return axios({
            method: 'get',
            url: `${BASE_USER}${IS_RATING}`,
            params: {
                orderId: orderId,
            },
        });
    }
    //rating star value
    const handleChangeRating = useCallback(
        (value, index, productId, orderDetailId) => {
            let newArr = [...formValueRating];
            newArr[orderIndex.current].value[index] = {
                ...newArr[orderIndex.current].value[index],
                point: value,
                product_id: productId,
                orderDetail_id: orderDetailId,
            };
            setformValueRating(newArr);
        },
    );
    //handle content
    const handleChangeContentRating = useCallback((e, index) => {
        let newArr = [...formValueRating];
        newArr[orderIndex.current].value[index].content = e.target.value;
        setformValueRating(newArr);
    });
    //save rating product to db
    function rateProduct(formValueRating) {
        setLoading(true);
        return axios({
            method: 'post',
            url: `${BASE_USER}${RATING}`,
            data: formValueRating,
        });
    }
    //finish rating
    const handleFinishRating = useCallback(async () => {
        let ratingForm = formValueRating[orderIndex.current].value.filter(
            (f) => f.point > 0,
        );

        await rateProduct(ratingForm)
            .then((res) => {
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
        const promises = formValueRating.map((value) => {
            return fetchRatingProductOfUser(value.orderId);
        });
        Promise.all(promises)
            .then((responses) => {
                const rated = responses.map((res) => {
                    return res.data.length === 0;
                });
                console.log(rated);
                setIsRated(rated);
            })
            .catch((error) => {
                console.error(error);
            });

        setIsModalOpen(false);
        openNotificationWithIcon(
            'success',
            'Cảm ơn bạn đã viết đánh cho sản phẩm',
        );
    });
    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    //End

    const loadMoreData = async () => {
        let ordered;
        await axios({
            method: 'get',
            url: `${BASE_USER}${ORDER_TRACKING}/${status}`,
            params: {
                size: size.current,
                page: page.current,
            },
        })
            .then((res) => {
                let dt = res.data;
                ordered = dt.data;
                pagination.current = dt;
                page.current += 1;
                console.log(ordered);
                setData([...data, ...ordered]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
        const newArr = [...formValueRating];
        ordered.forEach((value) => {
            newArr.push({
                value: [
                    {
                        point: 0,
                        product_id: null,
                        orderDetail_id: null,
                        content: '',
                    },
                ],
                orderId: value.id,
            });
        });
        setformValueRating(newArr);
        const promises = newArr.map((value) => {
            return fetchRatingProductOfUser(value.orderId);
        });
        Promise.all(promises)
            .then((responses) => {
                const rated = responses.map((res) => {
                    return res.data.length === 0;
                });
                setIsRated(rated);
            })
            .catch((error) => {
                // console.error(error);
            });
    };
    //handle rate
    const handleRate = useCallback(async (orderId, index, orderDetail) => {
        orderIndex.current = index;
        let newArr = [...formValueRating];
        newArr[index].value = [];
        orderDetail.forEach(() => {
            newArr[index].value.push({
                content: '',
                point: 0,
            });
        });
        try {
            const res = await fetchRatingProductOfUser(orderId);
            setProductRating(res.data);
            setformValueRating(newArr);
            setIsModalOpen(true);
        } catch (error) {
            // console.error(error);
        }
    });

    //Rating button
    function RatingButton({ index, onClick, checkDisplay }) {
        return (
            <>
                {!isRated[index] && (
                    <Button
                        style={{
                            minWidth: '150px',
                            minHeight: '40px',
                            backgroundColor: '#ee4d2d',
                            color: 'white',
                        }}
                        onClick={onClick}
                    >
                        Đánh giá
                    </Button>
                )}
            </>
        );
    }

    useEffect(() => {
        loadMoreData();
        return;
    }, []);
    const reloadOrder = () => {
        page.current = 0;
        if (loading) {
            return;
        }
        setLoading(true);
        return axios({
            method: 'get',
            url: `${BASE_USER}${ORDER_TRACKING}/${status}`,
            params: {
                size: size.current,
                page: page.current,
            },
        })
            .then((res) => {
                let dt = res.data;
                pagination.current = dt;
                page.current = 1;
                setData(dt.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    function updateOrderStatus(orderId) {
        return axios({
            method: 'put',
            url: `${BASE_USER}${ORDER}/${orderId}`,
        }).catch((error) => {
            // console.log(error.data);
        });
    }
    const handleReceived = useCallback(async (orderId) => {
        await updateOrderStatus(orderId);
        await reloadOrder();
        openNotificationWithIcon(
            'success',
            'Cảm ơn bạn đã mua hàng ở BonikShop!!',
        );
    });
    const handleCancelOrder = (idOrder, listOrderDetails) => {
        // [
        //     {
        //       "id": 43,
        //       "productVariant_id": 67,
        //       "quantity": 1,
        //     }
        //   ]
        const body = listOrderDetails.map((item) => ({
            id: item.id,
            productVariant_id: item.productVariant_id,
            quantity: item.quantity,
        }));
        return axios({
            method: 'put',
            url: `${BASE_USER}${CANCEL_ORDER}`,
            data: body,
            params: {
                idOrder: idOrder,
            },
        });
    };
    const showPromiseConfirm = (idOrder, listOrderDetails) => {
        confirm({
            title: 'Bạn có chắc muốn hủy đơn hàng này chứ ?',
            icon: <ExclamationCircleFilled />,
            onOk() {
                return handleCancelOrder(idOrder, listOrderDetails)
                    .then(async (res) => {
                        await reloadOrder();
                        openNotificationWithIcon(
                            'success',
                            'Hủy đơn hàng thành công',
                        );
                    })
                    .catch((err) => {
                        console.log(err);
                        openNotificationWithIcon(
                            'error',
                            'Có lỗi trong khi hủy vui lòng thử lại!',
                        );
                    });
            },
            onCancel() {},
        });
    };
    return (
        <>
            {data.length != 0 ? (
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < pagination.current.totalElement}
                >
                    {contextHolder}
                    <List
                        dataSource={data}
                        loading={loading}
                        renderItem={(item, index) => (
                            <Card
                                key={item.id}
                                style={{ marginBottom: '20px' }}
                                title={
                                    <div style={{ color: '#26aa99' }}>
                                        <ShopOutlined /> {item.status_name} -
                                        {' Lúc: '}
                                        {new Date(
                                            item.created_date,
                                        ).toLocaleString('vi-VN')}
                                        <span style={{ float: 'right' }}>
                                            Địa chỉ: {item.address}
                                        </span>
                                    </div>
                                }
                            >
                                <Card type="inner">
                                    {item.orderDetails.map((product) => {
                                        return (
                                            <div key={product.id}>
                                                <div
                                                    key={product.id}
                                                    style={{ display: 'flex' }}
                                                >
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            flexWrap: 'nowrap',
                                                            padding: '12px 0 0',
                                                        }}
                                                    >
                                                        {/*Hình sản phẩm*/}
                                                        <div
                                                            style={{
                                                                width: '80px',
                                                                height: '80px',
                                                                flexShrink: 0,
                                                                border: '1px solid #e1e1e1',
                                                            }}
                                                        >
                                                            <div
                                                                className="img-wrapper"
                                                                style={{
                                                                    position:
                                                                        'relative',
                                                                    width: '100%',
                                                                    height: '100%',
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        backgroundImage: `url(${getImage(
                                                                            product.productVariant_image,
                                                                        )})`,
                                                                        backgroundPosition:
                                                                            '50%',
                                                                        backgroundSize:
                                                                            'cover',
                                                                        backgroundRepeat:
                                                                            'no-repeat',
                                                                        position:
                                                                            'absolute',
                                                                        top: 0,
                                                                        left: 0,
                                                                        width: '100%',
                                                                        height: '100%',
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        {/*End Hình sản phẩm*/}

                                                        {/*Tên số lượng và variation*/}
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                flexDirection:
                                                                    'column',
                                                                alignItems:
                                                                    'flex-start',
                                                                padding:
                                                                    '0 0 0 12px',
                                                            }}
                                                        >
                                                            <div>
                                                                <div
                                                                    style={{
                                                                        fontSize:
                                                                            '16px',
                                                                        lineHeight:
                                                                            '22px',
                                                                        margin: '0 0 5px',
                                                                    }}
                                                                >
                                                                    <span
                                                                        style={{
                                                                            verticalAlign:
                                                                                'middle',
                                                                        }}
                                                                    >
                                                                        {
                                                                            product.productVariant_displayName
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        margin: '0 0 5px',
                                                                    }}
                                                                >
                                                                    <div>
                                                                        {
                                                                            product.productVariant_color_name
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        margin: '0 0 5px',
                                                                    }}
                                                                >
                                                                    <div>
                                                                        x
                                                                        {
                                                                            product.quantity
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/*End*/}
                                                        {/*Giá sản phẩm*/}
                                                        <div
                                                            style={{
                                                                textAlign:
                                                                    'right',
                                                            }}
                                                        >
                                                            {product.promotion_value !=
                                                            0 ? (
                                                                <div>
                                                                    <span
                                                                        style={{
                                                                            textDecoration:
                                                                                'line-through',
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            Giá
                                                                            gốc:{' '}
                                                                            <NumericFormat
                                                                                value={
                                                                                    product.productVariant_price
                                                                                }
                                                                                displayType={
                                                                                    'text'
                                                                                }
                                                                                thousandSeparator={
                                                                                    true
                                                                                }
                                                                                suffix={
                                                                                    ' VNĐ'
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </span>
                                                                    <div
                                                                        style={{
                                                                            color: 'red',
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            Số
                                                                            tiền
                                                                            Giảm:{' '}
                                                                            <NumericFormat
                                                                                value={
                                                                                    product.promotion_value
                                                                                }
                                                                                displayType={
                                                                                    'text'
                                                                                }
                                                                                thousandSeparator={
                                                                                    true
                                                                                }
                                                                                suffix={
                                                                                    ' VNĐ'
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <div
                                                                        style={{
                                                                            color: 'red',
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            Giá
                                                                            đã
                                                                            giảm:{' '}
                                                                            <NumericFormat
                                                                                value={
                                                                                    product.discount_amount
                                                                                }
                                                                                displayType={
                                                                                    'text'
                                                                                }
                                                                                thousandSeparator={
                                                                                    true
                                                                                }
                                                                                suffix={
                                                                                    ' VNĐ'
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <span
                                                                        style={{
                                                                            color: 'red',
                                                                        }}
                                                                    >
                                                                        <NumericFormat
                                                                            value={
                                                                                product.productVariant_price
                                                                            }
                                                                            displayType={
                                                                                'text'
                                                                            }
                                                                            thousandSeparator={
                                                                                true
                                                                            }
                                                                            suffix={
                                                                                ' VNĐ'
                                                                            }
                                                                        />
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/*End*/}
                                                    </div>
                                                </div>
                                                <div
                                                    style={{
                                                        borderBottom:
                                                            '1px solid rgba(0,0,0,.09)',
                                                        height: '10px',
                                                    }}
                                                ></div>
                                            </div>
                                        );
                                    })}
                                </Card>

                                {/*Tổng giá*/}
                                {item.promotion_name && (
                                    <div
                                        style={{
                                            padding: '10px 10px 5px',
                                            // background: '#fffefb',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: '0 10px 0 0',
                                                    fontSize: '14px',
                                                    lineHeight: '20px',
                                                    // color: 'rgba(0,0,0,.8)',
                                                }}
                                            >
                                                Áp dụng mã giảm:
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '20px',
                                                    color: '#ee4d2d',
                                                    lineHeight: '30px',
                                                }}
                                            >
                                                {item.promotion_name}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {item.promotion_name && (
                                    <div
                                        style={{
                                            padding: '10px 10px 5px',
                                            background: '#fffefb',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: '0 10px 0 0',
                                                    fontSize: '14px',
                                                    lineHeight: '20px',
                                                    // color: 'rgba(0,0,0,.8)',
                                                }}
                                            >
                                                Giảm:
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '20px',
                                                    color: '#ee4d2d',
                                                    lineHeight: '30px',
                                                }}
                                            >
                                                {' '}
                                                {item.promotion_isPercent
                                                    ? item.discount + '%'
                                                    : item.discount}{' '}
                                                trên tổng hóa đơn
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div
                                    style={{
                                        padding: '10px 10px 5px',
                                        // background: '#fffefb',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div
                                            style={{
                                                margin: '0 10px 0 0',
                                                fontSize: '14px',
                                                lineHeight: '20px',
                                                // color: 'rgba(0,0,0,.8)',
                                            }}
                                        >
                                            Tổng cộng:
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '20px',
                                                color: '#ee4d2d',
                                                lineHeight: '30px',
                                            }}
                                        >
                                            <NumericFormat
                                                value={item.total}
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                suffix={' VNĐ'}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/*End*/}
                                <div
                                    style={{
                                        padding: '24px 24px 12px',
                                        // background: '#fffefb',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Space>
                                            {item.status_name ==
                                                'Chờ xác nhận' && (
                                                <Button
                                                    disabled
                                                    style={{
                                                        minWidth: '150px',
                                                        minHeight: '40px',
                                                        backgroundColor: 'grey',
                                                        color: 'white',
                                                    }}
                                                >
                                                    Đang xử lý
                                                </Button>
                                            )}
                                            {item.status_name ==
                                                'Chờ xác nhận' && (
                                                <Button
                                                    style={{
                                                        minWidth: '150px',
                                                        minHeight: '40px',
                                                        backgroundColor:
                                                            '#ee4d2d',
                                                        color: 'white',
                                                    }}
                                                    onClick={() =>
                                                        showPromiseConfirm(
                                                            item.id,
                                                            item.orderDetails,
                                                        )
                                                    }
                                                >
                                                    Hủy
                                                </Button>
                                            )}
                                            {item.status_name ==
                                                'Hoàn thành' && (
                                                <RatingButton
                                                    index={index}
                                                    checkDisplay={item.id}
                                                    onClick={() => {
                                                        handleRate(
                                                            item.id,
                                                            index,
                                                            item.orderDetails,
                                                        );
                                                    }}
                                                />
                                            )}
                                            {/* {item.status_name ==
                                                'Hoàn thành' && (
                                                <Button
                                                    style={{
                                                        minWidth: '150px',
                                                        minHeight: '40px',
                                                    }}
                                                >
                                                    Mua lại
                                                </Button>
                                            )} */}
                                            {item.status_name ==
                                                'Đang giao' && (
                                                <Button
                                                    style={{
                                                        minWidth: '150px',
                                                        minHeight: '40px',
                                                        backgroundColor:
                                                            '#ee4d2d',
                                                        color: 'white',
                                                    }}
                                                    onClick={() => {
                                                        handleReceived(item.id);
                                                    }}
                                                >
                                                    Đã nhận hàng
                                                </Button>
                                            )}
                                            {/* {item.status_name == 'Đã hủy' && (
                                                <Button
                                                    style={{
                                                        minWidth: '150px',
                                                        minHeight: '40px',
                                                    }}
                                                >
                                                    Mua lại
                                                </Button>
                                            )} */}
                                        </Space>
                                    </div>
                                </div>
                            </Card>
                        )}
                    />
                    <RatingForm
                        isModalOpen={isModalOpen}
                        handleCancel={handleCancel}
                        handleFinish={handleFinishRating}
                        isLoading={loading}
                        data={productRating}
                        valueRating={
                            orderIndex.current >= 0 &&
                            formValueRating[orderIndex.current].value
                        }
                        handleChangeRating={handleChangeRating}
                        handleChangeContentRating={handleChangeContentRating}
                    />
                </InfiniteScroll>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>Chưa có đơn hàng nào</span>}
                />
            )}
        </>
    );
};
export default memo(AllPurchase);
