import { AUTH, CLEAN, ERROR } from '../constants/actionTypes'
import * as api from '../api/index.js'

export const signin = (formData, history) => async (dispatch) => {
    try {
        const {data} = await api.signIn(formData)
        dispatch({type: AUTH, data})
        dispatch({type: CLEAN, action: null})
        const userId = data.result._id
        history.push(`/home/${userId}`)
    } catch (error) {
        const message = error.response.data.message
        dispatch({type: ERROR, message})
    }
}

export const signup = (formData, history) => async (dispatch) => {
    try {
        const {data} = await api.signUp(formData)
        dispatch({type: AUTH, data})
        dispatch({type: CLEAN, action: null})
        const userId = data.result._id
        history.push(`/home/${userId}`)
    } catch (error) {
        const message = error.response.data.message
        dispatch({type: ERROR, message})
    }
}