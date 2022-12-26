import { ADD, FETCH_WHITELIST, DELETE_WHITELIST } from '../constants/actionTypes'
import * as api from '../api/index.js'

export const getWhitelist = (postId) => async (dispatch) => {
    try {
        const { data } = await api.fetchWhitelist(postId)
        dispatch({ type: FETCH_WHITELIST, payload: data})
    } catch (error) {
        console.log(error.message)
    }
}

export const checkWhitelist = (email) => async () => {
    try {
        const { data } = await api.checkWhitelist(email)
        return data
    } catch (error) {
        console.log(error.message)
    }
}

export const addWhitelist = (postId, email) => async (dispatch) => {
    try {
        
        const { data } = await api.addWhitelist(postId, email)
        dispatch({ type: ADD, payload: data})
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteWhitelist = (email, postId) => async (dispatch) => {
    try {
        await api.deleteWhitelist(email, postId)
        dispatch({ type: DELETE_WHITELIST , payload: email})
    } catch (error) {
        
    }
}