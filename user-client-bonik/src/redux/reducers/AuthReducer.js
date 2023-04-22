import { LOGIN, INIT, LOGOUT } from '../actions/AuthAction';
const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    fullName: null,
    role: 'na',
    accessToken: '',
};

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case INIT:
            const { isAuthenticated, role } = action.payload;
            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                role,
            };

        case LOGIN: {
            const { isAuthenticated, fullName, accessToken } = action.payload;
            // console.log(action.payload);
            return {
                ...state,
                isAuthenticated,
                fullName,
                accessToken: accessToken,
                isInitialised: true,
            };
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                fullName: null,
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default AuthReducer;
