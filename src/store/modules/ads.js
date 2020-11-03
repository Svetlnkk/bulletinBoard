import * as firebase from 'firebase';
import { Ad } from '../../entities/Ad';

export default {
  namespaced: true,
  state: {
    ads: [],
  },

  mutations: {
    ADD_AD(state, payload) {
      state.ads.push(payload);
    },
    DELETE_AD(state, payload) {
      let adRemovableIndex = state.ads.findIndex((ad) => {
        return ad.id === payload;
      });
      state.ads.splice(adRemovableIndex, 1);
    },
    SET_ALL_ADS(state, payload) {
      state.ads = payload;
    },
    SET_AD(state, { title, description, id, price }) {
      const ad = state.ads.find((ad) => {
        return ad.id === id;
      });
      ad.description = description;
      ad.price = price;
      ad.title = title;
    },
  },

  actions: {
    // create ad in state and firebase
    async createAd({ commit, dispatch, getters, rootState }, payload) {
      // max ads of user (10)
      if (getters.myAds.length >= 10) {
        dispatch('shared/clearError', null, { root: true });
        dispatch('shared/setError', 'You most have no more than 10 ads', {
          root: true,
        });
        return;
      }

      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      const image = payload.image;

      if (!image) return;

      try {
        const AdNew = new Ad({
          description: payload.description,
          id: null,
          ownerId: rootState['user'].currentUser.id,
          price: payload.price,
          promo: payload.promo,
          title: payload.title,
        });

        const ad = await firebase
          .database()
          .ref('ads')
          .push(AdNew);

        const imageExt = image.name.slice(image.name.lastIndexOf('.')).slice(1);

        // add image to firebase (storage)
        const fileData = await firebase
          .storage()
          .ref(`ads/${ad.key}.${imageExt}`)
          .put(image);

        const imageSrc = await fileData.ref.getDownloadURL();

        // add ad to firebase (database)
        await firebase
          .database()
          .ref('ads')
          .child(ad.key)
          .update({
            imageSrc,
          });

        // add current date
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

        // add ad in state
        commit('ADD_AD', {
          ...AdNew,
          id: ad.key,
          imageSrc,
          dateAdded,
        });
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/decreaseLoading', null, { root: true });
        throw error;
      }
    },

    /* delete ad in state and firebase 
      @param adId - ad current ad in state. 
      @param ImageSrc - image adress in firebase of current ad)*/
    async deleteAd({ commit, dispatch }, { adId, imageSrc }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      const storage = await firebase.storage();
      const storageRef = storage.ref();

      const imageFullPath = storage.refFromURL(imageSrc).fullPath;

      try {
        //delete image
        if (imageSrc) {
          const imageReference = await storageRef.child(imageFullPath);

          await imageReference.delete();
        }
        //delete ad in database
        await firebase
          .database()
          .ref('ads')
          .child(adId)
          .remove();

        commit('DELETE_AD', adId);

        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/decreaseLoading', null, { root: true });
        throw error;
      }
    },

    // fetch ads in firebase to state
    async fetchAds({ commit, dispatch }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });

      const resultAds = [];

      try {
        const firebaseValue = await firebase
          .database()
          .ref('ads')
          .once('value');

        const ads = firebaseValue.val();

        if (!ads) {
          dispatch('shared/decreaseLoading', null, { root: true });
          return;
        }

        Object.keys(ads).forEach((key) => {
          const ad = ads[key];
          resultAds.push(
            new Ad({
              id: key,
              dateAdded: ad.dateAdded,
              description: ad.description,
              imageSrc: ad.imageSrc,
              ownerId: ad.ownerId,
              price: ad.price,
              promo: ad.promo,
              title: ad.title,
            })
          );
        });

        commit('SET_ALL_ADS', resultAds);
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/decreaseLoading', null, { root: true });
        throw error;
      }
    },

    /* update ad in state and firebase 
      @param title - updatable title of current ad 
      @param description - updatable description of current ad 
      @param id - id of current ad 
      @param price - updatable price of current ad 
    */
    async updateAd({ commit, dispatch }, { title, description, id, price }) {
      dispatch('shared/clearError', null, { root: true });
      dispatch('shared/increaseLoading', null, { root: true });
      try {
        await firebase
          .database()
          .ref('ads')
          .child(id)
          .update({
            description,
            price,
            title,
          });
        commit('SET_AD', {
          title,
          description,
          id,
          price,
        });
        dispatch('shared/decreaseLoading', null, { root: true });
      } catch (error) {
        dispatch('shared/setError', error.message, { root: true });
        dispatch('shared/decreaseLoading', null, { root: true });
        throw error;
      }
    },
  },

  getters: {
    // ad filtered by id
    adById(state) {
      return function(adId) {
        return state.ads.find((ad) => {
          return ad.id === adId;
        });
      };
    },

    // array of ads, filtered by current user id
    myAds(state, getters, rootState) {
      return state.ads.filter((ad) => {
        return ad.ownerId === rootState['user'].currentUser.id;
      });
    },

    // array of ads, filtered by promo
    promoAds(state) {
      return state.ads.filter((ad) => {
        return ad.promo;
      });
    },
  },
};
