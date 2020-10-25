import * as firebase from 'firebase';

class Ad {
  constructor(
    title,
    description,
    ownerId,
    imageSrc = '',
    promo = false,
    id = null,
    dateAdded = '',
    price = 0
  ) {
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.imageSrc = imageSrc;
    this.promo = promo;
    this.id = id;
    this.dateAdded = dateAdded;
    this.price = price;
  }
}

export default {
  namespaced: true,
  state: {
    ads: [],
  },
  mutations: {
    createAd(state, payload) {
      state.ads.push(payload);
    },
    getAds(state, payload) {
      state.ads = payload;
    },
    updateAd(state, { title, description, id, price }) {
      const ad = state.ads.find((ad) => {
        return ad.id === id;
      });
      ad.title = title;
      ad.description = description;
      ad.price = price;
    },
    deleteAd(state, payload) {
      let adRemovableIndex = state.ads.findIndex((ad) => {
        return ad.id === payload;
      });
      state.ads.splice(adRemovableIndex, 1);
    },
  },
  actions: {
    async createAd({ commit, dispatch, rootState }, payload) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      const image = payload.image;

      try {
        const AdNew = new Ad(
          payload.title,
          payload.description,
          rootState['user'].user.id,
          '',
          payload.promo,
          null,
          '',
          payload.price
        );

        const ad = await firebase
          .database()
          .ref('ads')
          .push(AdNew);

        const imageExt = image.name.slice(image.name.lastIndexOf('.')).slice(1);

        const fileData = await firebase
          .storage()
          .ref(`ads/${ad.key}.${imageExt}`)
          .put(image);

        const imageSrc = await fileData.ref.getDownloadURL();

        await firebase
          .database()
          .ref('ads')
          .child(ad.key)
          .update({
            imageSrc,
          });

        const date = new Date();

        const hours =
          date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes =
          date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const dateAdded = `${date.getDate()}.${date.getMonth() +
          1}.${date.getFullYear()} ${hours}:${minutes}`;
        await firebase
          .database()
          .ref('ads')
          .child(ad.key)
          .update({
            dateAdded,
          });

        commit('createAd', {
          ...AdNew,
          id: ad.key,
          imageSrc,
          dateAdded,
        });
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/finishLoading', null, { root: true });
        throw error;
      }
    },

    async fetchAds({ commit, dispatch }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      const resultAds = [];

      try {
        const firebaseValue = await firebase
          .database()
          .ref('ads')
          .once('value');

        const ads = firebaseValue.val();

        if (!ads) {
          dispatch('shared/finishLoading', null, { root: true });
          return;
        }

        Object.keys(ads).forEach((key) => {
          const ad = ads[key];
          resultAds.push(
            new Ad(
              ad.title,
              ad.description,
              ad.ownerId,
              ad.imageSrc,
              ad.promo,
              key,
              ad.dateAdded,
              ad.price
            )
          );
        });

        commit('getAds', resultAds);
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/finishLoading', null, { root: true });
        throw error;
      }
    },

    async updateAd({ commit, dispatch }, {
      title,
      description,
      id,
      price
      }) 
      {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });
      try {
        await firebase
          .database()
          .ref('ads')
          .child(id)
          .update({
            title,
            description,
            price,
          });
        commit('updateAd', {
          title,
          description,
          id,
          price,
        });
        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/finishLoading', null, { root: true });
        throw error;
      }
    },

    async deleteAd({ commit, dispatch }, { id, imageSrc }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/startLoading', null, { root: true });

      const storage = firebase.storage();
      const storageRef = storage.ref();

      const imageFullPath = storage.refFromURL(imageSrc).fullPath;

      const imageReference = await storageRef.child(imageFullPath);

      try {
        await imageReference.delete();

        await firebase
          .database()
          .ref('ads')
          .child(id)
          .remove();

        commit('deleteAd', id);

        dispatch('shared/finishLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/finishLoading', null, { root: true });
        throw error;
      }
    },
  },
  getters: {
    promoAds(state) {
      return state.ads.filter((ad) => {
        return ad.promo;
      });
    },
    myAds(state, getters, rootState) {
      return state.ads.filter((ad) => {
        return ad.ownerId === rootState['user'].user.id;
      });
    },
    adById(state) {
      return function(adId) {
        return state.ads.find((ad) => {
          return ad.id === adId;
        });
      };
    },
  },
};
