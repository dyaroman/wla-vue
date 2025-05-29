<script setup>
import LogoComponent from '@/components/LogoComponent.vue'
import CounterComponent from '@/components/CounterComponent.vue'
import ToggleButtonsPanel from '@/components/ToggleButtonsPanel.vue'
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header__content">
        <ToggleButtonsPanel position="left" />
        <div class="flex-row">
          <LogoComponent />
          <CounterComponent />
        </div>
        <ToggleButtonsPanel position="right" />
      </div>
    </div>
  </header>
</template>
