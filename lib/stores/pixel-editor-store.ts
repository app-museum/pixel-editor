import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { WritableDraft } from 'immer'

export type Tool = "pen" | "eraser" | "fill"

export interface HistoryState {
  grid: string[][]
  timestamp: number
}

export interface PixelEditorState {
  // Grid state
  grid: string[][]
  canvasSize: number
  
  // Tool state
  selectedTool: Tool
  selectedColor: string
  customColor: string
  customColors: string[]
  maxCustomColors: number
  isDrawing: boolean
  
  // History state
  history: HistoryState[]
  historyIndex: number
  
  // UI state
  colors: string[]
}

export interface PixelEditorActions {
  // Grid actions
  setGrid: (grid: string[][]) => void
  setCanvasSize: (size: number) => void
  clearCanvas: () => void
  
  // Tool actions
  setSelectedTool: (tool: Tool) => void
  setSelectedColor: (color: string) => void
  setCustomColor: (color: string) => void
  addCustomColor: (color: string) => void
  removeCustomColor: (color: string) => void
  clearCustomColors: () => void
  setIsDrawing: (isDrawing: boolean) => void
  
  // Pixel actions
  updatePixel: (row: number, col: number) => void
  floodFill: (startRow: number, startCol: number, newColor: string) => void
  
  // History actions
  addToHistory: (grid: string[][]) => void
  undo: () => void
  redo: () => void
  
  // Storage actions
  saveToLocalStorage: () => void
  loadFromLocalStorage: () => void
  
  // Export actions
  exportAsImage: () => void
}

export type PixelEditorStore = PixelEditorState & PixelEditorActions

const INITIAL_COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
]

const createInitialGrid = (size: number): string[][] => 
  Array(size).fill(null).map(() => Array(size).fill("#FFFFFF"))

