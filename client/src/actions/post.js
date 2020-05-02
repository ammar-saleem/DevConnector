import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './constants';

export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const likePosts = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/likes/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeLike = (post_id) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${post_id}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { post_id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deletePost = (post_id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/${post_id}`);
    dispatch({
      type: DELETE_POST,
      payload: post_id,
    });
    dispatch(setAlert('Post Deleted', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addPost = (body) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post('/api/posts', body, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
    dispatch(setAlert('Posted!', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const getPost = (post_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${post_id}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addComment = (comment_id, body) => async (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };
  try {
    const res = await axios.post(
      `/api/posts/comment/${comment_id}`,
      body,
      config
    );
    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });
    dispatch(setAlert('Comment Added!', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteComment = (comment_id, post_id) => async (dispatch) => {
  try {
    await axios.delete(`/api/posts/comment/${post_id}/${comment_id}`);
    dispatch({
      type: REMOVE_COMMENT,
      payload: comment_id,
    });
    dispatch(setAlert('Comment Deleted!', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
