import { produce } from 'immer';
const initialState = {
    infoSignUP: null,
};

export const userReducer = (state = initialState, { type, payload }) => {
    return produce(state, (draft) => {
        switch (type) {
            case 'INFO_SIGN_UP':
                draft.infoSignUP = payload;
                break;

            default:
                break;
        }
    });
}