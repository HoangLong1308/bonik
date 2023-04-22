import React from 'react';
import './style.css';

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container grid2">
                    <div className="box">
                        <h1>Bonik</h1>
                        <p>
                            Bonik chuyên cung cấp các sản phẩm điện tử chất
                            lượng tốt nhất đến tay người tiêu dùng. Với một kho
                            hàng lớn và đa dạng các sản phẩm, chúng tôi mong
                            muốn mang lại sự hài lòng tuyệt đối cho khách hàng
                            của mình. Hãy tìm hiểu thêm về chúng tôi và bắt đầu
                            trải nghiệm một trang web mua sắm điện tử tuyệt vời
                        </p>
                        {/* <div className="icon d_flex">
                            <div className="img d_flex">
                                <i className="fa-brands fa-google-play"></i>
                                <span>Google Play</span>
                            </div>
                            <div className="img d_flex">
                                <i className="fa-brands fa-app-store-ios"></i>
                                <span>App Store</span>
                            </div>
                        </div> */}
                    </div>

                    <div className="box">
                        <h2>Liên kết</h2>
                        <ul>
                            <li>Trang chủ</li>
                            <li>Sản phẩm nổi bật</li>
                            <li>Sản phẩm mới nhất</li>
                            <li>Hướng dẫn mua hàng</li>
                            <li>Liên hệ</li>
                        </ul>
                    </div>
                    <div className="box">
                        <h2>Điều khoản</h2>
                        <ul>
                            <li>Chính sách bảo hành </li>
                            <li>Chính sách đổi trả và hoàn tiền</li>
                            <li>Chính sách vận chuyển </li>
                            <li>Chính sách bảo mật thông tin. </li>
                        </ul>
                    </div>
                    <div className="box">
                        <h2>Thông tin liên hệ</h2>
                        <ul>
                            <li>
                                12A Trường Chinh, phường 13, Quận Tân Bình, TP
                                Hồ Chí Minh
                            </li>
                            <li>Email: bonkik@gmail.com</li>
                            <li>Phone: +(84) 1123 456 780</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
