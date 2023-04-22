import React, {useRef} from 'react';
import './contact.css';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
const Contact = () => {
    const formRef = useRef(null);
    const vailidationConact = Yup.object().shape({
        email: Yup.string()
            .email('email không đúng định dạng')
            .required('vui lòng nhập email của bạn'),
        name: Yup.string().required('vui lòng nhập tên của bạn'),
        phone: Yup.string().required('vui lòng nhập số điện thoại của bạn'),
        content: Yup.string().required('* vui lòng nhập nội dung'),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            content: '',
        },
        validationSchema: vailidationConact,
        onSubmit: (values) => {
            formRef.current.reset();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'gửi thông tin liên hệ thành công',
                showConfirmButton: false,
                timer: 1500,
                
            });
        },
    });
    return (
        <div className='contact'>
            <div className="banner_contact">
                <div className="banner_contact_content">
                    <h2>
                        Hãy để đội ngũ tư vấn của Bonik hỗ trợ bạn dù bạn ở bất
                        kì đâu
                    </h2>
                </div>
            </div>
            <div className="container_contact">
                <div className="form_contact">
                    <form onSubmit={formik.handleSubmit} ref={formRef}>
                        <h2>Liên hệ với chúng tôi</h2>
                        <input
                            type="name"
                            required
                            placeholder="Họ và tên"
                            name="name"
                            onChange={formik.handleChange}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <span style={{ color: 'red', fontSize: 16 }}>
                                {formik.errors.name}
                            </span>
                        )}
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            name="email"
                            onChange={formik.handleChange}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <span style={{ color: 'red', fontSize: 16 }}>
                                {formik.errors.email}
                            </span>
                        )}
                        <input
                            type="number"
                            required
                            placeholder="Số điện thoại"
                            name="phone"
                            onChange={formik.handleChange}
                        />
                        {formik.errors.phone && formik.touched.phone && (
                            <span style={{ color: 'red', fontSize: 16 }}>
                                {formik.errors.phone}
                            </span>
                        )}
                        <textarea
                            placeholder="Nội dung"
                            name="content"
                            onChange={formik.handleChange}
                        />
                        {formik.errors.content && formik.touched.content && (
                            <span style={{ color: 'red', fontSize: 16 }}>
                                {formik.errors.content}
                            </span>
                        )}
                        <button type="submit">Gửi liên hệ</button>
                    </form>
                </div>
                <div className="map_contact">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1573430794515!2d106.64051817594971!3d10.7992585587703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294e5cb39f19%3A0xbedaa746967d3b1f!2zMzIwLzEyIFRyxrDhu51uZyBDaGluaCwgUGjGsOG7nW5nIDEzLCBUw6JuIELDrG5oLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1681571036869!5m2!1sen!2s"
                        width="720"
                        height="450"
                        style={{ border: 0, borderRadius: 10 }}
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
            <div className="icon_contact">
                <h2>Tổng đài tư vấn và hổ trợ trực tuyến</h2>
                <div className="content">
                    <ul>
                        <li>
                            <i class="fa fa-envelope"></i>
                            <a href="mailto:bonkik@gmail.com">Email</a>
                        </li>
                        <li>
                            <i class="fa fa-phone-volume"></i>
                            <a href="tel: +841123 456 780">Tổng đài bonik</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Contact;
