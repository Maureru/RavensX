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
} = Cookies.get("activeChat") ? JSON.parse(Cookies.get("activeChat") as string) : {
    otherUserId: '',
    otherUserName: '',
    otherUserImage: '',
    otherUserAge: null,
    otherUserUsername: '',
    otherUserEmail: '',
    otherUserIsOnline: false
}

const activeChats = createSlice({
    name: 'activeChat',
    initialState,
    reducers: {
        activeChat: (_, action) => {
            Cookies.set("activeChat", JSON.stringify(action.payload))
            return {...action.payload}
        },
        removeActiveChat: () => {
            Cookies.remove("activeChat")
            return {...initialState}
        }
    }
})

export const {
    activeChat,
    removeActiveChat
} = activeChats.actions

export default activeChats.reducer