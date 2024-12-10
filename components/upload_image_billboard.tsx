import { useRef, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Billboard } from "@/types/page";
import { Button } from "./ui/button";
import Image from "next/image";

interface ImageUploaderProps {
    setImagesUpload: React.Dispatch<React.SetStateAction<File | null>>;
    billboard?: Billboard | null;
}

export const ImageUploaderBillboard: React.FC<ImageUploaderProps> = ({ setImagesUpload, billboard }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageUrl, setImageUrl] = useState<any>(billboard?.imageUrl || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]; // Solo permitimos una imagen
            setImagesUpload(file); // Guardar la imagen seleccionada
            setImageUrl(URL.createObjectURL(file)); // Crear una URL temporal para mostrar la imagen
        }
    };

    const deleteImage = () => {
        setImageUrl(null); // Eliminar la vista previa
        setImagesUpload(null); // Borrar el archivo
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Limpiar el input file
        }
    };

    return (
        <div>
            <div className="mb-4">
                {imageUrl && (
                    <div className=' relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={(deleteImage)}

                            >
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover cursor-pointer"
                            alt="Image"
                            src={imageUrl}
                        />
                    </div>
                )}
            </div>
            <div>
                <label
                    htmlFor="file-input"
                    className="cursor-pointer flex space-x-2 items-center justify-center w-full h-10 rounded-md bg-gray-200 hover:bg-gray-300"
                >
                    <ImagePlus className="w-4 h-4 text-gray-600" />
                    <p>Subir una imagen</p>
                </label>
                <Input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUploaderBillboard;
