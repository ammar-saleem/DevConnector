import React, { useEffect, Fragment, useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getProfile, deleteAccount } from '../../actions/profile';
import { DashboardActions } from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({
  getProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const [modalIsOpen, setModelIsOpen] = useState(false);

  Modal.setAppElement('#root');

  const closeModalYes = () => {
    deleteAccount();
    setModelIsOpen(false);
  };
  const closeModal = () => {
    setModelIsOpen(false);
  };

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
          <div className='my-2'>
            <button
              className='btn btn-danger'
              onClick={() => setModelIsOpen(true)}
            >
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
          <div className='my-2'>
            <button
              className='btn btn-danger'
              onClick={() => setModelIsOpen(true)}
            >
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className='modal'
        closeTimeoutMS={200}
        contentLabel='Confirm Delete Account'
      >
        <h3 className='modal__title'>Are you sure about this?</h3>
        <button className='btn btn-light my-1' onClick={closeModalYes}>
          <i className='fas fa-check'></i> Yes
        </button>
        <button onClick={closeModal} className='btn btn-light my-1'>
          <i className='fas fa-times'></i> No
        </button>
      </Modal>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfile, deleteAccount })(
  Dashboard
);
