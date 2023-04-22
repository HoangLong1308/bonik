import * as yub from 'yup';
const  regexPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
export const signUpSchema = yub.object().shape({
    email: yub
    .string()
    .email('Email không hợp lệ')
    .required('* Vui lòng nhập email của bạn !'),
    full_name: yub
    .string()
    .required('* Vui lòng nhập tên của bạn !'),
    phone: yub 
    .string()
    .matches(regexPhone,'* Số điện thoại không hợp lệ')
    .required('* Vui lòng nhập Số điện thoại của bạn !'),
    username: yub
    .string()
    .required('* Vui lòng nhập Tên tài khoản'),
    password: yub
    .string()
    .required('* vui lòng nhập mật khẩu'),
    confirmPassword: yub
    .string()
    .required('* vui lòng nhập mật khẩu')
    .oneOf([yub.ref('password'), null],'* Mật Khẩu không giống nhau')


})