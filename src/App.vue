<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import Home from './Home.vue'
import Resultat from './Result.vue'
import AboutReco from './AboutReco.vue'
import Papa from 'papaparse'
import Contact from './contact.vue'
import Partenaire from './partenaire.vue'

const fichierSeries = '/RECO/data/Series.json' // Chemin vers le fichier des descriptions et des images des séries
const fichierCharacteristics = '/RECO/data/caracteristiques_deepseek_AD_normalise.csv' // Chemin vers le fichier des caractéristiques
// eslint-disable-next-line no-unused-vars
const emailjsConfig = {
  serviceId: 'service_mimb94k',   // ID du service EmailJS
  templateId: 'template_g50q2tl', // ID du modèle EmailJS
  userId: 'ISM6B8zfLyjqOPXXd'     // ID de l'utilisateur EmailJS
}



const series = ref([]) // Stocker les séries chargées
const characteristics = ref([]) // Stocker les caractéristiques chargées
const sliders = ref({}) 

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isLoading = ref(true)

// Charger les séries depuis Series.json
onMounted(async () => {
  try {
    const response = await fetch(fichierSeries)
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }
    const jsonData = await response.json()
    series.value = jsonData
      .map(serie => ({
        ...serie,
        checked: false
      }))
      .sort((a, b) => a.name.localeCompare(b.name)) // Trier par ordre alphabétique
      // Charger les données de characteristics.csv
    characteristics.value = await loadCharacteristics()
    console.log('Caractéristiques chargées :', characteristics.value)
  } catch (error) {
    console.error('Erreur lors du chargement de Series.json :', error)
    series.value = []
  } finally {
    isLoading.value = false
  }
})

// Fonction pour charger les données de characteristics.csv
async function loadCharacteristics() {
  return new Promise((resolve, reject) => {
    Papa.parse(fichierCharacteristics, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    })
  })
}

const characteristicsColumns = computed(() => {
  if (!characteristics.value.length) return []
  return Object.keys(characteristics.value[0]).filter(key => key !== 'name')
})

// Initialiser les sliders à 1 par défaut pour chaque colonne
watch(characteristicsColumns, (cols) => {
  cols.forEach(col => {
    if (!(col in sliders.value)) {
      sliders.value[col] = 1
    }
  })
}, { immediate: true })

// Gestion des routes
const routes = {
  '/': Home,
  '/Resultat': Resultat,
  '/about': AboutReco,
  '/contact': Contact,
  '/partenaire': Partenaire
}

const currentPath = ref(window.location.hash || '#/')

// Charger Home par défaut si aucune route n'est définie
if (!window.location.hash) {
  window.location.hash = '#/'
}

const currentView = computed(() => routes[currentPath.value.slice(1)] || Home)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash || '#/'
  changementVus() // Met à jour les états de navigation
})
// fonction tres moche pour changer la navigation (code en commentaire pour selection, décommenter si besoin)
let IsHome = true
//let IsSelection = false
let IsResult = false
let IsAbout = false
let IsContact = false
let IsPartenaire = false
function changementVus() {
  if (currentPath.value === '#/') {
    IsResult= false, IsAbout= false, IsContact= false, IsPartenaire= false
    IsHome = true

  } else if (currentPath.value === '#/Resultat') {
    IsHome= false, IsAbout= false, IsContact= false, IsPartenaire= false
    IsResult = true

  } else if (currentPath.value === '#/about') {
    IsHome= false, IsResult= false, IsContact= false, IsPartenaire= false
    IsAbout = true

  } else if (currentPath.value === '#/contact'){
    IsHome= false, IsResult= false, IsAbout= false, IsPartenaire= false
    IsContact = true

  } else if (currentPath.value === '#/partenaire'){
    IsHome= false, IsResult= false, IsAbout= false, IsContact= false
    IsPartenaire = true

  }
}
changementVus()

// Menu pour mobile
const navOpen = ref(false)
function toggleNav() {
  navOpen.value = !navOpen.value
}
</script>

