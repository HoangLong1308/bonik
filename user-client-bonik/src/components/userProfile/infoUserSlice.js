import { produce } from "immer";
const initialState = {
    infoUser: null
}
export const infoUserReducer = (state = initialState ,{type, payload}) =>{
    return produce(state, draft=>{
        switch (type) {
            case "GET_INFO_USER":
                draft.infoUser = payload
                break;
            default:
                break;
        }
    })
}
