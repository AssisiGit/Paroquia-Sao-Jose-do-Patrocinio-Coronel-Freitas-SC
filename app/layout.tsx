// app/layout.tsx
import './globals.css';
import Footer from '@/components/Footer'; // Importe o Footer aqui (ajuste o caminho se necessário)
import Header from '@/components/Header'; // Importe o Header aqui (ajuste o caminho se necessário)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        {children}
        
        {/* O Footer ficará sempre no final, independente de qual página o usuário estiver */}
        <Footer />
      </body>
    </html>
  );
}