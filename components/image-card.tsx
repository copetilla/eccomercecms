import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'


interface ImageCardProps {
    images: string[]
    reloadImages: any
}

const ImageCard = ({ images, reloadImages }: ImageCardProps) => {

    const DeleteImage = async (src: string) => {

        const fileName = src.split('/storage/v1/object/public/billboards_background/')[1];
        console.log(fileName)
        try {
            const response = await fetch('/api/billboard', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            reloadImages(!reloadImages)

            console.log(data);

        } catch (error) {

        }
    }
    return (
        <>
            {images.map((src) => (
                <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                    <div className="z-10 absolute top-2 right-2">
                        <Button

                            type="button"
                            variant="destructive"
                            onClick={() => DeleteImage(src)}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                    <Image
                        fill
                        className="object-cover"
                        alt="Image"
                        src={src}
                    />
                </div>
            ))}
        </>
    )
}

export default ImageCard