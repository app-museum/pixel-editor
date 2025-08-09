"use client"

import { memo } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

interface ColorButtonProps {
  color: string
  isSelected: boolean
  onClick: () => void
  onRemove?: () => void
  showRemove?: boolean
}

const ColorButton = memo<ColorButtonProps>(({ color, isSelected, onClick, onRemove, showRemove }) => (
  <div className="relative">
    <button
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
        isSelected 
          ? "border-blue-500 shadow-lg ring-2 ring-blue-200" 
          : "border-gray-300 hover:border-gray-400"
      }`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={`色を選択: ${color}`}
      aria-pressed={isSelected}
    />
    {showRemove && onRemove && (
      <button
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        aria-label={`色を削除: ${color}`}
      >
        ×
      </button>
    )}
  </div>
))

ColorButton.displayName = 'ColorButton'

export const ColorPalette = memo(() => {
  const {
    colors,
    selectedColor,
    customColor,
    customColors,
    maxCustomColors,
    setSelectedColor,
    setCustomColor,
    addCustomColor,
    removeCustomColor,
    clearCustomColors
  } = usePixelEditorStore()

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">カラーパレット</h3>
      <div className="grid grid-cols-5 gap-2 mb-3">
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
      
      {/* カスタムカラーセクション */}
      {customColors.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">マイカラー ({customColors.length}/{maxCustomColors})</h4>
            <button
              className="text-xs text-red-600 hover:text-red-800"
              onClick={clearCustomColors}
            >
              全削除
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {customColors.map((color) => (
              <ColorButton
                key={color}
                color={color}
                isSelected={selectedColor === color}
                onClick={() => setSelectedColor(color)}
                onRemove={() => removeCustomColor(color)}
                showRemove={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* カスタムカラー追加 */}
      <div className="flex gap-2">
        <input
          type="color"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
          title="カスタムカラー"
        />
        <button
          className="bg-purple-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-purple-600 transition-colors duration-200 text-xs"
          onClick={() => setSelectedColor(customColor)}
        >
          使用
        </button>
        <button
          className={`py-2 px-3 rounded-lg font-medium transition-colors duration-200 text-xs ${
            customColors.length >= maxCustomColors || customColors.includes(customColor)
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          onClick={() => addCustomColor(customColor)}
          disabled={customColors.length >= maxCustomColors || customColors.includes(customColor)}
          title={
            customColors.includes(customColor) 
              ? "この色は既に保存されています" 
              : customColors.length >= maxCustomColors 
                ? `最大${maxCustomColors}色まで保存できます` 
                : "パレットに追加"
          }
        >
          保存
        </button>
      </div>
    </div>
  )
})

ColorPalette.displayName = 'ColorPalette'