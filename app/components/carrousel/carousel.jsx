import { useState } from 'react';
import './carousel.css';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lista das imagens no diretório public
  const images = [
    '/corte-4.jpg',
    '/corte-1.jpg',
    '/corte-3.jpg',
    '/corte-2.jpg',
  ];

  // Função para mudar a imagem para a esquerda
  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Função para mudar a imagem para a direita
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="carousel-container" style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
      <img
        src={images[currentIndex]}
        alt={`Imagem ${currentIndex + 1}`}

      />
      <button
        onClick={prevImage}

      >
        {'<'}
      </button>
      <button
        onClick={nextImage}
       
      >
        {'>'}
      </button>
    </div>
  );
};

export default Carousel;
