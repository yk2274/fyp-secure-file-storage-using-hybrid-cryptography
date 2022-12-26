import { ADD, DELETE_WHITELIST, FETCH_WHITELIST } from "../constants/actionTypes"

export default (emails = [], action) => {
    switch (action.type) {
      case FETCH_WHITELIST:
        return action.payload;
      case ADD:
        return [...emails, action.payload];
      case DELETE_WHITELIST: 
        return emails.filter((email) => email !== action.payload)
      default:
        return emails;
    }
  };