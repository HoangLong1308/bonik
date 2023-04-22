
import axios from "axios";
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
//--------------------SIGN UP------------
export const signUp =  (value,navigate) => async (dispatch) => {
    delete value.confirmPassword
    try{
        dispatch({
            type:'OPEN_LOADING'
        })
        await axios.post(process.env.REACT_APP_URL + 'un/register',value)
        await setTimeout(()=>{
            dispatch({
                type:'CLOSE_LOADING'
            })
            dispatch({
                type:'INFO_SIGN_UP',
                payload: value
            });
            navigate(`/signUp/Verification/${value.username}`)
        },1500)
      
        Toast.fire({
            icon: 'success',
            title: `
            đăng kí thành công !`
        });
   
    }catch(err){
        console.log(err);
        dispatch({
            type:'CLOSE_LOADING'
        })
        setTimeout(()=>{
            Toast.fire({
                icon: 'error',
                title: `Đăng kí thất bại !`
            }) 
        },500)
       
    }
}
//------------------RESEND OTP---------------
export const postResendOtp = (value)=> async (dispatch)=>{
    try{
        await axios.post(process.env.REACT_APP_URL + `un/resend-otp/${value}`)
        Toast.fire({
            icon: 'success',
            title: `Gửi mã OTP thành công !`
        });
    }catch(err){
        console.log(err);
        Toast.fire({
            icon: 'error',
            title: `Gửi mã OTP thất bại !`
        });
    }
}
//------------- verification-----------------------
export const postVerification = ( value , navigate) => async  (dispatch)=>{
    try{
        dispatch({
            type:'OPEN_LOADING'
        })
        await axios.post(process.env.REACT_APP_URL + `un/verification-otp/${value.username}/${value.code}`)
        Toast.fire({
            icon: 'success',
            title: `xát thực thành công !`
        });
        await setTimeout(()=>{
            dispatch({
                type:'CLOSE_LOADING'
            })
            navigate('/login')
        },1500)
       
    }catch(err){
        console.log(err);
        Toast.fire({
            icon: 'success',
            title: `xát thực thất bại !`
        });
        dispatch({
            type:'CLOSE_LOADING'
        })
    }
}