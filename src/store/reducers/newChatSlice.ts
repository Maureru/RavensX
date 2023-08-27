import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

const initialState : {
    otherUserId: string,
    otherUserName: string,
    otherUserImage: string,
    otherUserAge: number | null,
    otherUserUsername: string,
    otherUserEmail: string,
    otherUserIsOnline: boolean
} = Cookies.get("newChat") ? JSON.parse(Cookies.get("newChat") as string) : {
    otherUserId: '',
    otherUserName: '',
    otherUserImage: '',
    otherUserAge: null,
    otherUserUsername: '',
    otherUserEmail: '',
    otherUserIsOnline: false
}

const newChatSlice = createSlice({
    name: 'newChat',
    initialState,
    reducers: {
        newChat: (_, action) => {
            Cookies.set("newChat", JSON.stringify(action.payload))
            return {...action.payload}
        },
        removeNewChat: () => {
            Cookies.remove("newChat")
            return {...initialState}
        }
    }
})

export const {
    newChat,
    removeNewChat
} = newChatSlice.actions

export default newChatSlice.reducer