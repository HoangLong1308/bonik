import React, { useState, memo, useEffect, useCallback } from 'react';
import { Button, Modal } from 'antd';
import Rater from './Rater';
import { Input } from 'antd';
import { getImage } from '../img';
const { TextArea } = Input;

const RatingForm = ({
    isModalOpen,
    handleCancel,
    handleFinish,
    isLoading,
    data,
    valueRating,
    handleChangeRating,
    handleChangeContentRating,
}) => {
    return (
        <>
            <Modal
                title="Đánh Giá Sản Phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Trờ lại
                    </Button>,
                    <Button
                        loading={isLoading}
                        key="submit"
                        type="primary"
                        onClick={handleFinish}
                    >
                        Hoàn thành
                    </Button>,
                ]}
            >
                {data.length != 0 &&
                    data.map((item, index) => {
                        return (
                            <div key={index}>
                                <div style={{ display: 'flex' }}>
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
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
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '100%',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        backgroundImage: `url(${getImage(
                                                            item.productVariant_image,
                                                        )})`,
                                                        backgroundPosition:
                                                            '50%',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat:
                                                            'no-repeat',
                                                        position: 'absolute',
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
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                padding: '0 0 0 12px',
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        fontSize: '16px',
                                                        lineHeight: '22px',
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
                                                            item.productVariant_displayName
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
                                                            item.productVariant_color_name
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*End*/}
                                    </div>
                                </div>
                                {/*Chất lượng sản phẩm*/}
                                <div>
                                    <span style={{ marginRight: '10px' }}>
                                        Chất lượng sản phẩm
                                    </span>
                                    <span>
                                        <Rater
                                            handleChange={(value) => {
                                                handleChangeRating(
                                                    value,
                                                    index,
                                                    item.product_id,
                                                    item.id,
                                                );
                                            }}
                                            value={valueRating[index].point}
                                        />
                                    </span>
                                </div>

                                <TextArea
                                    rows={4}
                                    placeholder="Tối đa 150 từ"
                                    maxLength={150}
                                    showCount
                                    value={valueRating[index].content}
                                    onChange={(e) =>
                                        handleChangeContentRating(e, index)
                                    }
                                />
                            </div>
                        );
                    })}
            </Modal>
        </>
    );
};
export default memo(RatingForm);
