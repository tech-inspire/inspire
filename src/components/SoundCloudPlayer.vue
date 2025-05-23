<template>
  <div>
    <iframe
      ref="iframe"
      width="100%"
      height="100"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="iframeSrc"
    ></iframe>

    <div v-if="volumeControl" style="margin-top: 8px">
      <input id="volume" type="range" min="0" max="100" v-model="volume" @input="updateVolume" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  // trackId: {
  //   type: Number | null,
  //   required: false
  // },
  songUrl: {
    // example: "2kizz21090/chto-to-xrupkoe"
    type: String,
    required: true,
  },
  startTime: {
    type: Number,
    default: 0, // milliseconds
  },
  startVolume: {
    type: Number,
    default: 20, // %
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  volumeControl: {
    type: Boolean,
    default: false,
  },
})

const iframe = ref(null)

// https://developers.soundcloud.com/docs/api/html5-widget
const iframeSrc = computed(() => {
  const baseUrl = 'https://w.soundcloud.com/player/'

  // const trackUrl = `https://api.soundcloud.com/tracks/${props.trackId}`
  const trackUrl = `https://soundcloud.com/${props.songUrl}`

  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: 'false', // always false, use widget.play() if needed
    show_comments: 'false',
    show_user: 'true',
    show_reposts: 'false',
    show_teaser: 'false',
    sharing: 'false',
    show_playcount: 'false',
    show_artwork: 'false',
  })
  return `${baseUrl}?${params.toString()}`
})

let updateVolume = () => {}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://w.soundcloud.com/player/api.js'
  script.onload = () => {
    const widget = window.SC.Widget(iframe.value)

    widget.bind(window.SC.Widget.Events.READY, () => {
      if (props.startTime > 0) {
        widget.setVolume(props.startVolume)
        widget.seekTo(props.startTime)

        updateVolume = () => {
          widget.setVolume(volume.value)
        }
      }

      if (props.autoPlay) {
        widget.play()
      }
    })
  }

  document.head.appendChild(script)
})
</script>
