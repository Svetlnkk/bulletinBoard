import * as firebase from 'firebase';

class User {
  constructor(id, email, name = '') {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}

class UsersArray {
  constructor(userId, name = '') {
    this.userId = userId, this.name = name;
  }
}

export default {
  namespaced: true,
  state: {
    user: null,
    users: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    getUsers(state, payload) {
      state.users = payload;
    },
  },
  actions: {
    async registerUser({ commit, dispatch, state }, { name, email, password }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });
      try {
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        commit('setUser', new User(user.user.uid, user.user.email));

        await firebase
          .database()
          .ref(`/users/${user.user.uid}/personal`)
          .set({ name: name });

        const storeUser = state.user;
        storeUser.name = name;

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
          'setUser',
          new User(user.user.uid, user.user.email, databasePersonalName)
        );
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async fetchUser({ commit, dispatch, state }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      try {
        const databaseUserValue = await firebase
          .database()
          .ref(`/users/${state.user.id}/personal`)
          .once('value');
        const databasePersonalName = databaseUserValue.val().name;

        const user = state.user;
        user.name = databasePersonalName;

        commit('setUser', user);
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/finishLoading', null, { root: true });
        dispatch('shared/setError', error.message, { root: true });
        throw error;
      }
    },

    async fetchUsers({ commit, dispatch }) {
      console.log('test')
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
          databaseUsersResult.push(new UsersArray(key, user.name));
        });

        commit('getUsers', databaseUsersResult);
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
          .ref(`/users/${state.user.id}/personal`)
          .set({ name: payload });

        const user = state.user;
        user.name = payload;
        commit('setUser', user);
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

      const user = state.user;
      user.email = payload;

      try {
        await firebase.auth().currentUser.updateEmail(payload);

        commit('setUser', user);
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
      commit('setUser', new User(payload.uid, payload.email));
    },

    async logoutUser({ commit }) {
      await firebase.auth().signOut();
      commit('setUser', null);
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
  },

  getters: {
    isUserLoggedIn(state) {
      return state.user !== null;
    },

    userById(state) {
      return function(userId) {
        return state.users.find((user) => {
          return user.userId === userId;
        });
      };
    },
  },
};
