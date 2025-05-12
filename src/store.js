import { ref, watch } from 'vue'

// Séries sélectionnées
export const selectedSeries = ref(JSON.parse(localStorage.getItem('selectedSeries')) || [])

// Valeurs des sliders
export const sliders = ref(
  JSON.parse(localStorage.getItem('sliders')) || {
    llama_Synopsis: 1,
    audio: 1,
    vidéo: 1
  }
)

// Sauvegarder les séries sélectionnées dans localStorage
watch(selectedSeries, (newValue) => {
  localStorage.setItem('selectedSeries', JSON.stringify(newValue))
}, { deep: true })

// Sauvegarder les sliders dans localStorage
watch(sliders, (newValue) => {
  localStorage.setItem('sliders', JSON.stringify(newValue))
}, { deep: true })

