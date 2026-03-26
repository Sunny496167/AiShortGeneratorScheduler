import { createClient } from "@supabase/supabase-js";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserToSupabase() {
  const user = await currentUser();
  if (!user) return;

  // Use the Service Role Key if available to bypass RLS, otherwise fallback to Anon Key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  const primaryEmail = user.emailAddresses.find(
    (em) => em.id === user.primaryEmailAddressId
  )?.emailAddress;

  const { error } = await supabase.from('users').upsert(
    {
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: primaryEmail || '',
    },
    { onConflict: 'id' }
  );

  if (error) {
    console.error("Error syncing user to Supabase:", error);
  } else {
    console.log(`Successfully synced user ${user.id} to Supabase users table.`);
  }
}
