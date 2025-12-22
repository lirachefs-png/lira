import React, { useState, useEffect } from 'react';

interface SafeImageProps {
    destinationName: string;
    altText: string;
    className?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ destinationName, altText, className }) => {
    // O estado que controla se houve erro
    const [hasError, setHasError] = useState(false);
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80';

    // Tenta a URL dinâmica. Se falhar, o onError ativa o fallback.
    const imageSrc = (hasError || !destinationName)
        ? FALLBACK_IMAGE
        : `https://source.unsplash.com/featured/?${encodeURIComponent(destinationName)},travel,landmark`;

    // Reseta o erro se mudarmos de cidade
    useEffect(() => {
        setHasError(false);
    }, [destinationName]);

    return (
        <img
            src={imageSrc}
            alt={altText}
            className={className}
            // A MÁGICA ACONTECE AQUI: Se o Unsplash falhar, isso ativa o fallback.
            onError={() => setHasError(true)}
            loading="lazy"
        />
    );
};

export default SafeImage;
