<script setup>
import { defineProps, ref, onActivated, defineEmits, watch } from 'vue'
//import {computed } from 'vue'
const emit = defineEmits(['update:sliders'])

const props = defineProps(['series', 'sliders', 'characteristics']) // Recevoir les séries et sliders via props
const similaritiesTable = ref([]) // Tableau des similarités
const comparisonResult = ref(null) // Résultat de la comparaison entre deux séries
let editFeature = ref(false) // État pour afficher/masquer la personnalisation

// Mapping des features vers les colonnes du CSV
const featureColumns = {
  plot: [
    "Plot complexity", "Language level", "Character development", "Originality of the plot", "Themes of good and evil",
    "Deception", "Personal emancipation trajectories", "Collective struggles", "Found families theme",
    "Shakespearean human issues", "Brutal realism"
  ],
  content: [
    "Wokeness", "Historical restitution accuracy", "Multiple characters", "Disabilities", "Politics",
    "Security issues", "Environmental issues", "Investigation", "Thought-provoking series", "Religion", "Travel"
  ],
  character: [
    "Female characters", "Diversity", "Multigenerational", "Animals"
  ],
  representation: [
    "Graphic nature", "Sexual violence", "Violence", "Vulgar dialogues"
  ],
  visuals: [
    "Urban atmosphere", "Rurality", "Wilderness", "Space", "Diversity of locations"
  ],
  comedy: [
    "Humor", "Dark humor", "Satire"
  ],
  emotion: [
    "Nostalgia factor", "Romantic elements", "Feel good", "Dark", "Cute"
  ],
  artistic: [
    "Presence of music", "Language diversity", "Cultural references", "Food"
  ],
  structural: [
    "Suspense", "Action elements", "Everyday life"
  ],
  audio: [
    "NoEnergy", "Music", "Noise", "Voice", "F/H"
  ],
  video: [
    "Mean Brightness", "STDÊ Brightness", "MinÊ Brightness", "MaxÊ Brightness", "Mean Contrast", "STDÊ Contrast", "MinÊ Contrast", "MaxÊ Contrast", "Mean Saturation", "STDÊ Saturation", "MinÊ Saturation", "MaxÊ Saturation", "Heat", "Scene/Seconds", "Plans tres rapide", "Plans courts", "Plans moyens", "Plans longs", "Plans tres longs", "Optical Flow Max", "Optical Flow Score", "Optical Flow STD"
  ]
}
const featureKeys = Object.keys(featureColumns)

// Initialiser tous les sliders à "1" (tout coché par défaut, y compris les features principales)
function getDefaultSliders() {
  const sliders = {};
  featureKeys.forEach(key => {
    sliders[key] = "1";
    (featureColumns[key] || []).forEach(col => {
      sliders[col] = "1";
    })
  })
  return sliders;
}

// Copie locale pour l'édition (tout coché par défaut si vide)
const localSliders = ref(getDefaultSliders())

// Si props.sliders est fourni et non vide, écrase les valeurs par défaut
if (props.sliders && Object.keys(props.sliders).length) {
  Object.entries(props.sliders).forEach(([k, v]) => {
    localSliders.value[k] = v === 1 ? "1" : v === 0 ? "0" : String(v)
  })
}

// Quand on ouvre la personnalisation, synchroniser la copie locale
function openEdit() {
  // Fusionne les valeurs par défaut avec celles du parent
  localSliders.value = {
    ...getDefaultSliders(),
    ...Object.fromEntries(
      Object.entries(props.sliders).map(([k, v]) => [k, v === 1 ? "1" : v === 0 ? "0" : String(v)])
    )
  }
  editFeature.value = true
}

// Émettre la mise à jour au parent
function validerChanges() {
  emit('update:sliders', localSliders.value)
  editFeature.value = false
  // Réinitialiser les résultats
  comparisonResult.value = null
  similaritiesTable.value = []
}
watch(
  () => props.sliders,
  () => {
    const selectedSeries = props.series.filter(serie => serie.checked)
    if (typeAffichage.value === 1 && selectedSeries.length > 0) {
      calculerSimilaritesPourUneSerie(selectedSeries[0].name)
    } else if (typeAffichage.value === 2 && selectedSeries.length > 1) {
      calculerSimilaritesEntreDeuxSeries(selectedSeries[0].name, selectedSeries[1].name)
    }
  },
  { deep: true }
)

