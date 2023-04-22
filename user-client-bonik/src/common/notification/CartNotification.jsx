import { ShoppingCartOutlined, CloseCircleFilled } from '@ant-design/icons';
import { Button, notification, ConfigProvider } from 'antd';
import './cart-style.css';
import { useEffect } from 'react';

export const CartNotification_TYPE = {
    SUCCESS: Symbol('SUCCESS'),
    ERROR: Symbol('ERROR'),
};

const CartNotification = ({ type, title, message, placement, handleClick, isButtonDisabled, isSuccess, setSuccessNull }) => {
    // console.log('inside notif');
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        // console.log('child useEffect');
        // console.log('isSucces => ', isSuccess);
        if (isSuccess == null) {
        } else showNotif();
    }, [isSuccess]);
    const open = () => {
        // console.log('call open api');
        let icon = isSuccess ? (
            <ShoppingCartOutlined
                style={{
                    color: '#7AA874',
                }}
            />
        ) : (
            <CloseCircleFilled
                style={{
                    color: '#FFA07A',
                }}
            />
        );
        return api.open({
            message: title,
            description: (
                <div>
                    <p>{message}</p>
                    <a href="/cart"> Xem giỏ hàng</a>
                </div>
            ),
            icon: icon,
            duration: 3,
        });
    };

    const openNotification = (type) => {
        try {
            if (isButtonDisabled) return;
            // console.log('called notif');
            handleClick(open);
            // successAddedNotifContent();

            // console.log(message);
        } catch {}
        // console.log('message: ', message);
    };
    const showNotif = () => {
        open();
        setSuccessNull();
        return;
    };
    const buttonContent = 'Thêm vào giỏ hàng!';
    const buttonToCart = () => {
        return <Button>Xem giỏ hàng</Button>;
    };
    return (
        <>
            {contextHolder}
            {isButtonDisabled && <></>}
            {!isButtonDisabled && (
                <button
                    disabled={isButtonDisabled}
                    class={`add-cart-btn hvr-sweep-to-right`}
                    onClick={openNotification}
                >
                    {buttonContent}
                </button>
            )}
        </>
    );
};
export default CartNotification;
