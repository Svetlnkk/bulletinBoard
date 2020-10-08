export default {
    state: {
        ads: [
            {title: 'First ad',
            description: 'Lorem ipsum confugulas. Hue equidas.',
            promo: false,
            imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
            id: '1'},
            {title: 'Second ad',
            description: 'Lorem ipsum confugulas. Hue equidas',
            promo: true,
            imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
            id: '2'},
            {title: 'Third ad',
            description: 'Lorem ipsum confugulas. Hue equidas',
            promo: true,
            imageSrc: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
            id: '3'},
        ],
    },
    mutations: {
        createAd (state, payload) {
            state.ads.push(payload)
        }
    },
    actions: {
        createAd ({commit}, payload) {
            payload.id = 'asdfsdafasfgwgtq';

            commit('createAd', payload)
        }
    },
    getters: {
        ads (state) {
            return state.ads
        },
        promoAds (state) {
            return state.ads.filter( ad => {
                return ad.promo
            })
        },
        myAds (state) {
            return state.ads
        },
        adById (state) {
            return function(adId) {
                return state.ads.find( ad => {
                  return  ad.id === adId 
                }) 
            }
        }
    }
}