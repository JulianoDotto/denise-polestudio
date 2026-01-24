'use client'

import type { ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type AdminTab = {
  value: string
  label: string
  content: ReactNode
}

export default function AdminTabs({
  tabs,
  defaultValue,
}: {
  tabs: AdminTab[]
  defaultValue: string
}) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