<template>
  <head>
    <link rel="icon" type="image/png" href="/RECO/public/favicon.ico">
    <title>TV Series Recommandation - RECO+</title>
  </head>  
  <header class="header-bar">
    <a href="https://guinaudeau.github.io/RECO/" target="Fenêtre définie" class="logo-link">
      <img src="/RECO/public/Logo_RECO.png" alt="Logo de RECO+" class="logo-img" />
    </a>
    <h1 class="header-title">RECO+</h1>
    <button @click="toggleDark()" class="dark-mode-toggle">
      <span v-if="!isDark" aria-label="Activer le mode nuit" title="Activer le mode nuit">🌞</span>
      <span v-else aria-label="Activer le mode jour" title="Activer le mode jour">🌙</span>
    </button>
    <button class="menu" @click="toggleNav" aria-label="Menu" aria-expanded="navOpen" aria-controls="main-nav">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
  <nav class="main-nav" :class="{ open: navOpen }">
      <a href="#/" v-if="!IsHome"><button>Catalogue</button></a>
      <a href="#/Resultat" v-if="!IsResult"><button>Résultats</button></a>
      <a href="#/about" v-if="!IsAbout"><button>À propos</button></a>
      <a href="#/contact" v-if="!IsContact"><button>Contact</button></a>
      <a href="#/partenaire" v-if="!IsPartenaire"><button>Partenaire</button></a>
  </nav>
  <div v-if="isLoading">Chargement des séries...</div>
  <keep-alive v-else>
      <component
        :is="currentView"
        :series="series"
        v-model:sliders="sliders"
        :characteristics="characteristics"
        :characteristics-columns="characteristicsColumns"
        v-bind="currentPath.value === '#/contact' ? {
          serviceId: emailjsConfig.serviceId,
          templateId: emailjsConfig.templateId,
          userId: emailjsConfig.userId
        } : {}"
      />
  </keep-alive>
</template>

<style>
body{
  margin:0;
  padding:0;
}
h1{
  margin:0;
  padding:0;
  font-size:2.5em;
  font-weight:bold;
  color: #222; /*#222;*/
  text-align:center;
  margin-bottom:20px;
  font-family: 'PT Serif'; /*'Poppins', sans-serif;*/
  text-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}
html.dark h1 {
  color: #00c7ec;
}
h2{
  margin:0;
  padding:0;
  font-size: 2.2em;
  font-weight:bold;
  color: #222; /*#38808D; #222;*/
  text-align:center;
  margin-bottom:20px;
  font-family: 'PT Serif'; /*'Poppins', sans-serif;*/
  text-shadow: 0px 0px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  /*text-decoration: underline;*/
  letter-spacing: 1px;
}
html.dark h2 {
  color: #00c7ec;
}
.contenu{
  background-color:#f0f9ff;
}
html.dark .contenu {
  background-color: #181c23;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  background: #fff;
  border-bottom: 0.5px solid #34495e;
  padding: 0;
  min-height: 70px;
  position: relative;
}
html.dark .header-bar {
  background: #000;
  border-bottom: 0.5px solid #00c7ec;
}
.logo-link {
  display: flex;
  align-items: center;
}
.logo-img {
  max-width: 70px;
  max-height: 70px;
}
.header-title {
  flex: 1;
  text-align: center;
  text-decoration: underline;
  font-variant: small-caps;
  margin: 0;
  font-size: 2.2em;
}
.main-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.main-nav a {
  flex: none;
  text-align: center;
  font-size: 1.1em;
}
.dark-mode-toggle {
  padding: 10px;
  font-size: 1.7em;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, color 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  background: transparent;
}
.menu {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
}

.menu span {
  display: block;
  width: 28px;
  height: 4px;
  background: #34495e;
  margin: 4px 0;
  border-radius: 2px;
  transition: all 0.3s;
}
html.dark .menu span {
  background: rgb(127, 150, 255);
}

/* Responsive : menu */
@media (max-width: 900px) {
  .header-bar {
    flex-wrap: wrap;
    gap: 8px;
    min-height: 56px;
    padding: 0;
  }
  .header-title {
    font-size: 1.3em;
    min-width: 0;
  }
  .logo-img {
    max-width: 48px;
    max-height: 48px;
  }
  .main-nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #EBF5F7; /*#fff;*/
    border-bottom: 1px solid #34495e;
    z-index: 100;
    display: none;
    gap: 0;
  }
  .main-nav.open {
    display: flex;
  }
  .main-nav a {
    font-size: 1.1em;
    padding: 10px 0;
    width: 100%;
    border-bottom: 1px solid #eee;
  }
  .menu {
    display: flex;
  }
  .dark-mode-toggle {
    width: 44px;
    height: 44px;
    font-size: 1.2em;
  }
  html.dark .main-nav {
    background: #000;
    border-bottom: 1px solid #00c7ec;
  }
}
@media (max-width: 600px) {
  .header-bar {
    gap: 4px;
    min-height: 44px;
    padding: 0 2px;
  }
  .header-title {
    font-size: 1em;
  }
  .logo-img {
    max-width: 36px;
    max-height: 36px;
  }
  .main-nav a {
    font-size: 1em;
    padding: 8px 0;
  }
  .dark-mode-toggle {
    width: 36px;
    height: 36px;
    font-size: 1em;
  }
}
</style>
