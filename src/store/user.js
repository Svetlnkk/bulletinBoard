import * as firebase from 'firebase';

class User {
  constructor({ id, email, name = '' }) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}

export default {
  namespaced: true,
  state: {
    currentUser: null,
    allUsers: [],
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
    async registerUser({ commit, dispatch }, { name, email, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });
      try {
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        commit(
          'setCurrentUser',
          new User({
            id: user.user.uid,
            email: user.user.email,
            name: name,
          })
        );

        await firebase
          .database()
          .ref(`/users/${user.user.uid}/personal`)
          .set({ name: name, email: email });

        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async loginUser({ commit, dispatch }, { email, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      try {
        let user = await firebase
          .auth()
          .signInWithEmailAndPassword(email, password);

        const databaseUserValue = await firebase
          .database()
          .ref(`/users/${user.user.uid}/personal`)
          .once('value');
        const databasePersonalName = databaseUserValue.val().name;

        commit(
          'setCurrentUser',
          new User({
            id: user.user.uid,
            email: user.user.email,
            name: databasePersonalName,
          })
        );
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async fetchCurrentUser({ commit, dispatch, state }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      try {
        const databaseUserValue = await firebase
          .database()
          .ref(`/users/${state.currentUser.id}/personal`)
          .once('value');
        const databasePersonalName = databaseUserValue.val().name;

        const currentUser = state.currentUser;
        currentUser.name = databasePersonalName;

        commit('setCurrentUser', currentUser);
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async fetchAllUsers({ commit, dispatch }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      let databaseUsersResult = [];

      try {
        const databaseUsersValue = await firebase
          .database()
          .ref('users')
          .once('value');
        const databaseUsersObject = databaseUsersValue.val();

        Object.keys(databaseUsersObject).forEach((key) => {
          const user = databaseUsersObject[key].personal;
          databaseUsersResult.push(
            new User({ id: key, email: (user.email = ''), name: user.name })
          );
        });
        commit('getAllUsers', databaseUsersResult);
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async updateUser({ dispatch }, { name, email, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });
      try {
        await dispatch('changeName', name);

        await dispatch('changeEmail', email);

        await dispatch('changePassword', password);

        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async changeName({ commit, dispatch, state }, payload) {
      if (!payload) return;
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });
      try {
        await firebase
          .database()
          .ref(`/users/${state.currentUser.id}/personal/name`)
          .set(payload);

        const currentUser = state.currentUser;
        currentUser.name = payload;
        commit('setCurrentUser', currentUser);
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

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

    autoLoginUser({ commit }, payload) {
      commit(
        'setCurrentUser',
        new User({
          id: payload.uid,
          email: payload.email,
          name: payload.name,
        })
      );
    },

    async logoutUser({ commit }) {
      await firebase.auth().signOut();
      commit('setCurrentUser', null);
    },

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

    async deleteCurrentUser({ dispatch, rootGetters }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

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

        //delete user
        // await firebase.auth().currentUser.delete();

        // commit('setCurrentUser', null);

        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },
  },

  getters: {
    isUserLoggedIn(state) {
      return state.currentUser !== null;
    },

    userById(state) {
      return function(userId) {
        return state.allUsers.find((user) => {
          return user.id === userId;
        });
      };
    },
  },
};
