import { useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ImageCard from '@/components/image-card';

interface ImageUploaderProps {
    value: string;
    onchange: (value: string) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onchange }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selected, setSelected] = useState(value)
    const [images, setImages] = useState<string[]>([]);
    const [reloadImages, setReloadImages] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)


    useEffect(() => {

        const loadImages = async () => {
            try {
                const response = await fetch('/api/billboard')
                const data = await response.json();
                setImages(data)

            } catch (error) {
                console.log(error)
            }
        }

        loadImages()

    }, [reloadImages])

    useEffect(() => {
        onchange(selected)
    }, [selected])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)

        const file = e.target.files?.[0]; // Asegúrate de que hay un archivo seleccionado
        if (!file) {
            console.error("No file selected");
            return;
        }

        try {
            // Crear un objeto FormData
            const formData = new FormData();
            formData.append('file', file); // Agregar el archivo al FormData

            const response = await fetch('/api/billboard', {
                method: 'POST',
                body: formData, // Pasar el FormData como cuerpo
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setImages((prevImages) => [...prevImages, data.publicUrl])

            setReloadImages(!reloadImages)

            console.log(data); // Muestra la respuesta devuelta por la API
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                <ImageCard images={images} reloadImages={setReloadImages} selected={selected} setSelected={setSelected} />
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
                />
            </div>
        </div>
    );
};
