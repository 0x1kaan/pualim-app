'use client'

import { Menu, Bell, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import { useCafeStore } from '@/stores/cafeStore'

export function Header() {
  const cafe = useCafeStore((s) => s.cafe)

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/90 backdrop-blur-md px-4">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-56">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <Coffee className="h-5 w-5 text-primary" />
        <span className="font-heading font-bold">Pualım</span>
      </div>

      <div className="flex-1" />

      {/* Cafe name */}
      {cafe && (
        <span className="text-sm text-muted-foreground hidden sm:block">
          {cafe.name}
        </span>
      )}

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
      </Button>
    </header>
  )
}
