<script setup>
import { ref, computed } from 'vue'

import Home from './Home.vue'
import AboutReco from './AboutReco.vue'
import NotFound from './NotFound.vue'
import SelectionPuissance from './SelectionPuissance.vue'
import Resultat from './Result.vue'
import {useDark, useToggle} from '@vueuse/core'
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
let HomeB=true
let ResultatB=false
let PuissanceB=false
let AboutRecoB= false
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  HomeB = window.location.hash === "#/";
  ResultatB = window.location.hash === "#/Resultat";
  PuissanceB = window.location.hash === "#/SelectionPuissance";
  AboutRecoB = window.location.hash === "#/AboutReco";
  return routes[currentPath.value.slice(1) || "/"] || NotFound;
});


</script>
<template>
  <div class="top">
    <div class="title-container">
      <img src="CNRS.png" alt="Logo du CNRS" style="max-width: 100px; max-height: 100px; top: 10px; left: 10px;" />
      <h1 v-if="ResultatB">Résultat</h1>
      <h1 v-else-if="PuissanceB">Puissance</h1>
      <h1 v-else-if="HomeB">Catalogue</h1>
      <h1 v-else>Catalogue</h1>
      <button @click="toggleDark()" class="dark-mode-toggle">Mode Jour/Nuit</button>
    </div>
  </div>
    <nav>
        <a v-if="!HomeB" href="#/"><button v-if="!HomeB"  id="Home">Catalogue </button></a>
        <a v-else href="#/SelectionPuissance"><button v-if="HomeB" id="Home">puissance </button></a>|
        <a v-if="!ResultatB" href="#/Resultat"><button v-if="!ResultatB"  id="Home">Résultat </button></a>
        <a v-else href="#/SelectionPuissance"><button v-if="ResultatB" id="Home">puissance </button></a>|
        <a v-if="!AboutRecoB" href="#/AboutReco" id="Home"><button id="Home">About Reco </button></a>

    </nav>
    <body>
        <keep-alive>
            <component :is="currentView" />
        </keep-alive>
    </body>
  <footer class="fixed_footer">
  <div class="content">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis ducimus nemo quo totam neque quis soluta nisi obcaecati aliquam saepe dicta adipisci blanditiis quaerat earum laboriosam accusamus nesciunt! Saepe ex maxime enim asperiores nisi. Obcaecati nostrum nobis laudantium aliquam commodi veniam magni similique ullam quis pariatur voluptatem harum id error.</p>
    <img src="CNRS.png"/>
    <img src="ISJPS.png"/>
    <img src="logo-jfli.png"/>
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

    @include transition(all 0.2s ease-out);

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
  color: aquamarine;
}
html.dark {
  background:#111;
  color: aquamarine;
}
html.dark nav button{
  color:aquamarine;
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
    background-color: #fae7e7;
    color: #34495e;
    box-sizing: border-box;
  }
  html.dark body{
    background-color: #111;
    color: aquamarine;
  }
  h1{
    text-align: center;
    text-decoration: underline;
    font-variant: small-caps;
    margin: 0;
    padding:0;
    width: 100%;
  }

  div.top{
    text-align: center;
    text-decoration: underline;
    font-variant: small-caps;
    margin: 0;
    padding:0;
    font-size:30px;
    width: 100%;
    background-color: #d0c8ca;
    margin-top:0;
  }

  html.dark div.top{
    background-color: #111;
    color : aquamarine;
  }
  h2{
    background-color: #a7a7be;
    color:#000;
    text-align: center;
    text-decoration: underline;
  }
  html.dark h2{
    background-color: #1E2235;
    color: aquamarine;
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
    background-color: #9c9cc9;
    margin-right: 0%;
    margin-left: 0%;
    display: -ms-flex;
    display: -webkit-flex; 
    display: flex;
  }
  html.dark nav{
    background-color: rgb(91, 95, 104);
  }
  nav a{
    flex:1;
    text-align: center;
    font-size: 2em;
  }
  .fixed_footer img {
    padding: 5px;
    width: 150px;
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
div.dark-mode-toggle button{
  text-decoration: none;
}


.dark-mode-toggle:hover {
  background-color: #00c7ec;
  color: #fff;
}

html.dark .dark-mode-toggle {
  background-color: #443b3d;
  color: aquamarine;
}

html.dark .dark-mode-toggle:hover {
  background-color: aquamarine;
  color: #443b3d;
}
</style>