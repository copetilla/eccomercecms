import { useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ImageCard from '@/components/image-card';

interface ImageUploaderProps {

}

export const ImageUploader: React.FC<ImageUploaderProps> = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [imagesUrl, setImagesUrl] = useState<string[]>([]);
    const [loading, setLoading] = useState(false)


    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Actualiza el estado de imágenes originales
            setImages((prev) => [...prev, ...selectedFiles]);

            // Genera URLs temporales para las imágenes seleccionadas
            const selectedImagesWithUrls = selectedFiles.map((file) => URL.createObjectURL(file));

            // Actualiza el estado de las URLs
            setImagesUrl((prev) => [...prev, ...selectedImagesWithUrls]);
        }
    }

    const DeleteImage = (url: string) => {
        // Encuentra el índice de la URL a eliminar
        const indexToRemove = imagesUrl.indexOf(url);

        if (indexToRemove !== -1) {
            // Actualiza el estado eliminando el elemento en el índice encontrado
            setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
            setImagesUrl((prev) => prev.filter((_, index) => index !== indexToRemove));
        }
    };

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                <ImageCard images={imagesUrl} DeleteImage={DeleteImage} />
            </div>
            <div>
                <label htmlFor='file-input' className="cursor-pointer flex space-x-2 items-center justify-center w-full h-10 rounded-md bg-gray-200 hover:bg-gray-300">
                    <ImagePlus className="w-4 h-4 text-gray-600" />
                    <p>Subir una imagen</p>
                </label>
                <Input
                    id='file-input'
                    ref={fileInputRef} // Asigna la referencia al input de archivo
                    type="file"
                    accept='image/PNG, image/JPEG, image/JPG'
                    onChange={(e) => handleFileChange(e)}
                    className='hidden'
                    disabled={loading}
                    multiple={true}
                />
            </div>
        </div>
    );
};
