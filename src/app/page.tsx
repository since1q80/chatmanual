//import Image from "next/image";
import FileUpload from "@/components/FileUpload";

import { Button } from "@/components/ui/button";
import { UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {FileUp, LogIn} from 'lucide-react'
import { auth } from "@clerk/nextjs/server";


export default async function Home() {
  const {userId} = await auth();
  const isAuth = !!userId;
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100 ">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with your Manual</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <div className = "w-full mt-4">
            {
              isAuth?(
                <FileUpload />
              ):(
                <Link href="/sign-in">
                    <Button>
                      Login to get started!
                      <LogIn  className="ml-2 h-4 w-4"/>
                    </Button>
                </Link>
              )
            }

          </div>
        </div>
      </div>
    </div>
  )
}
