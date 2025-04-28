<template>
    <h2> personalisation des critères</h2>
    <ul>
        <li>couleur</li>
        <input type="range" id="couleur" min="0" max="100" value="40" step="5" />
        <li>sénario</li>
        <input type="range" id="sénario" min="0" max="100" value="40" step="5" />
        <li>exemple</li>
        <input type="range" id="exemple" min="0" max="100" value="40" step="5" />
    </ul>
</template>
<script>
for (let e of document.querySelectorAll('input[type="range"]')) {
  e.style.setProperty('--value', e.value);
  e.style.setProperty('--min', e.min == '' ? '0' : e.min);
  e.style.setProperty('--max', e.max == '' ? '100' : e.max);
  e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
</script>
<style>
 input[type="range"] {
    appearance: auto;
    color: #ef233c;
    --thumb-height: 1.125em;
    --track-height: 0.125em;
    --track-color: rgba(255, 255, 255, 0.1);
    --brightness-hover: 180%;
    --brightness-down: 80%;
    --clip-edges: 0.125em;
  }
  input[type="range"] {
    font-size: 1.5rem;
    width: 12.5em;
  }
</style>
