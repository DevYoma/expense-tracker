import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link";

export default async function Home() {

  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: {user} } = await supabase.auth.getUser();

  // console.log(user);

  if (user === null)return(
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href={'/login'} className="underline text-blue-400">
        You're not logged in. Click here to Login 
      </Link>
    </main>
  )

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Ehn ehn, what is it?? 👀</h1>
    </main>
  )
}
