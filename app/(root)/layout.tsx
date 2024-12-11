import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/storeService";

export default async function SetupLayout({
    children
}: { children: React.ReactNode }) {
    const { userId } = await auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const store = await getStore(userId)

    if (store) {
        redirect(`/${store.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}