// components/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="bg-[#401D10] pt-16 pb-8 mt-auto border-t-[6px] border-[#592C1C]">
      <div className="max-w-md md:max-w-6xl mx-auto px-6">
        
        {/* =========================================
            GRID PRINCIPAL DO FOOTER
        ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          
          {/* COLUNA 1: Logo, Descrição e Redes Sociais */}
          <div className="md:col-span-5 flex flex-col">
            
            {/* Logo e Nome Lado a Lado */}
            <a href="/" className="flex items-center gap-4 mb-6 transition-transform hover:scale-105 w-fit">
              <img 
                src="/Tau2.png" 
                alt="Logo da Paróquia" 
                className="h-14 w-auto object-contain brightness-0 invert" 
              />
              <span className="font-serif font-bold text-[#F2F2F2] leading-tight text-xl">
                Paróquia<br />São José do Patrocínio
              </span>
            </a>
            
            <p className="text-[#A6948D] leading-relaxed mb-8 font-serif text-lg pr-4">
              A Paróquia São José do Patrocínio é uma rede de comunidades unidas pela fé, 
              levando a Palavra de Deus, o amor e o acolhimento a todos os irmãos.
            </p>

            {/* BOTÕES DE REDES SOCIAIS (WhatsApp, Instagram e Facebook) */}
            {/* Ajustei o flex-wrap para que os botões não quebrem o layout em telas menores */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Botão WhatsApp */}
              <a 
                href="https://wa.me/5549988141513?text=Olá%20Gostaria%20de%20falar%20com%20a%20Secretária%20da%20Paróquia." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 text-[#F2F2F2] hover:bg-[#25D366] hover:border-[#25D366] px-5 py-2.5 rounded-xl font-bold transition-all group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              
              {/* Botão Instagram */}
              <a 
                href="https://instagram.com/psaojosecoronelf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 text-[#F2F2F2] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:border-transparent px-5 py-2.5 rounded-xl font-bold transition-all group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>

              {/* Novo Botão Facebook */}
              <a 
                href="https://facebook.com/IgrejaMatrizSaoJoseCF/?locale=pt_BR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 text-[#F2F2F2] hover:bg-[#1877F2] hover:border-[#1877F2] px-5 py-2.5 rounded-xl font-bold transition-all group"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>

          {/* COLUNA 2: Acesso Rápido */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="font-serif font-bold text-xl text-[#F2F2F2] mb-6 border-b border-white/10 pb-2">
              Acesso Rápido
            </h4>
            <ul className="space-y-4">
              <li><a href="/" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Página Inicial</a></li>
              <li><a href="/noticias" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Notícias da Paróquia</a></li>
              <li><a href="/calendario" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Calendário e Horários</a></li>
              <li><a href="/comunidades" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Nossas Comunidades</a></li>
            </ul>
          </div>

          {/* COLUNA 3: Vida Cristã */}
          <div className="md:col-span-3">
            <h4 className="font-serif font-bold text-xl text-[#F2F2F2] mb-6 border-b border-white/10 pb-2">
              Vida Cristã
            </h4>
            <ul className="space-y-4">
              <li><a href="/liturgia" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Liturgia Diária</a></li>
              <li><a href="/velas" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Acender Vela Virtual</a></li>
              <li><a href="/sobre" className="text-[#A6948D] hover:text-[#F2F2F2] transition-colors font-medium hover:translate-x-1 inline-block">Sobre a Paróquia</a></li>
            </ul>
          </div>

        </div>

        {/* =========================================
            BARRA INFERIOR (Copyright)
        ========================================= */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#A6948D] text-sm">
          <p>© {new Date().getFullYear()} Paróquia São José do Patrocínio. Todos os direitos reservados.</p>
          <a href="/calendario" className="hover:text-[#F2F2F2] transition-colors font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Acesso Secretaria
          </a>
        </div>
        
      </div>
    </footer>
  );
}