import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStore } from "../api/stores/route";

export default async function SetupLayout({
    children
}: { children: React.ReactNode }) {
    const { userId, getToken } = await auth()

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