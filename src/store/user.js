import * as firebase from 'firebase';
import { User } from './essentials';

export default {
  namespaced: true,
  state: {
    allUsers: [],
    currentUser: null,
  },
  mutations: {
    setCurrentUser(state, payload) {
      state.currentUser = payload;
    },
    getAllUsers(state, payload) {
      state.allUsers = payload;
    },
  },

  actions: {
    // helper function to 'update user'. Changed email of current user
    async changeEmail({ commit, dispatch, state }, payload) {
      if (!payload) return;
      dispatch('shared/clearError', false, { root: true });

      const currentUser = state.currentUser;
      currentUser.email = payload;

      try {
        await firebase.auth().currentUser.updateEmail(payload);

        await firebase
          .database()
          .ref(`/users/${state.currentUser.id}/personal/email`)
          .set(payload);

        commit('setCurrentUser', currentUser);
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // helper function to 'update user'. Changed name of current user
    async changeName({ commit, dispatch, state }, payload) {
      if (!payload) return;
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });
      try {
        await firebase
          .database()
          .ref(`/users/${state.currentUser.id}/personal/name`)
          .set(payload);

        const currentUser = state.currentUser;
        currentUser.name = payload;

        commit('setCurrentUser', currentUser);
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // helper function to 'update user'. Changed password of current user
    async changePassword({ dispatch }, payload) {
      if (!payload) return;
      dispatch('shared/clearError', null, { root: true });

      try {
        await firebase.auth().currentUser.updatePassword(payload);
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // check authenticate for current user (for to the important actions)
    async checkAuthenticate({ dispatch }, payload) {
      dispatch('shared/clearError', null, { root: true });

      const user = await firebase.auth().currentUser;
      const credential = await firebase.auth.EmailAuthProvider.credential(
        user.email,
        payload
      );

      try {
        await user.reauthenticateWithCredential(credential);
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // delete current user from state and firebase
    async deleteCurrentUser({ commit, dispatch, rootGetters, state }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      let ads = rootGetters['ads/myAds'];

      try {
        //delete ads
        if (ads) {
          for (const ad of ads) {
            let imageSrc = ad.imageSrc;
            let adId = ad.id;
            dispatch('ads/deleteAd', { adId, imageSrc }, { root: true });
          }
        }

        //delete user from firebase
        await firebase.auth().currentUser.delete();

        //delete user from database
        const currentUserId = state.currentUser.id;

        await firebase
          .database()
          .ref('users')
          .child(currentUserId)
          .remove();

        //delete user from state
        commit('setCurrentUser', null);

        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // fetch all users data from firebase (database)
    async fetchAllUsers({ commit, dispatch }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      let databaseUsersResult = [];

      try {
        // fetch all users data from firebase (database)
        const databaseUsersValue = await firebase
          .database()
          .ref('users')
          .once('value');
        const databaseUsersObject = databaseUsersValue.val();

        Object.keys(databaseUsersObject).forEach((key) => {
          const user = databaseUsersObject[key].personal;
          databaseUsersResult.push(
            new User({ email: (user.email = ''), id: key, name: user.name })
          );
        });

        // add all users to state
        commit('getAllUsers', databaseUsersResult);
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // fetch current user data from firebase (database)
    async fetchCurrentUser({ commit, dispatch, state }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      try {
        // get current user data in database
        const databaseUserValue = await firebase
          .database()
          .ref(`/users/${state.currentUser.id}/personal`)
          .once('value');
        const databasePersonalName = databaseUserValue.val().name;

        const currentUser = state.currentUser;
        currentUser.name = databasePersonalName;

        // set current user data to state
        commit('setCurrentUser', currentUser);
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // login user
    async loginUser({ commit, dispatch }, { email, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      try {
        // authentication user in firebase
        let user = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);

        // get user data in firebase (database)
        const databaseUserValue = await firebase
          .database()
          .ref(`/users/${user.user.uid}/personal`)
          .once('value');
        const databasePersonalName = databaseUserValue.val().name;

        // set user in state
        commit(
          'setCurrentUser',
          new User({
            email: user.user.email,
            id: user.user.uid,
            name: databasePersonalName,
          })
        );

        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // logout the current user
    async logoutUser({ commit }) {
      await firebase.auth().signOut();
      commit('setCurrentUser', null);
    },

    // register new user in firebase and state
    async registerUser({ commit, dispatch }, { email, name, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      try {
        // register new user in firebase
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);

        // add new user in state
        commit(
          'setCurrentUser',
          new User({
            email: user.user.email,
            id: user.user.uid,
            name: name,
          })
        );

        // add new user in firebase (database)
        await firebase
          .database()
          .ref(`/users/${user.user.uid}/personal`)
          .set({ name: name, email: email });

        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // update the current user after editing
    async updateUser({ dispatch }, { name, email, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });
      try {
        // change name of current user
        await dispatch('changeName', name);

        // change email of current user
        await dispatch('changeEmail', email);

        // change password of current user
        await dispatch('changePassword', password);

        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/decreaseLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    // auto login after reload page.
    autoLoginUser({ commit }, payload) {
      commit(
        'setCurrentUser',
        new User({
          email: payload.email,
          id: payload.uid,
          name: payload.name,
        })
      );
    },
  },

  getters: {
    // check on login user
    isUserLoggedIn(state) {
      return state.currentUser !== null;
    },

    // return user by id
    userById(state) {
      return function(userId) {
        return state.allUsers.find((user) => {
          return user.id === userId;
        });
      };
    },
  },
};
