<script setup>
import { ref, onMounted } from 'vue'
import { selectedSeries } from './store.js'

const df = ref([]) // Tableau réactif pour stocker les données du CSV

// Fonction pour charger le fichier CSV
const loadCSV = async (filePath) => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Erreur lors du chargement du fichier CSV : ${response.statusText}`)
    }
    const text = await response.text()
    const rows = text.split('\n').map(row => row.split(';')) // Adapter le séparateur si nécessaire
    const headers = rows.shift() // Extraire les en-têtes
    df.value = rows.map(row => {
      const obj = {}
      row.forEach((value, index) => {
        obj[headers[index]] = isNaN(value) ? value : parseFloat(value) // Convertir en nombre si possible
      })
      return obj
    })
    console.log('Données chargées :', df.value)
  } catch (error) {
    console.error('Erreur lors du chargement du fichier CSV :', error)
  }
}

// Charger les données CSV au montage du composant
onMounted(() => {
  loadCSV('/RECO/data/characteristics.csv')
})

// Fonction pour extraire les caractéristiques d'une série
function get_features(serie_name, features, df) {
  const serie = df.find(row => row['TV Serie Name'] === serie_name)
  if (!serie) {
    console.error(`Série ${serie_name} non trouvée dans les données.`)
    return []
  }
  return features.map(feature => serie[feature])
}

// Fonction pour calculer la similarité cosinus
function calcul_similarite(serie_1, serie_2, df, features) {
  const features_1 = get_features(serie_1, features, df)
  const features_2 = get_features(serie_2, features, df)

  if (features_1.length === 0 || features_2.length === 0) {
    return null
  }

  const dotProduct = features_1.reduce((sum, val, i) => sum + val * features_2[i], 0)
  const magnitude1 = Math.sqrt(features_1.reduce((sum, val) => sum + val ** 2, 0))
  const magnitude2 = Math.sqrt(features_2.reduce((sum, val) => sum + val ** 2, 0))

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

// Exemple d'utilisation
const features = ['feature1', 'feature2', 'feature3']
let similarity = null
onMounted(() => {
  similarity = calcul_similarite('Serie 1', 'Serie 2', df.value, features)
  console.log('Similarité cosinus entre Serie 1 et Serie 2 :', similarity)
})
</script>

<template>
  <h2>Résultats des séries sélectionnées</h2>
  <ul>
    <li v-for="serie in selectedSeries" :key="serie.id">
      {{ serie['TV Serie Name'] }}
    </li>
  </ul>
  <p v-if="selectedSeries.length === 0">Aucune série sélectionnée.</p>

<h3>Valeurs des sliders :</h3>
  <ul>
    <li>Couleur : {{ sliders.couleur }}</li>
    <li>Scénario : {{ sliders.scenario }}</li>
    <li>Exemple : {{ sliders.exemple }}</li>
  </ul>
  <h3>Exemple de calcul de similarité :</h3>
  <p>Similarité cosinus entre "Serie 1" et "Serie 2" : {{ similarity }}</p>
</template>