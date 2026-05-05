import { create } from 'zustand'
import type { Cafe } from '@/types/database'

interface CafeStore {
  cafe: Cafe | null
  isLoading: boolean
  setCafe: (cafe: Cafe | null) => void
  setLoading: (loading: boolean) => void
  updateCafe: (updates: Partial<Cafe>) => void
}

export const useCafeStore = create<CafeStore>((set) => ({
  cafe: null,
  isLoading: true,
  setCafe: (cafe) => set({ cafe, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  updateCafe: (updates) =>
    set((state) => ({
      cafe: state.cafe ? { ...state.cafe, ...updates } : null,
    })),
}))
