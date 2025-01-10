<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8 text-white">
        Top Hacker News Stories
      </h1>

      <div v-if="data" class="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-8 rounded-r-lg">
        <p class="text-yellow-200 text-sm">
          {{ data.info }}
        </p>
        <p class="text-yellow-200/60 text-xs mt-2">
          Execution time: {{ data.executionTime }}
        </p>
      </div>

      <div v-if="data?.top" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="story in data.top"
          :key="story.externalURL"
          class="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border border-gray-700"
        >
          <h2 class="text-xl font-semibold mb-4">
            <a
              :href="story.externalURL"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              {{ story.title }}
            </a>
          </h2>
          <div class="flex items-center space-x-4 text-sm">
            <span class="px-3 py-1 bg-blue-500/10 rounded-full text-blue-300 flex items-center gap-1">
              <span class="text-yellow-400">⭐</span>
              {{ story.points }} points
            </span>
            <span class="text-gray-400">
              by <span class="text-gray-300">{{ story.by }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('top-5-hn', () => $fetch('/api/top-5-hn'))
</script>
