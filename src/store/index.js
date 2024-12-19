import persist from 'pinia-plugin-persistedstate'
const store = createPinia().use(persist)
export default store