export const usePixelEditorStore = create<PixelEditorStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // Initial state
          grid: createInitialGrid(16),
          canvasSize: 16,
          selectedTool: "pen",
          selectedColor: "#000000",
          customColor: "#000000",
          customColors: [],
          maxCustomColors: 20,
          isDrawing: false,
          history: [],
          historyIndex: -1,
          colors: INITIAL_COLORS,

          // Grid actions
          setGrid: (grid: string[][]) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.grid = grid.map(row => [...row])
            })
          },

          setCanvasSize: (size: number) => {
            set((state: WritableDraft<PixelEditorState>) => {
              const newGrid = Array(size).fill(null).map((_, row) =>
                Array(size).fill(null).map((_, col) => {
                  if (row < state.grid.length && col < state.grid[0].length) {
                    return state.grid[row][col]
                  }
                  return "#FFFFFF"
                })
              )
              state.grid = newGrid
              state.canvasSize = size
              // Add to history
              state.history = state.history.slice(0, state.historyIndex + 1)
              state.history.push({
                grid: newGrid.map(row => [...row]),
                timestamp: Date.now()
              })
              state.history = state.history.slice(-50)
              state.historyIndex = Math.min(state.historyIndex + 1, 49)
            })
          },

          clearCanvas: () => {
            set((state: WritableDraft<PixelEditorState>) => {
              const newGrid = createInitialGrid(state.canvasSize)
              state.grid = newGrid
              // Add to history
              state.history = state.history.slice(0, state.historyIndex + 1)
              state.history.push({
                grid: newGrid.map(row => [...row]),
                timestamp: Date.now()
              })
              state.history = state.history.slice(-50)
              state.historyIndex = Math.min(state.historyIndex + 1, 49)
            })
          },

          // Tool actions
          setSelectedTool: (tool: Tool) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.selectedTool = tool
            })
          },

          setSelectedColor: (color: string) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.selectedColor = color
            })
          },

          setCustomColor: (color: string) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.customColor = color
            })
          },

          addCustomColor: (color: string) => {
            set((state: WritableDraft<PixelEditorState>) => {
              if (!state.customColors.includes(color) && state.customColors.length < state.maxCustomColors) {
                state.customColors.push(color)
              }
            })
          },

          removeCustomColor: (color: string) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.customColors = state.customColors.filter(c => c !== color)
            })
          },

          clearCustomColors: () => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.customColors = []
            })
          },

          setIsDrawing: (isDrawing: boolean) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.isDrawing = isDrawing
            })
          },

          // Pixel actions
          updatePixel: (row: number, col: number) => {
            const state = get()
            if (row < 0 || row >= state.canvasSize || col < 0 || col >= state.canvasSize) return

            set((draft: WritableDraft<PixelEditorState>) => {
              const currentColor = draft.grid[row][col]
              let newColor: string

              switch (draft.selectedTool) {
                case "pen":
                  newColor = draft.selectedColor
                  break
                case "eraser":
                  newColor = "#FFFFFF"
                  break
                case "fill":
                  // Flood fill logic will be handled separately
                  return
                default:
                  return
              }

              if (currentColor !== newColor) {
                draft.grid[row][col] = newColor
                // Add to history
                draft.history = draft.history.slice(0, draft.historyIndex + 1)
                draft.history.push({
                  grid: draft.grid.map(row => [...row]),
                  timestamp: Date.now()
                })
                draft.history = draft.history.slice(-50)
                draft.historyIndex = Math.min(draft.historyIndex + 1, 49)
              }
            })
          },

          floodFill: (startRow: number, startCol: number, newColor: string) => {
            const state = get()
            const targetColor = state.grid[startRow][startCol]
            if (targetColor === newColor) return

            set((draft: WritableDraft<PixelEditorState>) => {
              const stack: [number, number][] = [[startRow, startCol]]

              while (stack.length > 0) {
                const [row, col] = stack.pop()!
                
                if (row < 0 || row >= draft.canvasSize || col < 0 || col >= draft.canvasSize) continue
                if (draft.grid[row][col] !== targetColor) continue

                draft.grid[row][col] = newColor

                stack.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1])
              }

              // Add to history
              draft.history = draft.history.slice(0, draft.historyIndex + 1)
              draft.history.push({
                grid: draft.grid.map(row => [...row]),
                timestamp: Date.now()
              })
              draft.history = draft.history.slice(-50)
              draft.historyIndex = Math.min(draft.historyIndex + 1, 49)
            })
          },

          // History actions
          addToHistory: (grid: string[][]) => {
            set((state: WritableDraft<PixelEditorState>) => {
              state.history = state.history.slice(0, state.historyIndex + 1)
              state.history.push({
                grid: grid.map(row => [...row]),
                timestamp: Date.now()
              })
              state.history = state.history.slice(-50)
              state.historyIndex = Math.min(state.historyIndex + 1, 49)
            })
          },

          undo: () => {
            const state = get()
            if (state.historyIndex > 0) {
              const prevState = state.history[state.historyIndex - 1]
              set((draft: WritableDraft<PixelEditorState>) => {
                draft.grid = prevState.grid.map(row => [...row])
                draft.historyIndex = draft.historyIndex - 1
              })
            }
          },

          redo: () => {
            const state = get()
            if (state.historyIndex < state.history.length - 1) {
              const nextState = state.history[state.historyIndex + 1]
              set((draft: WritableDraft<PixelEditorState>) => {
                draft.grid = nextState.grid.map(row => [...row])
                draft.historyIndex = draft.historyIndex + 1
              })
            }
          },

          // Storage actions
          saveToLocalStorage: () => {
            const state = get()
            const saveData = {
              grid: state.grid,
              canvasSize: state.canvasSize,
              customColors: state.customColors,
              timestamp: Date.now()
            }
            try {
              localStorage.setItem('pixelart-save', JSON.stringify(saveData))
              alert('作品を保存しました！')
            } catch (error) {
              console.error('Failed to save to localStorage:', error)
              alert('保存に失敗しました。')
            }
          },

          loadFromLocalStorage: () => {
            try {
              const saved = localStorage.getItem('pixelart-save')
              if (saved) {
                const saveData = JSON.parse(saved)
                set((state: WritableDraft<PixelEditorState>) => {
                  state.grid = saveData.grid
                  state.canvasSize = saveData.canvasSize
                  if (saveData.customColors) {
                    state.customColors = saveData.customColors
                  }
                  // Add to history
                  state.history = state.history.slice(0, state.historyIndex + 1)
                  state.history.push({
                    grid: saveData.grid.map((row: string[]) => [...row]),
                    timestamp: Date.now()
                  })
                  state.history = state.history.slice(-50)
                  state.historyIndex = Math.min(state.historyIndex + 1, 49)
                })
                alert('作品を読み込みました！')
              } else {
                alert('保存されたデータが見つかりません。')
              }
            } catch (error) {
              console.error('Failed to load from localStorage:', error)
              alert('保存データの読み込みに失敗しました。')
            }
          },

          // Export actions
          exportAsImage: () => {
            const state = get()
            try {
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              if (!ctx) {
                alert('Canvas context not available')
                return
              }

              const pixelSize = 20
              canvas.width = state.canvasSize * pixelSize
              canvas.height = state.canvasSize * pixelSize

              state.grid.forEach((row, rowIndex) => {
                row.forEach((color, colIndex) => {
                  ctx.fillStyle = color
                  ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize)
                })
              })

              const link = document.createElement('a')
              link.download = `pixel-art-${Date.now()}.png`
              link.href = canvas.toDataURL()
              link.click()
            } catch (error) {
              console.error('Failed to export image:', error)
              alert('画像の出力に失敗しました。')
            }
          },
        }))
      ),
      {
        name: 'pixel-editor-storage',
        partialize: (state) => ({
          grid: state.grid,
          canvasSize: state.canvasSize,
          selectedTool: state.selectedTool,
          selectedColor: state.selectedColor,
          customColor: state.customColor,
          customColors: state.customColors,
        }),
      }
    ),
    { name: 'pixel-editor' }
  )
)