<script setup>
import { onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'

import { useDrawerStore } from '@/stores/drawer.store'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right', 'top', 'bottom'].includes(value),
  },
  maxSize: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: '',
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  closeOnBackdropClick: {
    type: Boolean,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
})

// Refs with proper typing
const drawerRef = ref(null)
const previouslyFocusedElement = ref(null)
const scrollPosition = ref(0)

const drawerStore = useDrawerStore()

const isOpen = computed(() => drawerStore.openDrawerId === props.id)

// Function to prevent body scrolling
const preventBodyScroll = () => {
  // Store current scroll position
  scrollPosition.value = window.pageYOffset

  // Add styles to body to prevent scrolling
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollPosition.value}px`
  document.body.style.width = '100%'
}

// Function to restore body scrolling
const restoreBodyScroll = () => {
  // Remove the styles preventing scroll
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''

  // Restore scroll position
  window.scrollTo(0, scrollPosition.value)
}

// Function to handle Tab key and trap focus
const handleTabKey = (event) => {
  if (!isOpen.value || !drawerRef.value) return

  const focusableElements = drawerRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  // If shifting backwards and on the first element, move to the last element
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  }
  // If moving forwards and on the last element, cycle to first element
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  }
}

// Enhanced ESC key handler
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && props.closeOnEsc && isOpen.value) {
    event.preventDefault()
    event.stopPropagation()
    drawerStore.openDrawerId = null
  } else if (event.key === 'Tab') {
    handleTabKey(event)
  }
}

// Watch for drawer open/close
watch(
  () => isOpen.value,
  (isOpen) => {
    if (isOpen) {
      // Store the currently focused element to restore focus later
      previouslyFocusedElement.value = document.activeElement

      // Prevent body scroll
      preventBodyScroll()

      // Focus the drawer after it's fully rendered
      nextTick(() => {
        drawerRef.value?.focus()
      })

      // Add keyboard event listener for focus trapping
      document.addEventListener('keydown', handleKeyDown)
    } else {
      // Restore body scroll
      restoreBodyScroll()

      // Remove keyboard event listener when drawer closes
      document.removeEventListener('keydown', handleKeyDown)

      // Return focus to the element that opened the drawer
      if (previouslyFocusedElement.value && 'focus' in previouslyFocusedElement.value) {
        nextTick(() => {
          previouslyFocusedElement.value.focus()
        })
      }
    }
  },
)

// Make sure to clean up on component unmount
onBeforeUnmount(() => {
  // Restore scrolling if component is unmounted while drawer is open
  if (isOpen.value) {
    restoreBodyScroll()
  }
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div
        v-if="isOpen"
        class="drawer-backdrop"
        @click="closeOnBackdropClick && (drawerStore.openDrawerId = null)"
      ></div>
    </Transition>
    <Transition :name="`drawer-slide-${position}`">
      <div
        v-if="isOpen"
        class="drawer"
        :class="`drawer--${position}`"
        :style="{
          maxHeight: position === 'top' || position === 'bottom' ? (maxSize ?? '50vh') : null,
          maxWidth: position === 'right' || position === 'left' ? (maxSize ?? '50vw') : null,
        }"
        ref="drawerRef"
        tabindex="-1"
        role="dialog"
        aria-labelledby="drawer-title"
      >
        <div v-if="showHeader" class="drawer__header">
          <h3 class="drawer__title" id="drawer-title">{{ title }}</h3>
          <button class="drawer__close" @click="drawerStore.openDrawerId = null" aria-label="Close">
            &times;
          </button>
        </div>
        <div class="drawer__content">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
