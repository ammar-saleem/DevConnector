import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { deleteAccount } from '../../actions/profile';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export const OpenModal = ({ deleteAccount, isOpen }) => {
  const [modalIsOpen, setModelIsOpen] = useState(isOpen);

  const closeModalYes = () => {
    deleteAccount();
    setModelIsOpen(false);
  };
  const closeModal = () => {
    setModelIsOpen(false);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel='Confirm Delete Account'
    >
      <h3>Are you sure about this? This can not be undone!</h3>
      <button onClick={closeModalYes}>Yes</button>
      <button onClick={closeModal}>No</button>
    </Modal>
  );
};

OpenModal.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
};

export default connect(null, { deleteAccount })(OpenModal);
