import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_PROFILE_BY_ID,
  CLEAR_PROFILE_BY_ID,
} from '../actions/constants';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  errors: {},
  profilebyid: {},
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_PROFILE_BY_ID:
      return {
        ...state,
        profilebyid: payload,
        loading: false,
      };

    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        errors: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: [],
        loading: false,
      };
    case CLEAR_PROFILE_BY_ID:
      return {
        ...state,
        profilebyid: null,
        repos: [],
        loading: false,
      };
    default:
      return state;
  }
};
