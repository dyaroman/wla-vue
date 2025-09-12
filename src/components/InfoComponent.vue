<script setup>
import { useMainStore } from '@/stores/main.store.js'
import { useWebsitesStore } from '@/stores/websites.store.js'

const mainStore = useMainStore()
const websitesStore = useWebsitesStore()
const appVersion = __APP_VERSION__
</script>

<template>
  <div class="info">
    <div class="info__row" v-if="mainStore.env">
      <div class="info__key" data-qa="env">Environment:</div>
      <div>{{ mainStore.env }}</div>
    </div>

    <div class="info__row" v-if="mainStore.commit">
      <div class="info__key" data-qa="commit">Commit:</div>
      <div>
        <a
          :href="`https://github.com/dyaroman/wla-vue/commit/${mainStore.commit}`"
          target="_blank"
          rel="noreferrer"
          >{{ mainStore.commit.substring(0, 8) }}</a
        >
      </div>
    </div>

    <div class="info__row" v-if="mainStore.timestamp">
      <div class="info__key" data-qa="timestamp">Last updated:</div>
      <div>{{ mainStore.timestamp }}</div>
    </div>

    <div class="info__row" v-if="websitesStore.initialItems">
      <div class="info__key" data-qa="websites-number">Websites:</div>
      <div>{{ websitesStore.initialItems.length }}</div>
    </div>

    <div class="info__row">
      <div class="info__key" data-qa="version">Version:</div>
      <div>
        <a href="./CHANGELOG.md" target="_blank">{{ appVersion }}</a>
      </div>
    </div>
  </div>

  <!--  todo: where place copy buttons? they should be in command palette -->
</template>
