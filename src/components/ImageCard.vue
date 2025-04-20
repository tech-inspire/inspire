<template>
  <div class="image-card" @click="selectImage">
    <img :src="imageSrc" alt="Image" />
    <!--    <p>{{ similarityPercentage }}%</p>-->
    <!-- Example -->
    <p>Similarity: {{ similarityPercentage }}%</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Image {
  image_path: string
  distance: number
}

export default defineComponent({
  name: 'ImageCard',
  props: {
    image: {
      type: Object as PropType<Image>,
      required: true,
    },
  },
  computed: {
    imageSrc(): string {
      return `http://localhost:5004/get_image_by_path?image_path=${encodeURIComponent(this.image.image_path)}`
    },
    similarityPercentage(): string {
      return (100 - this.image.distance * 100).toFixed(2)
    },
  },
  methods: {
    selectImage() {
      this.$emit('select', this.image)
    },
  },
})
</script>

<style scoped>
.image-card {
  width: 420px;
  height: auto;
  padding: 20px;
  background-color: #f9f9f9;
  font-family: 'Merchant Copy', monospace;
  color: #111;
  //border: 2px dashed #333;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.image-card:hover {
  transform: scale(1.02);
}

.image-card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: 12px;
  border-radius: 4px;
}

@font-face {
  font-family: 'Merchant Copy Doublesize';
  src: url('/merchant-copy/merchant-copy-doublesize.ttf');
}

.image-card p {
  font-family: 'San Francisco';
  font-size: 1rem;
  color: #111;
  //margin-top: 0.5rem;
  //white-space: pre-wrap;
}
</style>
