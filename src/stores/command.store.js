import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useWebsitesStore } from '@/stores/websites.store.js'

export const useCommandStore = defineStore('command', () => {
  const websitesStore = useWebsitesStore()

  const commands = ref([
    {
      name: 'copy websites domains list',
      action: () => {
        const domains = websitesStore.visibleItems
          .map((w) => w.website)
          .join('\n')
        navigator.clipboard.writeText(domains)
      },
    },
    {
      name: 'copy websites domains comma separated list',
      action: () => {
        const domains = websitesStore.visibleItems.map((w) => w.website).join()
        navigator.clipboard.writeText(domains)
      },
    },
    {
      name: 'copy websites urls list',
      action: () => {
        const urls = websitesStore.visibleItems
          .map((w) => `https://${w.host}`)
          .join('\n')
        navigator.clipboard.writeText(urls)
      },
    },
  ])

  function executeCommand(commandName) {
    const command = commands.value.find((cmd) => cmd.name === commandName)
    if (command) {
      command?.action()
    } else {
      console.warn(`Command not found: ${commandName}`)
    }
  }

  return {
    commands,
    executeCommand,
  }
})
