<script setup>
import {onMounted, ref} from 'vue';

import WaveSurfer from 'wavesurfer.js'
import records from './../../assets/records.json'

onMounted(() => {
  console.log(localStorage.getItem('recordings'))
})

let wavesurfer = null;
const currentTime = ref('00:00');
const duration = ref('00:00');
const currentFile = ref({});
const isPlaying = ref(false);

const inItWaveSurfer = (file) => {
  if (wavesurfer) {
    wavesurfer.destroy();
  }
  currentFile.value.name = file.name;
  currentFile.value.created_at = file.created_at;
  wavesurfer = WaveSurfer.create({
    container: '#wave-surfer',
    waveColor: 'rgba(149,117,243,0.4)',
    progressColor: 'rgba(99,87,138,0.4)',
    url: file.path,
    autoplay: true,
  });

  wavesurfer.on('ready', () => {
    duration.value = formatTime(wavesurfer.getDuration());
    isPlaying.value = true
  });

  wavesurfer.on('audioprocess', () => {
    currentTime.value = formatTime(wavesurfer.getCurrentTime());
  });

  wavesurfer.on('play', () => {
    isPlaying.value = true;
  });

  wavesurfer.on('pause', () => {
    isPlaying.value = false;
  });

  wavesurfer.on('finish', () => {
    currentTime.value = formatTime(wavesurfer.getDuration());
    isPlaying.value = false;
  });
};
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const playPause = () => {
  if (wavesurfer) {
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
    } else {
      wavesurfer.play();
    }
    isPlaying.value = wavesurfer.isPlaying();
  }
}

</script>

<template>
  <Component :is="$route.meta.layout">

    <!-- Search bar and Create New button -->
    <div class="flex justify-between items-center mb-6">
      <div class="relative w-[88%]">
        <input class="border rounded-lg p-2 pl-10 w-full" placeholder="Search Recordings" type="text"/>
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"></path>
          </svg>
        </div>
      </div>
      <router-link to="/voices/create" class="bg-indigo-500 text-white px-4 py-2 rounded-lg">Create New</router-link>
    </div>

    <!-- Your recordings section -->
    <div>
      <div class="text-xl font-semibold mb-4">Your recordings</div>

      <!-- Current recording -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center mb-2">
          <div v-if="wavesurfer" class="border-2 border-black text-black rounded-full w-10 h-10 flex items-center justify-center mr-4">

            <span class="text-2xl" v-on:click="playPause">
              <svg v-if="!isPlaying" aria-hidden="true" class="w-6 h-6 text-black" fill="currentColor" height="24"
                   viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                      fill-rule="evenodd"/>
              </svg>
              <svg v-if="isPlaying" aria-hidden="true" class="w-6 h-6 text-black" fill="currentColor" height="24"
                   viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" d="M6 6h3v12H6V6Zm9 0h3v12h-3V6Z" fill-rule="evenodd"/>
              </svg>
            </span>


<!--            <span class="text-2xl">-->
<!--              <svg aria-hidden="true" class="w-6 h-6 text-black" fill="currentColor" height="24"-->
<!--                   viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">-->
<!--                  <path clip-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"-->
<!--                        fill-rule="evenodd"/>-->
<!--                </svg>-->
<!--            </span>-->
          </div>
          <div>
            <div class="text-lg font-semibold">{{ currentFile.name }}</div>
            <div class="text-gray-500">{{ currentFile.created_at }}</div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <button class="bg-indigo-500 text-white px-4 py-2 rounded-lg">Transcribe</button>
          <button class="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
        </div>
        <div class="mt-4">

          <div id="wave-surfer"></div>

          <div class="flex justify-between text-gray-500 text-sm mt-2">
            <span>{{ currentTime }} / {{ duration }}</span>
          </div>
        </div>
      </div>

      <!-- Recordings list -->
      <div class="space-y-4">
        <div v-for="record in records" class="bg-indigo-200 rounded-lg p-4 flex justify-between items-center">
          <div class="flex items-center">
            <div class="border-2 border-black text-black rounded-full w-10 h-10 flex items-center justify-center mr-4">
              <span class="text-2xl" v-on:click="inItWaveSurfer(record)">
                <svg aria-hidden="true" class="w-6 h-6 text-black" fill="currentColor" height="24"
                     viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                        fill-rule="evenodd"/>
                </svg>
              </span>
            </div>
            <div>{{ record.name }}</div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="bg-indigo-500 text-white px-4 py-2 rounded-lg">Transcribe</button>
            <div>{{ record.created_at }}</div>
            <div>{{ record.duration }}</div>
            <button class="border-2 border-black text-black rounded-full hover:text-red-500">
              <svg aria-hidden="true" class="w-6 h-6 border-black" fill="none" height="24"
                   viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18 17.94 6M18 18 6.06 6" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Component>
</template>

<style scoped>

</style>
