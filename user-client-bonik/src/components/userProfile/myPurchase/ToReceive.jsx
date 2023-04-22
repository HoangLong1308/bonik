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
} from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from '../../../services/axios';
import './Purchase.css';
import { BASE_USER, ORDER_TRACKING, ORDER } from '../../../constants/user';
import { getImage } from '../../../common/img';
import { NumericFormat } from 'react-number-format';
const ToReceive = ({ status }) => {
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Cảm ơn bạn đã mua hàng ở BonikShop!!',
        });
    };
    //End
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const pagination = useRef();
    const page = useRef(0);
    const size = useRef(1);
    const loadMoreData = () => {
        axios({
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
                page.current += 1;
                setData([...data, ...dt.data]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };
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
    useEffect(() => {
        loadMoreData();
        return;
    }, []);
    function updateOrderStatus(orderId) {
        return axios({
            method: 'put',
            url: `${BASE_USER}${ORDER}/${orderId}`,
        }).catch((error) => {
            console.log(error.data);
        });
    }
    const handleReceived = useCallback(async (orderId) => {
        await updateOrderStatus(orderId);
        await reloadOrder();
        openNotificationWithIcon('success');
    });
    return (
        <>
            {!loading && data.length != 0 ? (
                <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < pagination.current.totalElement}
                    scrollableTarget="scrollableDiv"
                >
                    {contextHolder}
                    <List
                        dataSource={data}
                        renderItem={(item) => (
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
                                            <Button
                                                style={{
                                                    minWidth: '150px',
                                                    minHeight: '40px',
                                                    backgroundColor: '#ee4d2d',
                                                    color: 'white',
                                                }}
                                                onClick={() => {
                                                    handleReceived(item.id);
                                                }}
                                            >
                                                Đã nhận hàng
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                            </Card>
                        )}
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
export default memo(ToReceive);
