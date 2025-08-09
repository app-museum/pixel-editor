"use client"

import { memo } from 'react'
import { PixelGrid } from '@/components/PixelGrid'
import { ToolPalette } from '@/components/ToolPalette'
import { ColorPalette } from '@/components/ColorPalette'
import { CanvasSizeSelector } from '@/components/CanvasSizeSelector'
import { ControlPanel } from '@/components/ControlPanel'
import { StatusDisplay } from '@/components/StatusDisplay'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useGlobalMouseEvents } from '@/hooks/useGlobalMouseEvents'

const PixelEditor = memo(() => {
  useKeyboardShortcuts()
  useGlobalMouseEvents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4">
      <div className="max-w-none xl:max-w-7xl 2xl:max-w-none mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            ピクセルアートエディター
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            クリックまたはドラッグしてピクセルアートを作成しよう
          </p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start justify-center">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 order-2 lg:order-1">
            <PixelGrid />
            <StatusDisplay />
          </div>

          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
            <ToolPalette />
            <CanvasSizeSelector />
            <ColorPalette />
            <ControlPanel />

            <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
              <p><strong>キーボードショートカット:</strong></p>
              <p>Ctrl+Z: 元に戻す / Ctrl+Y: やり直し</p>
              <p>Ctrl+S: 保存 / Ctrl+O: 読込</p>
              <p>Ctrl+E: PNG出力</p>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-xs sm:text-sm text-gray-500">
          <p>ヒント: マウスまたは指でドラッグして連続描画ができます</p>
        </footer>
      </div>
    </div>
  )
})

PixelEditor.displayName = 'PixelEditor'

export default PixelEditor
