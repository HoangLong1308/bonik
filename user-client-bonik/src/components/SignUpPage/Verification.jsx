import React, { useEffect, useState } from 'react';
import  './signUp.css';
import { SecurityScanOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { postResendOtp, postVerification } from './thunk';
import Loading from '../../common/Loading/Loading';
const Verification = () => {
    const { infoSignUP } = useSelector((state) => state.userReducer);
    const [valueBtn, setValueBtn] = useState(true);
    const dispatch = useDispatch();
    const [time, setTime] = useState(60);
    const [OTP, setOTP] = useState(null);
    const { userName } = useParams();
    const [errValue, setErrValue] = useState(false);
    const Navigate = useNavigate();
    const handleButton = () => {
        dispatch(postResendOtp(userName));
        setValueBtn(false);
        const myTime = setInterval(() => {
            setTime((time) => time - 1);
        }, 1000);
        setTimeout(() => {
            setValueBtn(true);
            clearInterval(myTime);
            setTime(60);
        }, 60000);
    };
    const onChangeInput = (e) => {
        const { value } = e.target;
        setOTP(value);
        if (value.length > 4) {
            setErrValue(true);
        } else {
            setErrValue(false);
        }
    };
    const handleVerification = () => {
        const value = {
            username: userName,
            code: OTP,
        };
        dispatch(postVerification(value, Navigate));
    };
    return (
        <div className='container_signUp'>
            <div className='background_signUp'>
            <div className='Verification_form_signUp'>
                <form>
                    <div className='content_signUp'>
                        <h2>Xác minh</h2>
                        <div className='security_signUp'>
                            <SecurityScanOutlined
                                style={{ fontSize: 40, color: '#064f99' }}
                            />
                            <input
                                placeholder="Mã xác minh gồm 4 số"
                                type="Number"
                                onChange={(e) => {
                                    onChangeInput(e);
                                }}
                            />
                        </div>
                        {errValue ? (
                            <h2>* Mã OTP không quá 4 Số </h2>
                        ) : (
                            <h2></h2>
                        )}

                        <p>
                            Mã OTP đã gửi{' '}
                            <span style={{ fontWeight: 600 }}>
                                {infoSignUP?.email}
                            </span>{' '}
                            của bạn vui lòng kiểm tha thư của bạn !
                        </p>

                        <div className='box_button_signUp'>
                            {valueBtn ? (
                                <p></p>
                            ) : (
                                <p>
                                    Vui lòng đợi{' '}
                                    <span style={{ color: 'red' }}>
                                        {time}s
                                    </span>{' '}
                                    để bấm gửi lại !
                                </p>
                            )}
                            <div className='btn_signUp'>
                                {valueBtn ? (
                                    <button
                                        className='first_signUp'
                                        onClick={() => {
                                            handleButton();
                                        }}
                                    >
                                        {' '}
                                        Gửi lại{' '}
                                    </button>
                                ) : (
                                    <button
                                        className='second_signUp'
                                        disabled={true}
                                    >
                                        Gửi lại{' '}
                                    </button>
                                )}
                                {errValue ? (
                                    <button
                                        disabled={true}
                                        className='last_xm_signUp'
                                    >
                                        Xác Minh
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className='first_xm_signUp'
                                        onClick={() => {
                                            handleVerification();
                                        }}
                                    >
                                        Xác Minh
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            </div>
            <div className="test_signUp">
                <Loading/>
            </div>
        </div>
    );
};

export default Verification;