// Fonction pour calculer la similarité entre deux vecteurs
function cosineSimilarity(A, B) {
  let dotproduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < A.length; i++) {
    dotproduct += (A[i] * B[i]);
    mA += (A[i] * A[i]);
    mB += (B[i] * B[i]);
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  const denom = mA * mB;
  if (!denom) return 0;
  const result = dotproduct / denom;
  return isNaN(result) ? 0 : result;
}

// Fonction pour récupérer les caractéristiques d'une série selon le mapping (pas de pondération)
function getFeatures(serieName, key) {
  const serie = props.characteristics.find(item => item["Serie"] === serieName)
  if (!serie) return []
  const cols = featureColumns[key] || []
  // On ne prend en compte que les sous-features activées
  return cols
    .filter(col => localSliders.value[col] === "1")
    .map(col => parseFloat(serie[col]) || 0)
}

// Fonction pour calculer les similarités pour une série donnée (avec pondération)
function calculerSimilaritesPourUneSerie(serie_name) {
  const selectedSerie = props.series.find(serie => serie.name === serie_name)
  if (!selectedSerie) return

  similaritiesTable.value = props.series
    .filter(serie => serie.name !== serie_name)
    .map(serie => {
      let weightedSum = 0
      let totalWeight = 0
      const featureSimilarities = featureKeys.map(key => {
        const vectorA = getFeatures(selectedSerie.name, key)
        const vectorB = getFeatures(serie.name, key)
        if (vectorA.length === 0 || vectorB.length === 0) return null
        const similarity = cosineSimilarity(vectorA, vectorB)
        const weight = parseFloat(localSliders.value[key]) || 0
        weightedSum += similarity * weight
        totalWeight += weight
        return { key, similarity, weight, count: vectorA.length }
      }).filter(Boolean)

      const meanSimilarity = totalWeight > 0 ? weightedSum / totalWeight : 0

      return {
        name: serie.name,
        similarity: meanSimilarity,
        featureSimilarities,
        image: serie.image,
        description: serie.description
      }
    })

  similaritiesTable.value.sort((a, b) => b.similarity - a.similarity)
}

// Fonction pour calculer la similarité entre deux séries (avec pondération)
function calculerSimilaritesEntreDeuxSeries(serie1Name, serie2Name) {
  let weightedSum = 0
  let totalWeight = 0
  const featureSimilarities = featureKeys.map(key => {
    const vectorA = getFeatures(serie1Name, key)
    const vectorB = getFeatures(serie2Name, key)
    if (vectorA.length === 0 || vectorB.length === 0) return null
    const similarity = cosineSimilarity(vectorA, vectorB)
    const weight = parseFloat(localSliders.value[key]) || 0
    weightedSum += similarity * weight
    totalWeight += weight
    return { key, similarity, weight, count: vectorA.length }
  }).filter(Boolean)

  const meanSimilarity = totalWeight > 0 ? weightedSum / totalWeight : 0

  comparisonResult.value = {
    serie1Name,
    serie2Name,
    weightedSimilarity: meanSimilarity,
    featureSimilarities
  }
}

// Charger les données et effectuer les calculs à chaque fois que le composant est activé
let typeAffichage = ref(0) // 1 pour une série, 2 pour deux séries
onActivated(async () => {
  try {
    console.log('Caractéristiques disponibles :', props.characteristics)
    // Vérifier si la liste des séries sélectionnées est vide
    const selectedSeries = props.series.filter(serie => serie.checked)
    if (selectedSeries.length === 0) {
      // Rediriger vers Home si aucune série n'est sélectionnée
      window.location.hash = '#/'
      return
    }
    if (selectedSeries.length === 1) {
      typeAffichage.value = 1
      // Calculer les similarités pour la première série cochée
      calculerSimilaritesPourUneSerie(selectedSeries[0].name)
      
    } else if (selectedSeries.length === 2) {
      // Calculer les similarités entre deux séries cochées
      calculerSimilaritesEntreDeuxSeries(selectedSeries[0].name, selectedSeries[1].name)
      typeAffichage.value = 2
    }
  } catch (error) {
    console.error('Erreur lors du chargement des caractéristiques :', error)
  }
})

// Fonction pour afficher la similarité pour chaque feature
function showFeatureSimilarities(featureSimilarities) {
  const message = featureSimilarities
    .map(feature => `${feature.key} : ${(feature.similarity * 100).toFixed(2)}% (poids : ${feature.weight ?? localSliders.value[feature.key]})`)
    .join('\n')
  alert(`Similarité par caractéristiques :\n${message}`)
}

// Fonction pour afficher la description d'une série
function showDescription(item) {
  alert(`Description de "${item.name}" : ${item.description}`)
}

const openGroups = ref({})

