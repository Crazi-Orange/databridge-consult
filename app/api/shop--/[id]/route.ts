import { NextResponse } from "next/server";
import { products } from "app/data/products";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    {
        const product = products.find(p => p.id === Number(params.id)); 
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ sucess: true, data: product });
    }
    
}