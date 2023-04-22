import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
const LoginPromptNotification = () => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <button className={"btn-primary w-100"} onClick={showModal}>
        Thanh toán
      </button>
      <Modal
        open={open}
        title=""
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
        //   <Button key="back" onClick={handleCancel}>
        //     Return
        //   </Button>,
        //   <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
        //     Submit
        //   </Button>,
        //   <Button
        //     key="link"
        //     href="https://google.com"
        //     type="primary"
        //     loading={loading}
        //     onClick={handleOk}
        //   >
        //     Search on Google
        //   </Button>,
        ]}
      >
        <div>
            <div className='notification_buy'>
                <h2><i class="fa fa-exclamation-circle"></i> Đăng nhập để tiếp tục mua sắm</h2>
                <div className='img'>
                <img src="./images/shopping.png" alt="#" />
                </div>
                
                <div className='notification_btn'>
                <Button onClick={() => {navigate('/login')}}>đăng nhập</Button>
                <Button onClick={handleCancel}>Hủy bỏ</Button>
                </div>
               
            </div>
           <div className='notification_sign_up_buy'>
            <h4>Bạn chưa có tài khoản? 
           
            {/* <Button type="link"  href="#">Đăng ký tài khoản</Button> */}
           </h4> 
           <Link to='/signUp'>Đăng ký </Link>
           </div>
        </div>
        {/* <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p> */}
      </Modal>
    </>
  );
};
export default  LoginPromptNotification;