"use client"

import { useEffect } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

export const useGlobalMouseEvents = () => {
  const setIsDrawing = usePixelEditorStore(state => state.setIsDrawing)

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDrawing(false)
    }
    const handleGlobalTouchEnd = () => {
      setIsDrawing(false)
    }
    
    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('touchend', handleGlobalTouchEnd)
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [setIsDrawing])
}