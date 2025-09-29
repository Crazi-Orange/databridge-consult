import { NextResponse } from "next/server";
import { supabaseClient } from "app/lib/supabaseClient";
import { BlogPost } from "app/types/database.types"; 

export async function GET() {
  const { data, error } = await supabaseClient.from('blog_posts').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as BlogPost[], { status: 200 });
}