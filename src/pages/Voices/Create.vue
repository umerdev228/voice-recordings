<script setup>
import {onMounted, ref} from 'vue';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'
import records from "../../assets/records.json";

const recordingTime = ref('00:00 / 00:10');
const recordings = ref([]);
const isRecording = ref(false);
let wavesurfer, record;

const loadRecordings = () => {
  const storedRecordings = JSON.parse(localStorage.getItem('recordings')) || [];
  recordings.value = storedRecordings;
};

const saveRecording = (recording) => {
  recordings.value.push(recording);
  localStorage.setItem('recordings', JSON.stringify(recordings.value));
};

const toggleRecording = () => {
  if (wavesurfer.isPlaying()) {
    wavesurfer.pause();
  }

  if (record.isRecording()) {
    record.stopRecording();
    isRecording.value = false
    return;
  }

  if (!record.isRecording()) {
    record.startRecording().then(() => {
    });
  }

};

onMounted(() => {
  wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'rgba(149,117,243,0.4)',
    progressColor: 'rgba(99,87,138,0.4)',
    plugins: [
      RecordPlugin.create({
        // Configure your plugin options
      }),
    ],
  });

  record = wavesurfer.registerPlugin(RecordPlugin.create());

  record.on('record-end', (blob) => {
    isRecording.value = false
    const url = URL.createObjectURL(blob);
    const recording = {
      path: url,
      name: 'Recording ' + recordings.value.length + 1,
      duration: formatDuration(record.getDuration()),
      date: new Date().toISOString(),
    };
    saveRecording(recording);
    console.log('record-end', blob)
  });

  record.on('record-start', (data) => {
    isRecording.value = true
    console.log('record-start', data)
  });
    loadRecordings();
});


const formatDuration = (duration) => {
  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor((duration % 3600) / 60);
  const hours = Math.floor(duration / 3600);

  const paddedSeconds = seconds.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedHours = hours.toString().padStart(2, '0');

  return hours > 0
      ? `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
      : `${paddedMinutes}:${paddedSeconds}`;
};
</script>

<template>
  <Component :is="$route.meta.layout">
    <!-- Search bar and Add script button -->
    <div class="flex justify-between items-center mb-6">
      <div class="relative w-[90%]">
        <input type="text" placeholder="Search Recordings" class="border rounded-lg p-2 pl-10 w-full"/>
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
      <button class="bg-indigo-500 text-white px-4 py-2 rounded-lg">Add script</button>
    </div>

    <!-- Recordings section -->
    <div class="text-xl font-semibold mb-4">Your recordings</div>

    <!-- Recording and Upload section -->
    <div class="space-y-6">
      <!-- Start Recording -->
      <div class="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <div class="text-gray-500">Start Recording</div>
        <button @click="toggleRecording"
                class="mt-4 border-2 border-black dark:border-white text-black rounded-full p-2"
                :class="{'bg-amber-300': isRecording}">
          <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 9v3a5.006 5.006 0 0 1-5 5h-4a5.006 5.006 0 0 1-5-5V9m7 9v3m-3 0h6M11 3h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/>
          </svg>
        </button>
        <div class="text-gray-500 mt-2">{{ recordingTime }}</div>
        <div id="waveform" class="mt-4"></div>
      </div>

      <div class="text-center text-gray-500">Or</div>

      <!-- Drag and Drop Upload -->
      <div class="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
        <div class="text-gray-500">Drag and Drop File Here to Upload</div>
        <button class="mt-4">
          <i class="fa fa-upload text-4xl text-gray-500"></i>
        </button>
        <div class="text-gray-500 mt-2">or select file to upload</div>
        <div class="text-gray-500 mt-2 text-xs">Supported Formats: mp3, m4a, caf, wav, aiff, flv, mp4 & mov</div>
      </div>

      <div class="text-center text-gray-500 mt-8">
        <div class="text-lg">You have no recordings yet</div>
        <div>Start by making a recording.</div>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Recorded Files</h2>
      <div class="space-y-4">
        <div v-for="record in recordings" class="bg-indigo-200 rounded-lg p-4 flex justify-between items-center">
          <div class="flex items-center">
            <div class="border-2 border-black text-black rounded-full w-10 h-10 flex items-center justify-center mr-4">
              <span class="text-2xl">
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

    <button class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">Cancel</button>
  </Component>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
