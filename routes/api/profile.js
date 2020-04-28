const express = require('express');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const Profile = require('../../models/profile');
const User = require('../../models/User');
const Post = require('../../models/post');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).send({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).end('Server Error');
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};

    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.send({ profile });
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    console.log(profiles);
    res.json(profiles);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).send({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (e) {
    console.error(e);
    if (e.value.length !== 24) {
      return res.status(400).send({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.send({ msg: 'User Deleted!' });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const Experience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(Experience);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const expIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(expIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const Education = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(Education);
      await profile.save();
      res.json(profile);
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const eduIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(eduIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) throw error;
      if (response.statusCode !== 200) {
        return res.status(404).send({ msg: 'No GitHub profile found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
