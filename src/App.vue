<script setup>
import { ref, computed } from 'vue'

import Home from './Home.vue'
import AboutReco from './AboutReco.vue'
import NotFound from './NotFound.vue'
import SelectionPuissance from './SelectionPuissance.vue'
import Resultat from './Result.vue'
import { useDark, useToggle } from '@vueuse/core'

const isdark = useDark()
const toggleDark = useToggle(isdark)

const routes = {
  '/': Home,
  '/aboutReco': AboutReco,
  '/SelectionPuissance': SelectionPuissance,
  '/Resultat': Resultat,
  '/AboutReco': AboutReco
}

const currentPath = ref(window.location.hash)

let HomeB = true
let PuissanceB = false
let AboutRecoB = false

// Fonction pour synchroniser les variables avec le chemin actuel
const updateNavigationState = () => {
  HomeB = window.location.hash === "#/";
  PuissanceB = window.location.hash === "#/SelectionPuissance";
  AboutRecoB = window.location.hash === "#/AboutReco";
};

// Redirige vers Home si le chemin est vide ou invalide
if (!currentPath.value || !routes[currentPath.value.slice(1)]) {
  window.location.hash = '#/';
  currentPath.value = '#/';
}

// Initialisation de l'état de navigation
updateNavigationState();

window.addEventListener('hashchange', () => {
  if (!window.location.hash || !routes[window.location.hash.slice(1)]) {
    window.location.hash = '#/';
  }
  currentPath.value = window.location.hash;
  updateNavigationState(); // Met à jour l'état de navigation après un changement de hash
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});
</script>
<template>
  <div class="top">
    <div class="title-container">
      <a href="https://www.cnrs.fr/fr" target="Fenêtre définie" ><img src="CNRS.png" alt="Logo du CNRS" style="max-width: 100px; max-height: 100px; top: 10px; left: 10px;" /></a>
      <h1>RECO+</h1>
      <button @click="toggleDark()" class="dark-mode-toggle">Mode Jour/Nuit</button>
    </div>
  </div>
    <nav>
        <a v-if="!HomeB" href="#/"><button v-if="!HomeB">Catalogue </button></a>
        <a v-else href="#/SelectionPuissance"><button v-if="HomeB">puissance </button></a>
        <a v-if="HomeB | PuissanceB" href="#/Resultat"><button>Résultat </button></a>
        <a v-else href="#/SelectionPuissance"><button>puissance </button></a>
        <a v-if="!AboutRecoB" href="#/AboutReco" id="Home"><button >About Reco </button></a>

    </nav>
    <body>
        <keep-alive>
            <component :is="currentView" />
        </keep-alive>
    </body>
  <footer class="fixed_footer">
  <div class="content">
    <p>projet réalisé en partenaria avec :</p>
    <a href="https://www.cnrs.fr/fr" target="Fenêtre définie"><img src="CNRS.png" alt="logo du CNRS"/></a>
    <a href="https://isjps.pantheonsorbonne.fr/" target="Fenêtre définie"><img src="ISJPS.png" alt="logo du ISJPS"/></a>
    <a href="https://jfli.cnrs.fr/" target="Fenêtre définie" ><img src="logo-jfli.png" alt="logo du JFLI"/></a>
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

  line-height: 3em;
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
</style>