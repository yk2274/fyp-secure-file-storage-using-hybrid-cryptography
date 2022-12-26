import { ERROR, CLEAN } from '../constants/actionTypes'

export default (error = null, action) => {
    switch (action.type) {
      case ERROR:
        return action.message
      case CLEAN:
        return null
      default:
        return error;
    }
  };
  