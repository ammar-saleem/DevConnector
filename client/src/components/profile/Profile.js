import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileGithub from './ProfileGithub';
import ProfileEducation from './ProfileEducation';
import { getProfileById } from '../../actions/profile';
import { Link } from 'react-router-dom';

const Profile = ({
  getProfileById,
  match,
  profile: { profilebyid, loading },
  auth,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  return (
    <Fragment>
      {profilebyid === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            !auth.loading &&
            auth.user._id === profilebyid.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profilebyid} />
            <ProfileAbout profile={profilebyid} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profilebyid.experience.length > 0 ? (
                <Fragment>
                  {profilebyid.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No Experience Credentials</h4>
              )}
            </div>

            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profilebyid.education.length > 0 ? (
                <Fragment>
                  {profilebyid.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </Fragment>
              ) : (
                <h4>No Education Credentials</h4>
              )}
            </div>
            {profilebyid.githubusername && (
              <ProfileGithub username={profilebyid.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);
