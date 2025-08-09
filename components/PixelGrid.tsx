"use client"

import { useCallback, useMemo, memo, useRef } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

interface PixelCellProps {
  color: string
  size: string
  onMouseDown: () => void
  onMouseEnter: () => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  rowIndex: number
  colIndex: number
}

const PixelCell = memo<PixelCellProps>(({
  color,
  size,
  onMouseDown,
  onMouseEnter,
  onTouchStart,
  onTouchMove,
  rowIndex,
  colIndex
}) => {
  const pixelSize = size === 'w-6 h-6' ? '24px' : size === 'w-4 h-4' ? '16px' : '12px'
  
  return (
    <div
      className={`cursor-pointer hover:opacity-80 touch-none select-none`}
      style={{ 
        backgroundColor: color,
        width: pixelSize,
        height: pixelSize,
        border: '1px solid #ddd',
        boxSizing: 'border-box'
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      role="button"
      tabIndex={0}
      aria-label={`ピクセル ${rowIndex + 1}, ${colIndex + 1}`}
    />
  )
})

PixelCell.displayName = 'PixelCell'

export const PixelGrid = memo(() => {
  const {
    grid,
    canvasSize,
    selectedTool,
    selectedColor,
    isDrawing,
    setIsDrawing,
    updatePixel,
    floodFill
  } = usePixelEditorStore()

  const lastPositionRef = useRef<{ row: number, col: number } | null>(null)

  // ブレゼンハム線アルゴリズムで2点間の線を描画
  const drawLine = useCallback((x0: number, y0: number, x1: number, y1: number) => {
    const points: Array<{ row: number, col: number }> = []
    
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx - dy
    
    let x = x0
    let y = y0
    
    while (true) {
      if (x >= 0 && x < canvasSize && y >= 0 && y < canvasSize) {
        points.push({ row: y, col: x })
      }
      
      if (x === x1 && y === y1) break
      
      const e2 = 2 * err
      if (e2 > -dy) {
        err -= dy
        x += sx
      }
      if (e2 < dx) {
        err += dx
        y += sy
      }
    }
    
    return points
  }, [canvasSize])

  const handlePixelClick = useCallback((row: number, col: number) => {
    if (row < 0 || row >= canvasSize || col < 0 || col >= canvasSize) return
    
    if (selectedTool === "fill") {
      floodFill(row, col, selectedColor)
    } else {
      updatePixel(row, col)
    }
  }, [selectedTool, selectedColor, canvasSize, floodFill, updatePixel])

  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsDrawing(true)
    lastPositionRef.current = { row, col }
    handlePixelClick(row, col)
  }, [setIsDrawing, handlePixelClick])

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isDrawing && selectedTool !== "fill") {
      const lastPos = lastPositionRef.current
      if (lastPos && (lastPos.row !== row || lastPos.col !== col)) {
        // 前回の位置から現在の位置まで線を引く
        const linePoints = drawLine(lastPos.col, lastPos.row, col, row)
        linePoints.forEach(point => {
          updatePixel(point.row, point.col)
        })
      } else {
        handlePixelClick(row, col)
      }
      lastPositionRef.current = { row, col }
    }
  }, [isDrawing, selectedTool, handlePixelClick, drawLine, updatePixel])

  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault()
    setIsDrawing(true)
    lastPositionRef.current = { row, col }
    handlePixelClick(row, col)
  }, [setIsDrawing, handlePixelClick])

  const handleTouchMove = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault()
    if (isDrawing && selectedTool !== "fill") {
      const lastPos = lastPositionRef.current
      if (lastPos && (lastPos.row !== row || lastPos.col !== col)) {
        const linePoints = drawLine(lastPos.col, lastPos.row, col, row)
        linePoints.forEach(point => {
          updatePixel(point.row, point.col)
        })
      } else {
        handlePixelClick(row, col)
      }
      lastPositionRef.current = { row, col }
    }
  }, [isDrawing, selectedTool, drawLine, updatePixel, handlePixelClick])

  const pixelSize = useMemo(() => {
    return canvasSize <= 16 ? "w-6 h-6" : canvasSize <= 32 ? "w-4 h-4" : "w-3 h-3"
  }, [canvasSize])

  const getPixelPx = useMemo(() => {
    return canvasSize <= 16 ? 24 : canvasSize <= 32 ? 16 : 12
  }, [canvasSize])

  const gridElements = useMemo(() => {
    return grid.map((row, rowIndex) =>
      row.map((color, colIndex) => (
        <PixelCell
          key={`${rowIndex}-${colIndex}`}
          color={color}
          size={pixelSize}
          onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
          onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
          onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
          onTouchMove={(e) => handleTouchMove(e, rowIndex, colIndex)}
          rowIndex={rowIndex}
          colIndex={colIndex}
        />
      ))
    )
  }, [grid, pixelSize, handleMouseDown, handleMouseEnter, handleTouchStart, handleTouchMove])

  return (
    <div className="flex justify-center items-center">
      <div 
        className="border-2 border-gray-400 shadow-inner bg-white"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${canvasSize}, ${getPixelPx}px)`,
          gridTemplateRows: `repeat(${canvasSize}, ${getPixelPx}px)`,
          gap: '0px',
          width: `${canvasSize * getPixelPx}px`,
          height: `${canvasSize * getPixelPx}px`
        }}
        role="grid"
        aria-label="ピクセルアートキャンバス"
      >
        {gridElements.flat()}
      </div>
    </div>
  )
})

PixelGrid.displayName = 'PixelGrid'