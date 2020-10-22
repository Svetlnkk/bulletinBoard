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
    (this.userId = userId), (this.name = name);
  }
}

export default {
  state: {
    user: null,
    users: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    loadUsers(state, payload) {
      state.users = payload;
    },
  },
  actions: {
    async registerUser({ commit, getters }, { name, email, password }) {
      commit('shared/clearError');
      commit('shared/setLoadingUser', true);
      try {
        const user = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        commit('setUser', new User(user.user.uid, user.user.email));

        await firebase
          .database()
          .ref(`/users/${user.user.uid}/personal`)
          .set({ name: name });

        const storeUser = getters.user;
        storeUser.name = name;

        commit('shared/setLoadingUser', false);
      } catch (error) {
        commit('shared/setLoadingUser', false);
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async loginUser({ commit }, { email, password }) {
      commit('shared/clearError');
      commit('shared/setLoadingUser', true);

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
        commit('shared/setLoadingUser', false);
      } catch (error) {
        commit('shared/setLoadingUser', false);
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async fetchUser({ commit, getters }) {
      commit('shared/clearError');
      commit('shared/setLoadingUser', true);

      try {
        const databaseUserValue = await firebase
          .database()
          .ref(`/users/${getters.user.id}/personal`)
          .once('value');
        const databasePersonalName = databaseUserValue.val().name;

        const user = getters.user;
        user.name = databasePersonalName;

        commit('setUser', user);
        commit('shared/setLoadingUser', false);
      } catch (error) {
        commit('shared/setLoadingUser', false);
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async fetchUsers({ commit }) {
      commit('shared/clearError');
      commit('shared/setLoadingUser', true);

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

        commit('loadUsers', databaseUsersResult);
        commit('shared/setLoadingUser', false);
      } catch (error) {
        commit('shared/setLoadingUser', false);
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async updateUser({ commit, dispatch }, { name, email, password }) {
      commit('shared/clearError');
      commit('shared/setLoadingUser', true);
      try {
        await dispatch('changeName', name);

        await dispatch('changeEmail', email);

        await dispatch('changePassword', password);

        commit('shared/setLoadingUser', false);
      } catch (error) {
        commit('shared/setLoadingUser', false);
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async changeName({ commit, getters }, payload) {
      if (!payload) return;
      commit('shared/clearError');
      commit('shared/setLoadingUser', true);
      try {
        await firebase
          .database()
          .ref(`/users/${getters.user.id}/personal`)
          .set({ name: payload });

        const user = getters.user;
        user.name = payload;
        commit('setUser', user);
        commit('shared/setLoadingUser', false);
      } catch (error) {
        commit('shared/setLoadingUser', false);
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async changeEmail({ commit, getters }, payload) {
      if (!payload) return;
      commit('shared/clearError');

      const user = getters.user;
      user.email = payload;

      try {
        await firebase.auth().currentUser.updateEmail(payload);

        commit('setUser', user);
      } catch (error) {
        commit('shared/setError', error.message);
        throw error;
      }
    },
    async changePassword({ commit }, payload) {
      if (!payload) return;
      commit('shared/clearError');

      try {
        await firebase.auth().currentUser.updatePassword(payload);
      } catch (error) {
        commit('shared/setError', error.message);
        throw error;
      }
    },
    autoLoginUser({ commit }, payload) {
      commit('setUser', new User(payload.uid, payload.email));
    },
    logoutUser({ commit }) {
      firebase.auth().signOut();
      commit('setUser', null);
    },
    async checkAuthenticate({ commit }, payload) {
      commit('shared/clearError');

      const user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        payload
      );

      try {
        await user.reauthenticateWithCredential(credential);
      } catch (error) {
        commit('shared/setError', error.message);
        throw error;
      }
    },
  },
  getters: {
    user(state) {
      if (!state.user) return false;
      return state.user;
    },
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
