"use client"

import { memo } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
  className: string
  children: React.ReactNode
  ariaLabel?: string
}

const ActionButton = memo<ActionButtonProps>(({ 
  onClick, 
  disabled = false, 
  className, 
  children, 
  ariaLabel 
}) => (
  <button
    className={`${className} font-medium transition-colors duration-200 text-sm disabled:opacity-50`}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    {children}
  </button>
))

ActionButton.displayName = 'ActionButton'

export const ControlPanel = memo(() => {
  const {
    history,
    historyIndex,
    undo,
    redo,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportAsImage,
    clearCanvas
  } = usePixelEditorStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">操作</h3>
      
      {/* Undo/Redo */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <ActionButton
          onClick={undo}
          disabled={!canUndo}
          className="bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600"
        >
          ↶ 元に戻す
        </ActionButton>
        <ActionButton
          onClick={redo}
          disabled={!canRedo}
          className="bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600"
        >
          ↷ やり直し
        </ActionButton>
      </div>
      
      {/* Save/Load */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <ActionButton
          onClick={saveToLocalStorage}
          className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600"
        >
          💾 保存
        </ActionButton>
        <ActionButton
          onClick={loadFromLocalStorage}
          className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600"
        >
          📂 読込
        </ActionButton>
      </div>
      
      {/* Export */}
      <ActionButton
        onClick={exportAsImage}
        className="w-full bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 mb-2"
      >
        📸 PNG出力
      </ActionButton>
      
      {/* Clear */}
      <ActionButton
        onClick={clearCanvas}
        className="w-full bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600"
        ariaLabel="キャンバスをクリア"
      >
        🗑️ クリア
      </ActionButton>
    </div>
  )
})

ControlPanel.displayName = 'ControlPanel'