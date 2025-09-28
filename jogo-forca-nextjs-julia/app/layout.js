import './globals.css'

export const metadata = {
  title: 'Jogo da Forca — Julia',
  description: 'Jogo da Forca em Next.js App Router',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
