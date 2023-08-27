import { createSlice } from "@reduxjs/toolkit"

const initial_state: {
    message: string,
    type: string,
    open: boolean
} = {
    message: '',
    type: "",
    open: false
}

export const toast_slice = createSlice({
    name: 'toast',
    initialState: initial_state,
    reducers: {
        setToastTrue: (state, action) => {
            state.open = true,
            state.type = action.type,
            state.message = action.payload
        },
        setToastFalse: (state) => {
            state.open = false,
            state.type = '',
            state.message = ''
        }
    }
})

export const {
    setToastTrue,
    setToastFalse
} = toast_slice.actions

export default toast_slice.reducer