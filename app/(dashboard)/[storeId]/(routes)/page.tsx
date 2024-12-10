import { getAllOrders } from "@/actions/get-all-orders";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-total-sales";
import ChartOverview from "@/components/chart-overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyToColones } from "@/lib/utils";
import { Order } from "@/types/page";
import { CreditCard, Package } from "lucide-react";

interface DashboardPageProps {
    params: { storeId: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
    const totalRevenue = await getTotalRevenue(params.storeId)
    const salesCount = await getSalesCount(params.storeId)
    const stockCount = await getStockCount(params.storeId)
    const dataChart = await getAllOrders(params.storeId)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title='Panel' description="Descripcion de tu tienda" />
                <Separator />
                <div className="grid gap-4 grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between spac-y-0 pb-2">
                            <CardTitle className="text-sm font-medium ">
                                Ganancias totales
                            </CardTitle>
                            <p className="text-lg h-4 w-4 text-muted-foreground items-center justify-center">
                                ₡
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrencyToColones(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between spac-y-0 pb-2">
                            <CardTitle className="text-sm font-medium ">
                                Ventas
                            </CardTitle>
                            <CreditCard className="text-lg h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{salesCount}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between spac-y-0 pb-2">
                            <CardTitle className="text-sm font-medium ">
                                Productos activos
                            </CardTitle>
                            <Package className="text-lg h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stockCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>
                            Resumen
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartOverview data={dataChart} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default DashboardPage;