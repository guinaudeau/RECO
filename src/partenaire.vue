<script>
</script>
<template>
<div class="partenaire">
  <h2>Partenaire</h2>
  <div class="content">
        <p>projet réalisé en partenaria avec :</p>
        <div class="pair">
            <h4> le CNRS</h4>
            <a href="https://www.cnrs.fr/fr" target="Fenêtre définie"><img src="CNRS.png" alt="logo du CNRS" /></a>
        </div>
        <div class="impair">
            <h4> l'ISJPS</h4>
            <a href="https://isjps.pantheonsorbonne.fr/" target="Fenêtre définie"><img src="ISJPS.png" alt="logo du ISJPS" /></a>
        </div>
        <div class="pair">
            <h4> le JFLI</h4>
            <a href="https://jfli.cnrs.fr/" target="Fenêtre définie"><img src="logo-jfli.png" alt="logo du JFLI" /></a>
        </div>
    <div>
</div>
</div>
</div>
</template>
<style>
img{
  max-width: 100%;
  height: auto;
}
a {
  font-size:20px;
  max-width:200px;
  height:auto;
  padding:0;
  display:inline-block;
  text-align:center;
  border-radius:50%;
  box-shadow:0 0 0 1px rgba(255,255,255,0.4);
  margin:0 8px;
  color:#fff;
  opacity:0.75;
}
a:hover {
  opacity:1;
  box-shadow:0 0 0 1px rgba(255,255,255,0.8);
}
div.pair {
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: space-evenly;
  margin-bottom: 20px;
}
div.impair{
  display: flex;
  flex-direction: row;
  align-items: right;
  justify-content: space-evenly;
  margin-bottom: 20px;
}
</style>