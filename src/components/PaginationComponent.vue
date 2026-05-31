<script setup>
import CounterComponent from "@/components/CounterComponent.vue";
import { usePaginationStore } from "@/stores/pagination.store.js";
import { PER_PAGE_VALUES } from "@/constants/misc.constants.js";

const paginationStore = usePaginationStore();
</script>

<template>
  <div class="container">
    <div class="pagination">
      <div class="pagination__per-page">
        Rows per page:
        <div class="select-wrapper">
          <select
            name="per-page"
            class="select"
            data-qa="per-page"
            v-model="paginationStore.perPage"
          >
            <option v-for="value in PER_PAGE_VALUES" :key="value" :value>
              {{ value }}
            </option>
          </select>
        </div>
      </div>

      <CounterComponent />

      <div
        class="pagination__buttons"
        role="navigation"
        aria-label="pagination"
      >
        <button
          class="btn btn--small"
          aria-label="first page"
          data-qa="first-page"
          :disabled="paginationStore.currentPage === 1"
          @click="paginationStore.currentPage = 1"
        >
          &lt;&lt;
        </button>

        <button
          class="btn btn--small"
          aria-label="previous page"
          data-qa="prev-page"
          :disabled="paginationStore.currentPage === 1"
          @click="
            paginationStore.currentPage = Math.max(
              paginationStore.currentPage - 1,
              1,
            )
          "
        >
          &lt;
        </button>

        <span aria-live="polite" aria-atomic="true" data-qa="current-page"
          >{{ paginationStore.currentPage }}/{{
            paginationStore.totalPages
          }}</span
        >

        <button
          class="btn btn--small"
          aria-label="next page"
          data-qa="next-page"
          :disabled="paginationStore.currentPage === paginationStore.totalPages"
          @click="
            paginationStore.currentPage = Math.min(
              paginationStore.currentPage + 1,
              paginationStore.totalPages,
            )
          "
        >
          &gt;
        </button>

        <button
          class="btn btn--small"
          aria-label="last page"
          data-qa="last-page"
          :disabled="paginationStore.currentPage === paginationStore.totalPages"
          @click="paginationStore.currentPage = paginationStore.totalPages"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>
