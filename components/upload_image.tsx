import { SetStateAction, useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ImageCard from '@/components/image-card';
import { useParams } from 'next/navigation';

interface ImageUploaderProps {
    setImagesUpload: React.Dispatch<React.SetStateAction<File[]>>;
    productId?: string;
    urlsDelete: React.Dispatch<React.SetStateAction<string[]>>;
}

interface ImageFile {
    url: string;
    name: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ setImagesUpload, productId, urlsDelete }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imagesUrl, setImagesUrl] = useState<Set<ImageFile>>(new Set());
    const [loading, setLoading] = useState(false);
    const params = useParams();

    useEffect(() => {
        const getImages = async () => {
            try {
                const response = await fetch(`/api/${params.storeId}/products/${productId}/images`);
                if (!response.ok) {
                    console.error('Error loading images');
                    return;
                }
                const data = await response.json();

                if (Array.isArray(data.data)) {
                    const newUrls = new Set(imagesUrl);
                    data.data.forEach((d: any) => {
                        if (d.url) {
                            newUrls.add({
                                url: d.url,
                                name: d.url // Usamos el mismo URL como nombre
                            });
                        }
                    });
                    setImagesUrl(newUrls);
                } else {
                    console.error("data.data no es un array:", data.data);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        if (productId) {
            getImages();
        }
    }, [productId, params.storeId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setImagesUpload(prev => [...prev, ...selectedFiles]);

            const selectedImagesWithUrls = selectedFiles.map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            }));

            setImagesUrl(prev => {
                const updatedUrls = new Set([...prev]);
                selectedImagesWithUrls.forEach(image => updatedUrls.add(image));
                return updatedUrls;
            });
        }
    };

    const DeleteImage = (file: { name: string, url: string }) => {
        if (file.name === file.url) {
            urlsDelete(prev => [...prev, file.url]);
            setImagesUrl(prev => {
                const updatedUrls = new Set([...prev].filter(image => image.url !== file.url));
                return updatedUrls;
            });
        } else {

            setImagesUpload(prev => prev.filter(image => image.name !== file.name));
            setImagesUrl(prev => {
                const updatedUrls = new Set([...prev].filter(image => image.url !== file.url));
                return updatedUrls;
            });
        }

    };

    return (
        <div>
            <div className="mb-4 grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 items-center gap-4">
                <ImageCard images={Array.from(imagesUrl)} DeleteImage={DeleteImage} />
            </div>
            <div>
                <label htmlFor="file-input" className="cursor-pointer flex space-x-2 items-center justify-center w-full h-10 rounded-md bg-gray-200 hover:bg-gray-300">
                    <ImagePlus className="w-4 h-4 text-gray-600" />
                    <p>Subir una imagen</p>
                </label>
                <Input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/PNG, image/JPEG, image/JPG"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                    multiple
                />
            </div>
        </div>
    );
};
