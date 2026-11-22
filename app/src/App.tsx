import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster } from '@/components/ui/sonner'
import { GamesPage } from '@/pages/GamesPage'
import { SobrePage } from '@/pages/SobrePage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<GamesPage />} />
          <Route path="/sobre" element={<SobrePage />} />
        </Route>
      </Routes>
      <Toaster theme="dark" richColors position="top-right" />
    </BrowserRouter>
  )
}

export default App