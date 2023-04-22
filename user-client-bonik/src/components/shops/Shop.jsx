import React, { memo } from 'react';
import Catg from './Catg';
import ShopCart from './ShopCart';
import './style.css';
import { Select, Space, Pagination } from 'antd';
import '../MainPage/Home.css';
import Home from '../MainPage/Home';
const Shop = ({
    shopItems,
    totalPage,
    onChangePagination,
    categories,
    title,
    sliderItem,
    onSelectCategory,
    onChangeBrand,
    onChangeStorage,
    listBrand,
    listStorage,
    onClickResult,
    isAuth,
    handleSortingChange,
    sortValue,
    selectedKeys,
    isLoading,
    categoryLoading,
}) => {
    const SortingCombox = ({ handleSortingChange, sortValue }) => {
        return (
            <Space wrap>
                <Select
                    value={sortValue}
                    style={{
                        width: 150,
                    }}
                    onChange={handleSortingChange}
                    options={[
                        {
                            value: 'All',
                            label: 'Tất cả',
                        },
                        // {
                        //     value: 'quantitySold desc',
                        //     label: 'Bán chạy',
                        // },
                        {
                            value: 'price desc',
                            label: 'Giá cao đến thấp',
                        },
                        {
                            value: 'price asc',
                            label: 'Giá thấp đến cao',
                        },
                        {
                            value: 'discount desc',
                            label: 'Giảm giá',
                        },
                        // {
                        //     value: 'averagePoint desc',
                        //     label: 'Đánh giá',
                        // },
                    ]}
                />
            </Space>
        );
    };

    return (
        <>
            {/* <Home CartItem={sliderItem} /> */}
            <section className="shop background ">
                <div id="section-product" className="container d_flex">
                    <Catg
                        categories={categories}
                        onSelectCategory={onSelectCategory}
                        listBrand={listBrand}
                        listStorage={listStorage}
                        onChangeBrand={onChangeBrand}
                        onChangeStorage={onChangeStorage}
                        onClickResult={onClickResult}
                        key={categories.key}
                        selectedKeys={selectedKeys}
                        categoryLoading={categoryLoading}
                    />
                    <div className="contentWidth">
                        <div className="heading d_flex">
                            <div className="heading-left row  f_flex">
                                <h2>{title}</h2>
                            </div>
                            <SortingCombox
                                handleSortingChange={handleSortingChange}
                                sortValue={sortValue}
                            />
                        </div>
                        <div className="product-content grid1">
                            <ShopCart
                                shopItems={shopItems}
                                isAuth={isAuth}
                                isLoading={isLoading}
                            />
                        </div>
                        
                        {totalPage != 0 && (
                            <Pagination
                                pageSize={1}
                                total={totalPage}
                                showQuickJumper
                                style={{ textAlign: 'center' }}
                                onChange={onChangePagination}
                            />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default memo(Shop);
