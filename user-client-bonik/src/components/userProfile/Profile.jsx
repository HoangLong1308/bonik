import PersonalInfo from './personal/PersonalInfo';
import React, { memo } from 'react';
import { Tabs } from 'antd';
import Photo from './personal/Avatar';
import MyPurchase from './myPurchase/MyPurchase';
import ChangePassword from './personal/ChangePassword';
import FavoriteProduct from './personal/FavoriteProduct';
import Address from './personal/Address';
import { useLocation } from 'react-router-dom';
import './Profile.css';
import { useSelector } from 'react-redux';
const Profile = () => {
    // const dispatch = useDispatch();
    // useEffect(()=>{
    //   dispatch(fetchInfoUer)
    // },[dispatch])
    const {infoUser} = useSelector (state => state.infoUserReducer)
    const location = useLocation();
    let profileId = '2';
    if (location.state) {
        profileId = location.state.profileId;
    }

    // alert(profileId);
    const items = [
        {
            key: '1',
            label: (
                <div>
                    <div>
                        <div >
                            <Photo />
                            <div className='Profile_name'>{infoUser?.full_name}</div>
                        </div>
                    </div>
                </div>
            ),
            disabled: true,
        },
        {
            key: '2',
            label: 'Thông tin cá nhân',
            children: <PersonalInfo />,
        },
        {
            key: '3',
            label: 'Đơn mua',
            children: <MyPurchase />,
        },
        {
            key: '4',
            label: 'Địa chỉ',
            children: <Address />,
        },
        {
            key: '5',
            label: 'Yêu thích',
            children: <FavoriteProduct />,
        },
        // {
        //     key: '6',
        //     label: 'Đổi mật khẩu',
        //     children: <ChangePassword />,
        // },
    ];
    return (
        <>
            <Tabs
                className='profile-tabs'
                defaultActiveKey={!profileId ? '2' : profileId}
                tabPosition="left"
                items={items}
            />
        </>
    );
};
export default memo(Profile);
