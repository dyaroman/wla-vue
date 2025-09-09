<script setup>
import { onBeforeUnmount, ref, watch, nextTick, computed } from 'vue'

import { useModalStore } from '@/stores/modal.store'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
  maxWidth: {
    type: String,
    default: null,
  },
  maxHeight: {
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
  persistent: {
    type: Boolean,
    default: false,
  },
})

// Refs with proper typing
const modalRef = ref(null)
const previouslyFocusedElement = ref(null)
const scrollPosition = ref(0)

const modalStore = useModalStore()

const isOpen = computed(() => modalStore.openModalId === props.id)

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
  if (!isOpen.value || !modalRef.value) return

  const focusableElements = modalRef.value.querySelectorAll(
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
  if (
    event.key === 'Escape' &&
    props.closeOnEsc &&
    isOpen.value &&
    !props.persistent
  ) {
    event.preventDefault()
    event.stopPropagation()
    modalStore.openModalId = null
  } else if (event.key === 'Tab') {
    handleTabKey(event)
  }
}

// Handle backdrop click
const handleBackdropClick = () => {
  if (props.closeOnBackdropClick && !props.persistent) {
    modalStore.openModalId = null
  }
}

// Watch for modal open/close
watch(
  () => isOpen.value,
  (isOpen) => {
    if (isOpen) {
      // Store the currently focused element to restore focus later
      previouslyFocusedElement.value = document.activeElement

      // Prevent body scroll
      preventBodyScroll()

      // Focus the modal after it's fully rendered
      nextTick(() => {
        modalRef.value?.focus()
      })

      // Add keyboard event listener for focus trapping
      document.addEventListener('keydown', handleKeyDown)
    } else {
      // Restore body scroll
      restoreBodyScroll()

      // Remove keyboard event listener when modal closes
      document.removeEventListener('keydown', handleKeyDown)

      // Return focus to the element that opened the modal
      if (
        previouslyFocusedElement.value &&
        'focus' in previouslyFocusedElement.value
      ) {
        nextTick(() => {
          previouslyFocusedElement.value.focus()
        })
      }
    }
  },
)

// Make sure to clean up on component unmount
onBeforeUnmount(() => {
  // Restore scrolling if component is unmounted while modal is open
  if (isOpen.value) {
    restoreBodyScroll()
  }
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="backdrop" @click="handleBackdropClick"></div>
    </Transition>
    <Transition name="modal-scale">
      <div v-if="isOpen" class="modal-wrapper" @click="handleBackdropClick">
        <div
          class="modal"
          :class="[`modal--${size}`, { 'modal--persistent': persistent }]"
          :style="{
            maxWidth: maxWidth,
            maxHeight: maxHeight,
          }"
          ref="modalRef"
          tabindex="-1"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          @click.stop
        >
          <div v-if="showHeader" class="modal__header">
            <h3 class="modal__title" id="modal-title">{{ title }}</h3>
            <button
              v-if="!persistent"
              class="modal__close"
              @click="modalStore.openModalId = null"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div class="modal__content">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
