import React from 'react';
import { Instagram } from 'lucide-react';
import Image from "next/image";

const SocialFeed = () => {
  // Substitua pelos links e imagens reais da Gráfica
  const instagramPosts = [
    { id: 1, img: '/insta1.png', link: 'https://www.instagram.com/p/DR_9LiHjv5W/' },
    { id: 2, img: '/insta2.png', link: 'https://www.instagram.com/p/DR_83vdjmeF/' },
    { id: 3, img: '/insta3.png', link: 'https://www.instagram.com/p/DRSACGTDsdY/' },
    { id: 4, img: '/insta4.png', link: 'https://www.instagram.com/p/DRFBAL_DrB4/' },
  ];

  return (
    <section id="social-feed" className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* BLOCO INSTAGRAM */}
        <div className="mb-0"> {/* Removi a margem bottom grande pois não tem mais tiktok embaixo */}
          
          {/* Cabeçalho da Seção */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Instagram className="text-yellow-300 w-8 h-8" />
              <h2 className="text-3xl font-extrabold text-yellow-300">Siga no Instagram</h2>
          </div>
            
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Acompanhe nossos trabalhos recentes, bastidores da produção e promoções exclusivas.
            </p>
            
            <a 
              href="https://www.instagram.com/acriacaografic/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-4 text-yellow-400 font-bold hover:text-yellow-500 hover:underline text-lg transition-colors"
            >
              @acriacaografic
            </a>
          </div>

          {/* Grid de Fotos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {instagramPosts.map((post) => (
              <a 
                key={post.id} 
                href={post.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square block bg-slate-200"
              >
                <Image 
                  src={post.img} 
                  alt={`Post do Instagram ${post.id}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition duration-700 ease-out" 
                />
                
                {/* Overlay ao passar o mouse (Amarelo com transparência) */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition duration-300 flex flex-col items-center">                     
                     <Instagram className="text-yellow-400 w-10 h-10 drop-shadow-lg" />
                     <span className="block text-white text-sm font-bold mt-2">Ver Post</span>             
                  </div>
               </div>
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocialFeed;