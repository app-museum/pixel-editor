"use client"

import { useHotkeys } from 'react-hotkeys-hook'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

export const useKeyboardShortcuts = () => {
  const {
    undo,
    redo,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportAsImage
  } = usePixelEditorStore()

  // Undo: Ctrl+Z / Cmd+Z
  useHotkeys('ctrl+z, meta+z', undo, {
    preventDefault: true,
    description: 'Undo last action'
  })

  // Redo: Ctrl+Shift+Z, Ctrl+Y / Cmd+Shift+Z, Cmd+Y
  useHotkeys('ctrl+shift+z, ctrl+y, meta+shift+z, meta+y', redo, {
    preventDefault: true,
    description: 'Redo last undone action'
  })

  // Save: Ctrl+S / Cmd+S
  useHotkeys('ctrl+s, meta+s', saveToLocalStorage, {
    preventDefault: true,
    description: 'Save to localStorage'
  })

  // Load: Ctrl+O / Cmd+O
  useHotkeys('ctrl+o, meta+o', loadFromLocalStorage, {
    preventDefault: true,
    description: 'Load from localStorage'
  })

  // Export: Ctrl+E / Cmd+E
  useHotkeys('ctrl+e, meta+e', exportAsImage, {
    preventDefault: true,
    description: 'Export as PNG'
  })
}