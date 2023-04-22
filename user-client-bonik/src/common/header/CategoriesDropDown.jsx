import React, { memo, useState, useEffect } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { HashLink as Link } from 'react-router-hash-link';
import axios from 'axios';
import { BASE, CATEGORY } from '../../constants/index';
export const getCategories = async () => {
    return await axios({
        method: 'get',
        url: `${BASE}${CATEGORY}`,
    });
};
function CategoriesDropDown() {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        getCategories().then((res) => {
            setCategories((prev) => res.data);
        });
    }, []);
    const menuI = categories.map((value, index) => {
        return (
            <div key={index} className={'box'}>
                <Menu.Item key={index}>
                    <Link
                        to={`/product/${value.key}#section-product`}
                        key={value.key}
                        smooth
                        scroll={(element) =>
                            element.scrollIntoView({
                                behavior: 'smooth',
                                block: 'end',
                                inline: 'nearest',
                            })
                        }
                    >
                        <div key={index}>
                            <a
                                // className="f_flex"
                                // style={{ width: '100%' }}
                                href="/category"
                            >
                                <span>{value.title}</span>
                            </a>
                        </div>
                    </Link>
                </Menu.Item>
            </div>
        );
    });

    return (
        <>
            <Dropdown
                className="header-dropdown"
                overlay={
                    <Menu className={'category'}>
                        {menuI}
                        {/* <Menu.Item key="0">
                Menu Item One
              </Menu.Item>
              <Menu.Item key="1">
              Menu Item Two
              </Menu.Item>
              <Menu.Item key="1">
              Menu Item Three
              </Menu.Item> */}
                    </Menu>
                }
                trigger={['hover', 'click']}
            >
                <Button
                    style={{ marginBottom: '1rem' }}
                    className="ant-dropdown-button"
                >
                    <i class="fa fa-stream"></i>
                    Danh mục sản phẩm
                </Button>
            </Dropdown>
        </>
    );
}
export default CategoriesDropDown;
