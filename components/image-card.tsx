import React, { SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'


interface ImageCardProps {
    images: string[]
    reloadImages: (value: boolean) => void
    selected: string
    setSelected: React.Dispatch<SetStateAction<string>>
}

const ImageCard = ({ images, reloadImages, selected, setSelected }: ImageCardProps) => {

    const DeleteImage = async (src: string) => {

        const fileName = src.split('/storage/v1/object/public/billboards_background/')[1];
        console.log(fileName)
        try {
            const response = await fetch('/api/billboard_background', {
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
            console.log(error)
        } finally {

        }
    }

    const onClickImage = (src: string) => {
        setSelected(src)
    }
    return (
        <>
            {images.map((src) => (
                <div key={src} className={cn(' relative w-[200px] h-[200px] rounded-md overflow-hidden', {
                    'border-4 border-violet-500': selected === src,
                })}>
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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover cursor-pointer"
                        alt="Image"
                        src={src}
                        onClick={() => onClickImage(src)}
                    />
                </div>
            ))}
        </>
    )
}

export default ImageCard