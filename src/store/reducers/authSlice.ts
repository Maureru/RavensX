import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"


const initialState : {
    _id: string,
    name: string,
    email: string,
    image: string,
    age: number | null,
    username: string,
    isOnline: boolean
} = Cookies.get("auth") ? JSON.parse(Cookies.get('auth') as string) : {
    _id: '',
    name: '',
    email: '',
    image: '',
    age: null,
    username: '',
    isOnline: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login_user: (state, action) => {
            Cookies.set("auth", JSON.stringify(action.payload.user))
            Cookies.set("accessToken", action.payload.token, {expires: 1})
            
            return {...action.payload.user}
        },
        logout_user: () => {
            Cookies.remove("auth")
            Cookies.remove("accessToken")
            return {...initialState}
    }
    },

})

export const {
    login_user,
    logout_user
} = authSlice.actions

export default authSlice.reducer