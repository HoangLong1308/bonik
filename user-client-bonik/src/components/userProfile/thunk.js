import axios from "axios";
// import { https } from "../../services/config";

export const fetchInfoUer = async (dispatch) =>{
    try{
        const res = await axios.get(process.env.REACT_APP_URL + 'user/info')
        dispatch({
            type:"GET_INFO_USER",
            payload: res.data
        })
    }catch(err){
        console.log(err);
    }
}