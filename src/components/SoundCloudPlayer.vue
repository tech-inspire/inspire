<template>
  <div>
    <iframe
      ref="iframe"
      width="100%"
      height="120"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      :src="iframeSrc"
    ></iframe>

    <div v-if="volumeControl && isReady" class="volume-control">
      <!--      <label for="volume">Volume</label>-->
      <input id="volume" type="range" min="0" max="100" v-model="volume" @input="updateVolume" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
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

const emit = defineEmits(['loaded', 'playback-change', 'error'])

const isReady = ref(false)
const isPlaying = ref(false)
const volume = ref(props.startVolume)
const iframe = ref(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let widget: any = null

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

const updateVolume = () => {
  if (!widget) return
  widget.setVolume(volume.value)
}

const playPause = () => {
  if (!widget) return
  widget.isPaused((paused: boolean) => {
    if (paused) {
      widget.play()
    } else {
      widget.pause()
    }
  })
}

interface Sound {
  title: string
  user?: {
    username: string
  }
  permalink_url: string
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://w.soundcloud.com/player/api.js'
  script.onload = () => {
    // @ts-expect-error: SoundCloud API has no TS types
    widget = window.SC.Widget(iframe.value)

    // @ts-expect-error: SoundCloud API has no TS types
    widget.bind(window.SC!.Widget.Events.READY, () => {
      widget.getCurrentSound((sound: Sound | null) => {
        if (sound && sound.title) {
          emit('loaded', {
            title: sound.title,
            artist: sound.user?.username,
            permalinkUrl: sound.permalink_url,
          })
        } else {
          console.warn('Failed to load SoundCloud track:', sound)
          emit('error', 'SoundCloud track could not be loaded. Check the URL.')
          return
        }
      })

      // @ts-expect-error: SoundCloud API has no TS types
      widget.bind(window.SC.Widget.Events.PLAY, () => {
        isPlaying.value = true
        emit('playback-change', true)
      })

      // @ts-expect-error: SoundCloud API has no TS types
      widget.bind(window.SC.Widget.Events.PAUSE, () => {
        isPlaying.value = false
        emit('playback-change', false)
      })

      isReady.value = true
      volume.value = props.startVolume
      widget.setVolume(props.startVolume)

      if (props.startTime > 0) {
        widget.seekTo(props.startTime)
      }

      if (props.autoPlay) {
        widget.play()
      }
    })
  }

  document.head.appendChild(script)
})

defineExpose({
  playPause,
  isPlaying,
})
</script>

<style scoped>
.volume-control {
  width: 25%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 8px;
  padding: 0 0.5rem;
  font-size: 0.9rem;
  color: #ddd;
  font-family: sans-serif;
}

.volume-control label {
  white-space: nowrap;
  font-weight: 500;
}

.volume-control input[type='range'] {
  flex-grow: 1;
  appearance: none;
  height: 4px;
  background: #ccc;
  border-radius: 2px;
  cursor: pointer;
  outline: none;
  transition: background 0.2s;
}

.volume-control input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #888;
  transition: background 0.2s;
}

.volume-control input[type='range']::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #000000;
}
</style>
