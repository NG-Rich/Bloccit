# Invade The Rift

* [Introduction](#introduction)
* [Setup](#setup)
* [Testing](#testing)
* [Usage](#usage)

### Introduction
A simple Reddit-like clone in which users can submit posts on topics, comments, favorite posts, and up/down vote comments!

### Setup
Setup is simple since you just need to run `npm start` and the app is up and running!

### Testing
I've made test specs if you wish to run tests on the app features.  
1. `static_spec.js` which tests the landing page.
2. `user_spec.js` which tests behavior of account creation.
3. `users_spec.js` which tests for user resource.
4. `topics_spec.js` which tests for topic resource.
5. `topic_spec.js` which tests behavior of topic feature.
6. `posts_spec.js` which tests for post resource.
7. `post_spec.js` which tests behavior of post resource.

All can be run with `npm test spec/(spec_folder)/(test_spec_here.js)`.

### Usage
Upon booting the app, you'll be presented to the landing page in which you can sign up for an account and start making posts!
You'll also be presented with your profile on the top right corner which will list your latest posts and comments!
However, only Administrators have the ability to create topics.
