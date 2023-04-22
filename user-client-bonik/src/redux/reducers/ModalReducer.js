import { produce } from 'immer';
const initialState = {
    isLoading: false,
};

export const ModalReducer = (state = initialState, { type, payload }) => {
    return produce(state, (draft) => {
        switch (type) {
            case 'OPEN_LOADING':
                draft.isLoading = true;
                break;
            case 'CLOSE_LOADING':
                draft.isLoading = false;
                break;

            default:
                break;
        }
    });
};
