import React from 'react';

type ImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string; 
};

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText = "Imagen" }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-2 rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-gray-200 transition"
          aria-label="Cerrar"
        >
          &times;
        </button>
        
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-md"
        />
      </div>
    </div>
  );
};

export default ImageModal;