// Initialiser tous fermés
featureKeys.forEach(key => {
  openGroups.value[key] = false
})
</script>

<template>
  <div class="contenu">
    <h2>Résultats des séries sélectionnées</h2>
    <div id="personnalisation">
      <button @click="openEdit" v-if="!editFeature">personnaliser le resultat</button>
      <div v-if="editFeature">
        <button @click="validerChanges">Valider les changements</button>
        <h3>Personnalisation des critères</h3>
        <!-- Grille pour les critères principaux, répartie sur 4 par ligne -->
        <div class="slider-grid-multi">
          <div
            class="slider-row"
            v-for="row in Math.ceil(featureKeys.length / 4)"
            :key="row"
          >
            <div
              v-for="key in featureKeys.slice((row - 1) * 4, row * 4)"
              :key="key"
              class="slider-col"
            >
              <label class="feature-title-slider">
                <strong>{{ key }}</strong>
                <input
                  type="range"
                  v-model.number="localSliders[key]"
                  min="0"
                  max="2"
                  step="0.01"
                />
                <span class="slider-value">{{ localSliders[key] }}</span>
                <button
                  type="button"
                  class="toggle-features-btn"
                  @click="openGroups[key] = !openGroups[key]"
                >
                  {{ openGroups[key] ? '▲' : '▼' }}
                </button>
              </label>
              <transition name="fade">
                <div class="checkbox-col" v-show="openGroups[key]">
                  <label
                    v-for="col in featureColumns[key]"
                    :key="col"
                    class="checkbox-item"
                  >
                    <input
                      type="checkbox"
                      v-model="localSliders[col]"
                      true-value="1"
                      false-value="0"
                    />
                    {{ col }}
                  </label>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <button @click="validerChanges">Valider les changements</button>
        <button @click="editFeature = false">Annuler</button>
      </div>
    </div>
    <div v-if="typeAffichage===1" class="series-grid">
      <div v-for="item in similaritiesTable" :key="item.name" class="serie-card">
        <div class="serie-header">
          <img :src="item.image" alt="Image de la série" class="serie-image" />
          <h3 class="serie-title">{{ item.name }}</h3>
        </div>
        <div class="serie-body">
          <div class="similarity-score">
            <strong>Score de Similarité :</strong> {{ (item.similarity * 100).toFixed(2) }}%
          </div>
          <div class="serie-description">
            <span class="desc-text">{{ item.description }}</span>
            <button class="desc-btn" @click="showDescription(item)">Voir description</button>
          </div>
        </div>
        <div class="serie-actions">
          <button @click="showFeatureSimilarities(item.featureSimilarities)">
            Voir Similarité par caractéristique
          </button>
        </div>
      </div>
    </div>

    <!-- Affichage des résultats de la comparaison -->
    <div v-else-if="typeAffichage === 2 && comparisonResult" class="comparison-result">
      <h3>Comparaison entre {{ comparisonResult.serie1Name }} et {{ comparisonResult.serie2Name }}</h3>
      <p><strong>Similarité globale :</strong> {{ (comparisonResult.weightedSimilarity * 100).toFixed(2) }}%</p>
      <ul>
        <li v-for="feature in comparisonResult.featureSimilarities || []" :key="feature.key">
          <strong>{{ feature.key }} :</strong> {{ (feature.similarity * 100).toFixed(2) }}%
        </li>
      </ul>
    </div>
    <p v-else>Aucune série trouvée.</p>
  </div>
</template>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

tbody {
  text-align: center;
}

td {
  padding: 10px;
  vertical-align: top;
}

.serie-image {
  max-width: 100px;
  max-height: 150px;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #0056b3;
}

.comparison-result {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 5px;
  background-color: var(--background-color, #f9f9f9);
  color: var(--text-color, #000);
}

.comparison-result h3 {
  margin-bottom: 10px;
}

.comparison-result ul {
  list-style-type: none;
  padding: 0;
}

.comparison-result li {
  margin-bottom: 5px;
}

html.dark .comparison-result {
  --background-color: #333;
  --text-color: #00c7ec;
  --border-color: #555;
}

#personnalisation {
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
}

/* Grille multi-lignes pour les critères principaux */
.checkbox-grid-multi {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1em;
}

.checkbox-row {
  display: flex;
  gap: 2em;
  justify-content: center;
  flex-wrap: wrap;
}

.checkbox-row > div {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  min-width: 180px;
  flex: 1 1 180px;
  max-width: 250px;
}

.feature-title-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 0.5em;
}

