import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useDispatch, useSelector } from 'react-redux';
import { INIT, LOGIN } from '../../redux/actions/AuthAction';
import { useState, useContext } from 'react';
import axios from '../../services/axios';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { mergeAnnonCart } from '../../services/cartService';
import { GOOGLE_AUTH_URL } from '../../constants/index';
import './login.css'
import Loading from '../../common/Loading/Loading';
const LoginPage = () => {
    const theme = createTheme();
    const navigate = useNavigate();
    const [searchParams, setSearchParam] = useSearchParams();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const error = useLocation();
    const [formLogin, setFormLogin] = useState({
        userName: '',
        password: '',
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };
    const [formError, setFormError] = useState('');
    const handleLogin = async () => {
        dispatch({
            type:'OPEN_LOADING'
        })
        const response_login = await axios
            .post(process.env.REACT_APP_URL + 'un/login', formLogin)
            .catch((error) => {
                const err = error.response;
                setFormError(err.data.error);
            });
        const { error, access_token } = response_login.data;

        if (response_login.data && error) {
            return alert(error);
        }
        const role = response_login.data.roles[0].authority;

        const response = await axios.get(
            process.env.REACT_APP_URL + 'user/info',
        );
        const fullName = response.data.full_name;
        dispatch({
            type: LOGIN,
            payload: {
                isAuthenticated: true,
                fullName,
                role: role,
                accessToken: access_token,
            },
        });
        dispatch(mergeAnnonCart());
        setTimeout(()=>{ 
            dispatch({
            type:'CLOSE_LOADING'
        })},1500)
        navigate('/');
    };
    const handleChangePassword = (e) => {
        setFormLogin((pre) => {
            return {
                ...pre,
                password: e.target.value,
            };
        });
    };
    const handleChangeUsername = (e) => {
        setFormLogin((pre) => {
            return {
                ...pre,
                userName: e.target.value,
            };
        });
    };
    return (
        <ThemeProvider theme={theme}>
            <Grid  className='container_login' >
                <Grid className='background_login' container component="main">
                <CssBaseline />
                {/* <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage:
                            'url(https://source.unsplash.com/random)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light'
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                /> */}
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={3.5}
                    component={Paper}
                    elevation={6}
                    square
                    className='box_login'
                >
                    <Box
                        sx={{
                            my: 6,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              
            </Avatar> */}
                        <Typography component="h1" variant="h5" style={{color:'#137bc7', fontWeight:600}}>
                            Đăng nhập
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 1 }}
                        >
                            <TextField
                                value={formLogin.username}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Username"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                helperText={formError}
                                onChange={(e, v) => {
                                    handleChangeUsername(e);
                                }}
                            />
                            <TextField
                                value={formLogin.password}
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                helperText={formError}
                                autoComplete="current-password"
                                onChange={(e, v) => {
                                    handleChangePassword(e);
                                }}
                            />
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            /> */}
                            <Button
                                // type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 1 }}
                                onClick={() => {
                                    handleLogin();
                                }}
                            >
                                Đăng nhập
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1, mb: 1 }}
                                color="error"
                                href={GOOGLE_AUTH_URL}
                            >
                                <GoogleIcon></GoogleIcon>
                                Đăng nhập với google
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
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Quên Mật khẩu?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        {"Chưa có tài khoản? Đăng kí"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                </Grid>
              
                
            </Grid>
            <Loading/>
        </ThemeProvider>
    );
};
export default LoginPage;
