import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete('auth_token');
    // If you implement token blacklisting, add the token to the blacklist here
    return response;

}