@media (max-width: 1100px) {
  .checkbox-row {
    gap: 1em;
  }
  .checkbox-row > div {
    min-width: 140px;
    max-width: 1fr;
  }
}

@media (max-width: 800px) {
  .checkbox-row {
    flex-wrap: wrap;
    gap: 0.5em;
  }
  .checkbox-row > div {
    min-width: 120px;
    max-width: 100%;
  }
}


@media (max-width: 600px) {
  .checkbox-row {
    flex-direction: column;
    align-items: stretch;
  }
  .checkbox-row > div {
    min-width: 100%;
    max-width: 100%;
  }
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 1em;
}

.checkbox-col {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

@media (max-width: 900px) {
  table, thead, tbody, tr, th, td {
    display: block;
    width: 100%;
  }
  thead {
    display: none;
  }
  tr {
    margin-bottom: 22px;
    background: #f3f3f3;
    border-radius: 12px;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
    padding: 12px 0;
  }
  td {
    border: none;
    background: none;
    box-shadow: none;
    padding: 10px 16px;
    text-align: left;
    min-width: 0;
    position: relative;
  }
  td:before {
    content: attr(data-label);
    font-weight: bold;
    display: block;
    margin-bottom: 4px;
    color: #007bff;
  }
  .serie-image {
    margin: 0 auto 10px auto;
    display: block;
  }
  .desc-text {
    display: none;
  }
  .desc-btn {
    display: inline-block !important;
    margin-top: 6px;
  }
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px 20px;
  margin: 30px auto 10px auto;
  background: #c4e0ff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.15);
  padding: 24px;
}

.serie-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  padding: 18px 12px 12px 12px;
  text-align: center;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}

.serie-card:hover {
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.18);
}

.serie-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.serie-title {
  font-size: 1.2em;
  margin: 8px 0 0 0;
  color: #2d3a4a;
}

.serie-image {
  max-width: 110px;
  max-height: 160px;
  border-radius: 10px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
  background: #f3f3f3;
  transition: transform 0.3s;
}

.serie-image:hover {
  transform: scale(1.08);
}

.similarity-score {
  margin-bottom: 10px;
  color: #007bff;
  font-weight: 600;
}

.serie-description {
  margin-bottom: 10px;
}

.desc-btn {
  display: none;
  margin-top: 6px;
  background: #7dcfff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.serie-actions button {
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  transition: background 0.2s, color 0.2s;
}

.serie-actions button:hover,
.desc-btn:hover {
  background: #2d3a4a;
  color: #fff;
}

/* Responsive : description masquée sur mobile, bouton affiché */
@media (max-width: 500px) {
  .desc-text {
    display: none;
  }
  .desc-btn {
    display: inline-block;
  }
}

/* Responsive : grille en colonne sur mobile */
@media (max-width: 900px) {
  .series-grid {
    grid-template-columns: 1fr !important;
    padding: 12px;
  }
}


/* Mode sombre */
html.dark .series-grid,
html.dark .serie-card {
  background: #232834;
  color: #e6eaf3;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.25);
}

html.dark .serie-card {
  background: #232834;
  color: #e6eaf3;
}

html.dark .serie-title {
  color: #7dcfff;
}

html.dark .serie-image {
  background: #232834;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.22);
}

.slider-grid-multi {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 1em;
}
.slider-row {
  display: flex;
  gap: 2em;
  justify-content: center;
  flex-wrap: wrap;
}
.slider-col {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  min-width: 210px;
  max-width: 260px;
  box-sizing: border-box;
}
.feature-title-slider {
  display: flex;
  align-items: center;
  gap: 0.7em;
  margin-bottom: 0.5em;
  flex-wrap: wrap;
  justify-content: space-between;
}
.feature-title-slider strong {
  flex: 1 1 80px;
  min-width: 80px;
  max-width: 120px;
  word-break: break-word;
}
input[type="range"] {
  width: 90px;
  min-width: 70px;
  margin: 0 8px;
  flex-shrink: 0;
}
.slider-value {
  min-width: 2.5em;
  text-align: right;
  font-family: monospace;
  color: #007bff;
  flex-shrink: 0;
}
.toggle-features-btn {
  margin-left: 0.5em;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .slider-row {
    flex-direction: column;
    gap: 1em;
  }
  .slider-col {
    min-width: 100%;
    max-width: 100%;
  }
  
  .feature-title-slider {
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    flex-wrap: wrap;
    /* justify-content: space-between; */
  }
  .checkbox-col {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.3em;
    border-radius: 8px;
    padding: 0.5em 0.7em;
    margin-bottom: 0.5em;
    box-sizing: border-box;
  }
}
</style>