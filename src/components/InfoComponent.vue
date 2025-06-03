<script setup>
import { useMainStore } from '@/stores/main.store.js'
import { useWebsitesStore } from '@/stores/websites.store.js'

const mainStore = useMainStore()
const websiteStore = useWebsitesStore()
const appVersion = __APP_VERSION__
</script>

<template>
  <dl class="info">
    <template v-if="mainStore.env">
      <dt data-qa="env">Environment</dt>
      <dd>{{ mainStore.env }}</dd>
    </template>

    <template v-if="mainStore.commit">
      <dt data-qa="commit">Commit</dt>
      <dd>
        <a
          :href="`https://github.com/dyaroman/wla-vue/commit/${mainStore.commit}`"
          target="_blank"
          rel="noreferrer"
          >{{ mainStore.commit.substring(0, 8) }}</a
        >
      </dd>
    </template>

    <template v-if="mainStore.timestamp">
      <dt data-qa="timestamp">Last updated</dt>
      <dd>
        {{ mainStore.timestamp.split(' ')[0] }} <br />{{
          mainStore.timestamp.split(' ').slice(1).join(' ')
        }}
      </dd>
    </template>

    <template v-if="websiteStore.initialItems">
      <dt data-qa="websites-number">Websites</dt>
      <dd>{{ websiteStore.initialItems.length }}</dd>
    </template>

    <dt data-qa="version">Version</dt>
    <dd>
      <a href="./CHANGELOG.md" target="_blank">{{ appVersion }}</a>
    </dd>
  </dl>

  <!--  todo: where place copy buttons?-->
</template>
