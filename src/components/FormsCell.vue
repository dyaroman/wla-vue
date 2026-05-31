<script setup>
import { useMainStore } from "@/stores/main.store.js";

defineProps({
  item: Object,
});

const mainStore = useMainStore();

function getFormUrl(name) {
  return `https://formsrequests${mainStore.env === "dev" ? ".route-inside" : ""}.com/${name}`;
}
</script>

<template>
  <ul>
    <li v-for="(pages, name) in item.forms" :key="name">
      <a :href="getFormUrl(name)" target="_blank">{{ name }}</a>
      <ul>
        <li v-for="(options, page) in pages" :key="page">
          <a :href="`https://${item.host}/${page}`" target="_blank">{{
            page
          }}</a>
          <ul>
            <li v-for="(value, option) in options" :key="option">
              <template v-if="option === 'primaryColor'"
                >{{ option }}: {{ value.toLowerCase() }}
              </template>
              <template v-else-if="option === 'loanAmounts'">
                {{ option }}:
                <ul>
                  <li v-for="loan in value" :key="loan[0]">
                    ["{{ loan[0] }}", "{{ loan[1] }}"]
                  </li>
                </ul>
              </template>
              <template v-else>{{ option }}: {{ value }}</template>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>
