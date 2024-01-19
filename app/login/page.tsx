"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// @ts-ignore
import type { Database } from "@/lib/database.types"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [user ,setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function getUser(){
      const { data: {user}} = await supabase.auth.getUser()
      setUser(user) 
      setLoading(false)
    }

    getUser()
  }, [])

  const handleSignUp = async () => {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          // data you want to add to the user table on register 
          name,
        }
      },
    });
    
    if(error){
      console.log(error)
      alert(error.message)
      return
    }

    setUser(data.user)
    router.refresh();
    setEmail('')
    setPassword('')
  };

  const handleSignIn = async () => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(error){
      console.log(error);
      alert(error.message);
      return;
    }

    setUser(data.user)
    router.refresh();
    setEmail('')
    setPassword('')
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
    setUser(null)
  };

  // console.log(loading, user) 

  if(loading){
    return <h1>loading...</h1>
  }

  if(user){
    return(
      <div>
        <div>
          <h1 className="mb-8">You're already logged in</h1>
          <button 
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-4"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <input
        name="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className="border rounded p-2 mb-2 block text-black "
        placeholder="Name"
      />
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="border rounded p-2 mb-2 block text-black "
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="border rounded p-2 mb-2 block text-black "
        placeholder="Password"
      />
      <button
        onClick={handleSignUp}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-4 w-[15%]"
      >
        Sign up
      </button>
      <button
        onClick={handleSignIn}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2 mb-4 w-[15%]"
      >
        Sign in
      </button>
    </div>
  );
}
