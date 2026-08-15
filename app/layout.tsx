// 1. IMPORTAR O LOCAL FONT
import localFont from 'next/font/local';
import './globals.css';
import Footer from '@/components/Footer'; 
import Header from '@/components/Header'; 
import { Analytics } from "@vercel/analytics/next";

// 2. CONFIGURAR O ARQUIVO DA SUA FONTE (verifique se a extensão é .ttf ou .otf)
const merriweather = localFont({
  src: './fonts/Merriweather-VariableFont_opsz,wdth,wght.ttf', // Caminho para a pasta que criamos
  variable: '--font-merriweather',                             // Nome da variável que vamos usar
  display: 'swap',
});

const noticiatextbold = localFont({
  src: './fonts/NoticiaText-Bold.ttf', 
  variable: '--font-noticiatextbold',        
  display: 'swap',
});

const noticiatexrregular = localFont({
  src: './fonts/NoticiaText-Regular.ttf', 
  variable: '--font-noticiatexrregular',       
  display: 'swap',
});

const ebgaramond = localFont({
  src: './fonts/EBGaramond-VariableFont_wght.ttf', 
  variable: '--font-ebgaramond',       
  display: 'swap',
});

const breeSerif = localFont({
  src: './fonts/BreeSerif-Regular.ttf', 
  variable: '--font-breeSerif',        
  display: 'swap',
});

export const metadata = {
  title: 'Paróquia São José do Patrocínio',
  description: 'Uma comunidade de fé, esperança e caridade.',
  icons: {
    // Colocamos o ?v=2 para FORÇAR o navegador a baixar de novo
    icon: '/Tau2.png?v=2',
    shortcut: '/Tau2.png?v=2',
    apple: '/Tau2.png?v=2',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 3. INJETAR A VARIÁVEL NA TAG HTML
    <html lang="pt-BR" className={`${merriweather.variable} ${noticiatextbold.variable} ${noticiatexrregular.variable} ${ebgaramond.variable} ${breeSerif.variable}`}>
      <body>
        <Header />
        {children}
        
        {/* O Footer ficará sempre no final, independente de qual página o usuário estiver */}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}