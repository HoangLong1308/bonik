import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useFormik } from 'formik';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { signUp } from './thunk';
import { useNavigate } from 'react-router-dom';
import { signUpSchema } from './signUpSchema';
import './signUp.css';
import Loading from '../../common/Loading/Loading';
import { GOOGLE_AUTH_URL } from '../../constants/index';
function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: '',
            phone: '',
            full_name: '',
            confirmPassword: '',
        },
        validationSchema: signUpSchema,
        onSubmit: async (values) => {
            // console.log(values);
            await dispatch(signUp(values, navigate));
        },
    });
    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   const data = new FormData(event.currentTarget);
    //   console.log({
    //     email: data.get('email'),
    //     password: data.get('password'),
    //   });
    // };

    return (
        <ThemeProvider theme={theme}>
            <div className="container_signUp">
                <div className="background_signUp">
                    <Container
                        component="main"
                        maxWidth="xs"
                        className="form_signUp"
                    >
                        <CssBaseline />
                        <Box
                            sx={{
                                paddingTop: 5,
                                paddingBottom: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography
                                component="h1"
                                variant="h5"
                                style={{
                                    fontSize: 25,
                                    fontWeight: 600,
                                    color: '#137bc7',
                                }}
                            >
                                Đăng kí
                            </Typography>
                            <Box
                                className="box_signUp"
                                component="form"
                                noValidate
                                onSubmit={formik.handleSubmit}
                                sx={{ mt: 3 }}
                            >
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 1, mb: 1 }}
                                    color="error"
                                    href={GOOGLE_AUTH_URL}
                                >
                                    <GoogleIcon
                                        style={{ marginRight: 10 }}
                                    ></GoogleIcon>
                                    Đăng kí với google
                                </Button>
                                <div className="google_guide_container_signUp">
                                    <div className="hr_left_signUp"></div>
                                    <p className="guide_google_signUp">
                                        Hoặc đăng ký với email
                                    </p>
                                    <div className="hr_right_signUp"></div>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="full_name"
                                            required
                                            fullWidth
                                            id="full_name"
                                            label="Họ Và Tên"
                                            autoFocus
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.errors.full_name &&
                                            formik.touched.full_name && (
                                                <span style={{ color: 'red' }}>
                                                    {formik.errors.full_name}
                                                </span>
                                            )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="Username"
                                            label="Tên Tài Khoản"
                                            name="username"
                                            autoComplete="Username"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                           {formik.errors.username &&
                                            formik.touched.username && (
                                                <span style={{ color: 'red' }}>
                                                    {formik.errors.username}
                                                </span>
                                            )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Địa chỉ Email"
                                            name="email"
                                            autoComplete="email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                           {formik.errors.email &&
                                            formik.touched.email && (
                                                <span style={{ color: 'red' }}>
                                                    {formik.errors.email}
                                                </span>
                                            )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="phone"
                                            label="Số Điện Thoại"
                                            // type="number"
                                            id="phoneNumber"
                                            autoComplete="new-password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                           {formik.errors.phone &&
                                            formik.touched.phone && (
                                                <span style={{ color: 'red' }}>
                                                    {formik.errors.phone}
                                                </span>
                                            )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Mật Khẩu"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                           {formik.errors.password &&
                                            formik.touched.password && (
                                                <span style={{ color: 'red' }}>
                                                    {formik.errors.password}
                                                </span>
                                            )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirmPassword"
                                            label="Xác nhận mật khẩu"
                                            type="password"
                                            id="confirmPassword"
                                            autoComplete="confirmPassword"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}  
                                        />
                                           {formik.errors.confirmPassword &&
                                            formik.touched.confirmPassword && (
                                                <span style={{ color: 'red' }}>
                                                    {formik.errors.confirmPassword}
                                                </span>
                                            )}
                                    </Grid>

                                    {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Đăng kí
                                </Button>

                                {/* <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                color="primary"
              >
                <FacebookIcon></FacebookIcon>
                Đăng nhập với facebook
              </Button> */}
                                <Grid
                                    container
                                    justifyContent="flex-end"
                                    className="signIn_signUp"
                                >
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            Bạn đã tạo tài khoản rồi?{' '}
                                            <span> Đăng Nhập</span>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                        {/* <Copyright sx={{ mt: 5 }} /> */}
                    </Container>
                </div>
            </div>
            <div className="test_signUp">
                <Loading />
            </div>
        </ThemeProvider>
    );
}
