
const useStationStore = defineStore('station', () => {

  const currentStation = ref({})

  function setCurrentStation(newCurrentStation) {
    currentStation.value = newCurrentStation
  }


  return { currentStation, setCurrentStation }
})

export default useStationStore