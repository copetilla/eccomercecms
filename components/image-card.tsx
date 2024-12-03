import React, { SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'


interface ImageCardProps {
    images: [{
        url: string;
        name: string
    }]
    DeleteImage: (src: string) => void
}

const ImageCard = ({ images, DeleteImage }: ImageCardProps) => {

    return (
        <>
            {images.map((file) => (
                <div key={file.name} className={cn(' relative w-[200px] h-[200px] rounded-md overflow-hidden')}>
                    <div className="z-10 absolute top-2 right-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => DeleteImage(file)}

                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                    <Image
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover cursor-pointer"
                        alt="Image"
                        src={file.url}
                    />
                </div>
            ))}
        </>
    )
}

export default ImageCard