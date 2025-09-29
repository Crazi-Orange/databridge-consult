import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from 'app/lib/supabaseAdmin';
import { signJwt } from 'app/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();
        
        // Input validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Name, email and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with 'user' role
        const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert({
                name,
                email,
                password_hash: hashedPassword,
                role: 'user', // Default role
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user:', insertError);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // Create JWT token
        const token = signJwt({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            created_at: Math.floor(new Date(newUser.created_at).getTime() / 1000)
        });

        // Remove sensitive data from response
        const { password_hash: _, ...safeUserData } = newUser;

        // Create response with token in cookie
        const response = NextResponse.json(
            { user: safeUserData },
            { status: 201 }
        );

        // Set JWT token in cookie
        response.cookies.set('auth_token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}