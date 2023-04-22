import { Tabs } from 'antd';
import AllPurchase from './AllPurchase';
import ToPay from './ToPay';
import Completed from './Completed';
import Cancelled from './Cancelled';
import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import axios from '../../../services/axios';
import { BASE, ORDER_STATUS } from '../../../constants/index';
import ToReceive from './ToReceive';
const MyPurchase = () => {
    const [status, setStatus] = useState([]);
    const [tabSelected, setTabSelected] = useState(0);
    //fetch orderStatus
    useEffect(() => {
        axios({
            method: 'get',
            url: `${BASE}${ORDER_STATUS}`,
        })
            .then((res) => {
                let d = res.data;
                d.unshift({ id: 0, name: 'Tất cả', title: '' });
                setStatus(d);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const handleChangeTab = useCallback((value) => {
        setTabSelected(value);
    });
    let item;
    if (status.length != 0) {
        item = status.map(({ id, name }) => {
            if (id === 0) {
                return {
                    key: id,
                    label: name,
                    children: tabSelected == id && (
                        <AllPurchase status={tabSelected} />
                    ),
                };
            } else if (id === 1) {
                return {
                    key: id,
                    label: name,
                    children: tabSelected == id && (
                        <ToPay status={tabSelected} />
                    ),
                };
            } else if (id === 2) {
                return {
                    key: id,
                    label: name,
                    children: tabSelected == id && (
                        <ToReceive status={tabSelected} />
                    ),
                };
            } else if (id === 3) {
                return {
                    key: id,
                    label: name,
                    children: tabSelected == id && (
                        <Completed status={tabSelected} />
                    ),
                };
            } else {
                return {
                    key: id,
                    label: name,
                    children: tabSelected == id && (
                        <Cancelled status={tabSelected} />
                    ),
                };
            }
        });
    }
    return (
        <>
            {status.length != 0 && (
                <Tabs
                    style={{ padding: '20px' }}
                    centered
                    activeKey={tabSelected}
                    onChange={handleChangeTab}
                    tabPosition="top"
                    items={item}
                />
            )}
        </>
    );
};
export default memo(MyPurchase);
