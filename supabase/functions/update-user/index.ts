import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, fullName, email, password, role, permissions } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Update Supabase Auth if email or password is provided
    const authUpdatePayload: { email?: string; password?: string } = {}
    if (email) authUpdatePayload.email = email;
    if (password) authUpdatePayload.password = password;

    if (Object.keys(authUpdatePayload).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        authUpdatePayload
      );
      if (authError) {
        console.error('Auth update error:', authError);
        return new Response(JSON.stringify({ error: `Auth update error: ${authError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }

    // 2. Update the user's profile in the 'users' table
    const profileUpdatePayload: { full_name?: string; email?: string; role?: string; permissions?: any[] | null } = {}
    if (fullName) profileUpdatePayload.full_name = fullName;
    if (email) profileUpdatePayload.email = email;
    if (role) {
      profileUpdatePayload.role = role;
      // If role is Admin, permissions should be null. Otherwise, use the provided permissions.
      profileUpdatePayload.permissions = role === 'Admin' ? null : permissions;
    }

    const { data: updatedUser, error: dbError } = await supabaseAdmin
      .from('users')
      .update(profileUpdatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (dbError) {
      console.error('DB update error:', dbError);
      return new Response(JSON.stringify({ error: `Database error: ${dbError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ user: updatedUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
