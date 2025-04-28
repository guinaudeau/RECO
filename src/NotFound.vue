<script setup></script>
<template>
  <h2>404 Not Found</h2>
  <p>The page you are looking for does not exist.</p>
  <p>Please check the URL or return to the <a href="#/">home page</a>.</p>
  <div class="wrapper">
  <a href="#"><span>Hover Me!</span></a>
</div>
</template>
<style>
div.wrapper a{
  display: block;
  width: 200px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  font-family: sans-serif;
  text-decoration: none;
  color: #333;
  border: 2px solid #333;
  letter-spacing: 2px;
  text-align: center;
  position: relative;
  transition: all .35s;
}

.wrapper a span{
  position: relative;
  z-index: 2;
}

.wrapper a:after{
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: aquamarine;
  transition: all .35s;
}
.wrapper a:hover{
  color: #fff;
}

.wrapper a:hover:after{
  width: 100%;
}


</style>