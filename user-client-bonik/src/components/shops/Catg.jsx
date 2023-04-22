import React, { memo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Tree } from 'antd';
import { Slider } from 'antd';
import { Checkbox, Col, Row } from 'antd';
import styled from 'styled-components';
import Category from './Category';
import { Alert, Space, Spin } from 'antd';
import './spin.css';
const PriceRange = () => {
    const marks = {
        500000: '500,000',
        43000000: {
            style: {
                color: '#f50',
            },
            label: <strong>43,000,000</strong>,
        },
    };
    return (
        <Slider
            range={{
                draggableTrack: true,
            }}
            min={500000}
            max={43000000}
            marks={marks}
        />
    );
};

const Catg = ({
    categories,
    onSelectCategory,
    onChangeBrand,
    onChangeStorage,
    listBrand,
    listStorage,
    onClickResult,
    selectedKeys,
    loading,
    categoryLoading,
}) => {
    const MyCheckBox = styled(Checkbox)`
        &.ant-checkbox-wrapper {
            width: 90px;
            height: 35px;

            justify-content: center;
            align-items: center;

            border: 1px solid rgba(0, 0, 0, 0.15);
        }

        &.ant-checkbox-wrapper-checked {
            background-color: #1890ff;
            color: #fff;
        }

        .ant-checkbox {
            display: none;
        }
    `;

    return (
        <>
            {!categoryLoading ? (
                <div className="filter">
                    <div className="">
                        <h3>Danh mục</h3>
                        <Category
                            treeData={categories}
                            onSelectCategory={onSelectCategory}
                            selectedKeys={selectedKeys}
                        />
                    </div>

                    {/* <div>
                    <h3>Giá</h3>
                    <PriceRange />
                </div> */}
                    <div>
                        <h3>Hãng</h3>
                        <MyCheckBox.Group
                            style={{
                                width: '100%',
                            }}
                            onChange={onChangeBrand}
                        >
                            {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}> */}
                            <div style={{ display: 'grind', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                                {listBrand.map((item) => (
                                    <MyCheckBox
                                        key={item.id}
                                        style={{ margin: '10px' }}
                                        value={item.id}
                                    >
                                        {item.brand_name}
                                    </MyCheckBox>
                                ))}
                            </div>
                        </MyCheckBox.Group>
                    </div>
                    <div>
                        <h3>Dung lượng</h3>
                        <Checkbox.Group
                            style={{
                                width: '100%',
                            }}
                            onChange={onChangeStorage}
                        >
                            {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}> */}
                            <div style={{ display: 'grind', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                                {listStorage.map((item) => (
                                    <MyCheckBox
                                        style={{ margin: '10px' }}
                                        value={item.id}
                                    >
                                        {item.storage_name}
                                    </MyCheckBox>
                                ))}
                            </div>
                        </Checkbox.Group>
                    </div>
                    <div>
                        <Button onClick={onClickResult}>Xem kết quả</Button>
                    </div>
                </div>
            ) : (
                <div className="filter">
                    <Space
                        direction="vertical"
                        style={{
                            width: '100%',
                            marginLeft: '9em',
                            height: '550px',
                            position: 'relative',
                            top: 250,
                        }}
                    >
                        <Space style={{ margin: '12px' }}>
                            <Spin tip="Loading">
                                <div className="content" />
                            </Spin>
                        </Space>
                    </Space>
                </div>
            )}
        </>
    );
};

export default memo(Catg);
