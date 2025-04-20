<script setup lang="ts">
import { ref } from 'vue'

const texts = [
  `Our worlds are changed. I feel it in the water. I feel it in the earth.
   I smell it in the air. Much that once was said is lost, for none now live who want to remember it.
   <br> <span style="text-shadow: 0 0 1px white">Inspire</span> me then, inspire me now.`,

  `I remember the time, I remember <b style="text-shadow: 0 0 1px white">inspiration</b> sewn together with twine.
   <br> And when it comes clear, I will be waiting right here.`,

  `Пообіцяй мені, пообіцяй мені, що завжди горітиме <span style="text-shadow: 0 0 1px white">натхнення</span> в твоєму вікні.
   <br> Пообіцяй мені, хай навіть не збудеться, що "завтра" негайно і невідворотньо відбудеться!`,

  `Give me hope and give me doubt.
   <br> You <span style="text-shadow: 0 0 1px white">inspire</span> me then, <span style="text-shadow: 0 0 1px white">inspire</span> me now.`,

  `Річ одну ти знати повинна: Ні на що це зовсім не схоже
<br> <span style="text-shadow: 0 0 1px white">Натхнення</span> немов маленька дитина, що без тебе жити не може`,
]

const quote = ref('')

const updateQuote = () => {
  let newQuote
  do {
    newQuote = texts[Math.floor(Math.random() * texts.length)]
  } while (newQuote === quote.value && texts.length > 1)
  quote.value = newQuote
}
</script>

<template>
  <footer class="footer" @mouseenter="updateQuote">
    <span class="quote" v-html="quote"></span>
    <span class="brand">inspire.tech, 2025</span>
  </footer>
</template>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: center;
  z-index: 100;
}

.brand {
  font-size: 0.9rem;
  opacity: 0.5;
}

.quote {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  max-width: 90%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.footer:hover .quote {
  opacity: 1;
}
</style>
