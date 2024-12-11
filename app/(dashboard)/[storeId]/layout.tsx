import { getStore } from "@/lib/storeService";
import Navbar from "@/components/navbar";
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { storeId: string }
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in')
    }

    const store = await getStore(userId, params.storeId);

    if (!store) {
        redirect('/')
    }

    return (
        <>
            <div>
                <Navbar />
                {children}
            </div>
        </>
    )
}