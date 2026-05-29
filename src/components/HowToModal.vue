<script setup>
import ModalComponent from "@/components/ModalComponent.vue";
import { MODAL_ID } from "@/constants/modal.constants.js";
</script>

<template>
  <ModalComponent :id="MODAL_ID.HOW_TO" title="How to use">
    <div class="how-to">
      <section>
        <h3>Command palette</h3>
        <ul>
          <li>
            <code>Cmd/Ctrl + K</code> opens the palette. Type to filter,
            <code>↑</code>/<code>↓</code> to move, <code>Enter</code> to run.
          </li>
          <li>
            From it you can copy the visible websites (domains or urls), reset
            filters / tags / sort, and open the filters, tags, columns and info
            panels.
          </li>
        </ul>
      </section>

      <section>
        <h3>Table cell actions</h3>
        <ul>
          <li>
            <code>Alt</code> + click a cell – filter that column by the cell's
            value.
          </li>
          <li>
            <code>Cmd</code> / <code>⊞ Win</code> + click a cell – copy its
            value (color cells copy the hex).
          </li>
          <li>
            Click a column header to sort; click again to flip the direction.
          </li>
        </ul>
      </section>

      <section>
        <h3>Search operators</h3>
        <p>Inside any filter field:</p>
        <ul>
          <li>
            <code>==value</code> – exact match (e.g. <code>==sc</code> matches
            only "sc").
          </li>
          <li>
            <code>!=value</code> – exclude matches (e.g. <code>!=sc</code> hides
            "sc").
          </li>
          <li>anything else – partial match.</li>
        </ul>
      </section>

      <section>
        <h3>Tags</h3>
        <p>
          Each tag has three states – click to cycle: ignore → include →
          exclude. Included tags must all be present; excluded tags must all be
          absent.
        </p>
      </section>
    </div>
  </ModalComponent>
</template>

<style scoped>
.how-to section + section {
  margin-top: var(--gap-double);
}

.how-to h3 {
  margin: 0 0 var(--gap);
}

.how-to ul {
  margin: 0;
  padding-left: var(--gap-double);
}

.how-to li + li {
  margin-top: var(--gap-half);
}

.how-to code {
  padding: 0 var(--gap-half);

  border: var(--border-width) solid var(--border-color);

  white-space: nowrap;
}
</style>
