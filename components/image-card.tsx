import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'


interface ImageCardProps {
    images: string[]
}

const ImageCard = ({ images }: ImageCardProps) => {
    return (
        <>
            {images.map((src) => (
                <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                    <div className="z-10 absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => { }} // Eliminar imagen al hacer clic
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