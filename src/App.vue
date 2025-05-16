<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import Home from './Home.vue'
import SelectionPuissance from './SelectionPuissance.vue'
import Resultat from './Result.vue'
import AboutReco from './AboutReco.vue'

const series = ref([]) // Stocker les séries chargées
const sliders = ref({
  llama_Synopsis: 1,
  audio: 1,
  vidéo: 1
})

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isLoading = ref(true)

// Charger les séries depuis Series.json
onMounted(async () => {
  try {
    const response = await fetch('/RECO/data/Series.json')
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }
    const jsonData = await response.json()
    series.value = jsonData
      .map(serie => ({
        ...serie,
        checked: false // Initialiser la case à cocher à false
      }))
      .sort((a, b) => a.name.localeCompare(b.name)) // Trier par ordre alphabétique
  } catch (error) {
    console.error('Erreur lors du chargement de Series.json :', error)
    series.value = []
  } finally {
    isLoading.value = false
  }
})

// Gestion des routes
const routes = {
  '/': Home,
  '/SelectionPuissance': SelectionPuissance,
  '/Resultat': Resultat,
  '/about': AboutReco
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
// changer la navigation
let IsHome = true
let IsSelection = false
let IsResult = false
let IsAbout = false
function changementVus() {
  if (currentPath.value === '#/') {
    IsHome = true
    IsSelection = false
    IsResult = false
    IsAbout = false
  } else if (currentPath.value === '#/SelectionPuissance') {
    IsHome = false
    IsSelection = true
    IsResult = false
    IsAbout = false
  } else if (currentPath.value === '#/Resultat') {
    IsHome = false
    IsSelection = false
    IsResult = true
    IsAbout = false
  } else if (currentPath.value === '#/about') {
    IsHome = false
    IsSelection = false
    IsResult = false
    IsAbout = true
  }
}

changementVus()

</script>

<template>
  <div class="top">
    <div class="title-container">
      <a href="https://www.cnrs.fr/fr" target="Fenêtre définie"><img src="CNRS.png" alt="Logo du CNRS" style="max-width: 100px; max-height: 100px; top: 10px; left: 10px;" /></a>
      <h1>RECO+</h1>
      <button @click="toggleDark()" class="dark-mode-toggle">Mode Jour/Nuit</button>
    </div>
  </div>
  <nav>
    <a href="#/" v-if="!IsHome"><button v-if="!IsHome">Catalogue</button></a>
    <a href="#/SelectionPuissance" v-if="!IsSelection"><button v-if="!IsSelection">Personnalisation</button></a>
    <a href="#/Resultat" v-if="!IsResult && !IsAbout"><button v-if="!IsResult && !IsAbout">Résultats</button></a>
    <a href="#/about" v-if="!IsAbout"><button v-if="!IsAbout">À propos</button></a>
  </nav>
  <div v-if="isLoading">Chargement des séries...</div>
  <div v-else>
    <keep-alive>
      <component :is="currentView" :series="series" v-model:sliders="sliders" />
    </keep-alive>
  </div>
  <footer class="fixed_footer">
    <div class="content">
      <p>projet réalisé en partenaria avec :</p>
      <a href="https://www.cnrs.fr/fr" target="Fenêtre définie"><img src="CNRS.png" alt="logo du CNRS" /></a>
      <a href="https://isjps.pantheonsorbonne.fr/" target="Fenêtre définie"><img src="ISJPS.png" alt="logo du ISJPS" /></a>
      <a href="https://jfli.cnrs.fr/" target="Fenêtre définie"><img src="logo-jfli.png" alt="logo du JFLI" /></a>
    </div>
  </footer>
</template>

<style>
nav button {
  text-decoration: none;
  text-transform: uppercase;
  font-family: 'Special Gothic Expanded One', 'Times New Roman', Times, serif;
  font-weight: auto;
  font-size: auto;
  height: 100%;
  width: 100%;
  size:100%;
  display: inline-block;
  position: relative;
  text-align: center;
  color: #00c7ec;
  border:1px solid #00c7ec;
  border-radius: 15px;

  line-height: 1.5em;
  box-shadow: 0 0 0 0 transparent;

  @include transition(all 0.2s ease-in);

  &:hover {
    color: white;
    box-shadow: 0 0 30px 0 transparentize(#00c7ec, 0.5);
    background-color:#00c7ec;

    @include transition(all 0.5s ease-out);

    &:before {
      @include animation(shine 0.5s 0s linear);
    }
  }

  &:active {
    box-shadow: 0 0 0 0 transparent;
    @include transition(box-shadow 0.2s ease-in);
  }

  &:before {
    content: '';
    display: block;
    width: 0px;
    height: 86%;
    position: absolute;
    top: 7%;
    left: 0%;

    opacity: 0;
    background: white;
    box-shadow: 0 0 15px 3px white;
    @include transform(skewX(-20deg));
  }
}
html.dark button{
  background:#443b3d;
  color: rgb(127, 150, 255);
}
html.dark {
  background:#111;
  color: rgb(127, 150, 255);
}
html.dark nav button{
  color:rgb(127, 150, 255);
  background: #111;

  &:hover {
    color: black;
    box-shadow: 0 0 30px 0 transparentize(#00c7ec, 0.5);
    background-color:#00c7ec;
  }
}
@include keyframes(shine) {
  from {
    opacity: 0;
    left: 0%;
  }

  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
    left: 100%;
  }
}

  html, body{
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    padding: 0;
    font-family:'Times New Roman', Times, serif;
    background-color:#fff0f0;
    ;
    color: #34495e;
    box-sizing: border-box;
  }
  html.dark body{
    background-color: #000;
    color: rgb(127, 150, 255);
  }
  h1{
    text-align: center;
    text-decoration: underline;
    font-variant: small-caps;
    margin: 0;
    padding:0;
    width: 100%;
    text-anchor: middle;
  }

  div.top{
    text-align: center;
    text-decoration: underline;
    font-variant: small-caps;
    margin: 0;
    padding:0;
    font-size:40px;
    width: 100%;
    background-color: #fff;
    border-bottom: 0.5px solid #34495e;
    margin-top:0;
    margin-left: 5px;
  }

  html.dark div.top{
    background-color: #000;
    color : rgb(127, 150, 255);
  }
  h2{
    background-color: #fff0f0;
    color:#000;
    text-align: center;
    text-decoration: underline;
    margin:0;
    font-size: 30px;
    text-anchor: middle;
  }
  html.dark h2{
    background-color: #1E2235;
    color: rgb(127, 150, 255);
  }
  .fixed_footer{
  width: 100%;
  height: 350px;
  background: #111;
}
   .fixed_footer p{
    color: #696969;
    column-count: 2;
    column-gap: 50px;
    font-size: 1em;
    font-weight: 300;
  }
  nav{
    background-color: #fff;
    margin-right: 0%;
    margin-left: 0%;
    display: -ms-flex;
    display: -webkit-flex; 
    display: flex;
    border-bottom:1px solid #111 ;
    padding: 0px 0px;
    font-size: 1em;
    cursor: pointer;
  }
  html.dark nav{
    background-color: #000;
    border-bottom: #00c7ec;
  }
  nav a{
    flex:1;
    text-align: center;
    font-size: 2em;
  }
  .fixed_footer img {
    padding: 5px;
    width: 150px;
    align-items: center;
    justify-content: center;
  }

  .title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px; /* Espacement entre le titre et le bouton */
}

.dark-mode-toggle {
  padding: 10px 20px;
  font-size: 1em;
  border: 1px solid #00c7ec;
  border-radius: 5px;
  background-color: #fff;
  color: #00c7ec;
  cursor: pointer;
  
  transition: all 0.3s ease;
}
.dark-mode-toggle button{
  text-decoration: none;
}


.dark-mode-toggle:hover {
  background-color: #00c7ec;
  color: #fff;
}

html.dark .dark-mode-toggle {
  background-color: #443b3d;
  color: rgb(127, 150, 255);
}

html.dark .dark-mode-toggle:hover {
  background-color: rgb(127, 150, 255);
  color: #443b3d;
}

/* Responsive pour le header et la nav */
@media (max-width: 900px) {
  .title-container {
    flex-direction: column;
    gap: 10px;
    font-size: 1.2em;
  }
  div.top {
    font-size: 28px;
    padding: 10px 0;
  }
  nav {
    flex-direction: column;
    font-size: 1em;
    padding: 0;
  }
  nav a {
    font-size: 1.2em;
    padding: 8px 0;
    width: 100%;
    display: block;
  }
  .dark-mode-toggle {
    width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 600px) {
  .title-container {
    flex-direction: column;
    gap: 6px;
    font-size: 1em;
  }
  div.top {
    font-size: 20px;
    padding: 6px 0;
  }
  nav {
    flex-direction: column;
    font-size: 0.95em;
    padding: 0;
  }
  nav a {
    font-size: 1em;
    padding: 6px 0;
    width: 100%;
    display: block;
  }
  .dark-mode-toggle {
    width: 100%;
    margin: 0 auto;
    font-size: 0.95em;
    padding: 8px 0;
  }
}
</style>