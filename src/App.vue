<script setup>
import { ref, computed } from 'vue'

import Home from './Home.vue'
import AboutReco from './AboutReco.vue'
import NotFound from './NotFound.vue'
import SelectionPuissance from './SelectionPuissance.vue'
import Resultat from './Result.vue'

const routes = {
  '/': Home,
  '/aboutReco': AboutReco,
  '/SelectionPuissance': SelectionPuissance,
  '/Resultat': Resultat
}
const currentPath = ref(window.location.hash)
let HomeB=true
let ResultatB=false
let PuissanceB=false
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
    HomeB=window.location.hash =="#/"
    ResultatB=window.location.hash =="#/Resultat"
    PuissanceB=window.location.hash =="#/SelectionPuissance"
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})


</script>
<template>
    <h1 v-if="ResultatB">Résultat</h1>
    <h1 v-else-if="PuissanceB">Puissance</h1>
    <h1 v-else-if="HomeB">Catalogue</h1>
    <h1 v-else>Pas normal</h1>
    <nav>
        <a v-if="!HomeB" href="#/"><button v-if="!HomeB"  id="Home">Catalogue </button></a>
        <a v-else href="#/SelectionPuissance"><button v-if="HomeB" id="Home">puissance </button></a>|
        <a v-if="!ResultatB" href="#/Resultat"><button v-if="!ResultatB"  id="Home">Résultat </button></a>
        <a v-else href="#/SelectionPuissance"><button v-if="ResultatB" id="Home">puissance </button></a>|
        <a href="#/non-existent-path" id="Broken"><button id="Home">Broken </button></a> |
  
    </nav>
    <body>
        <keep-alive>
            <component :is="currentView" />
        </keep-alive>
    </body>
  <footer class="fixed_footer">
  <div class="content">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis ducimus nemo quo totam neque quis soluta nisi obcaecati aliquam saepe dicta adipisci blanditiis quaerat earum laboriosam accusamus nesciunt! Saepe ex maxime enim asperiores nisi. Obcaecati nostrum nobis laudantium aliquam commodi veniam magni similique ullam quis pariatur voluptatem harum id error.</p>
    <img src="assets/CNRS.png"/>
    <img src="assets/ISJPS.png"/>
    <img src="assets/logo-jfli.png"/>
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

html{
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
}
h1{
    background-color: #aa9d9f;
    font-size: 3em;
    text-align: center;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;

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
  h2{
    color:darkgreen;
  }
  nav{
    background-color: #605252;
    margin-right: 0%;
    margin-left: 0%;
    display: -ms-flex;
    display: -webkit-flex; 
    display: flex;
  }
  nav a{
    flex:1;
    text-align: center;
    font-size: 2em;
  }
</style>