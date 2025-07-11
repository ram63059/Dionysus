import { SidebarProvider } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { AppSidebar } from './app-sidebar'

type Props = {
  children: React.ReactNode    
}


const SidebarLayout = ({ children }:Props) => {
  return (
    <SidebarProvider>
        {/*Appsidebar*/}
        <AppSidebar />
        

        <main className='w-full m-2'>
            <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4 '>

                {/* <SearchBar /> */}

                <div className='ml-auto '></div>
                <UserButton/>

            </div>

            <div className='h-4'></div>

            {/* Main content */}

            <div className='border-sidebar-border bg-sidebar p-3 border shadow rounded-md overflow-y-scroll scrollbar-hide  h-[calc(100vh-6rem)]  px-4 '>
                {children}
            </div>
        </main>
    </SidebarProvider>
  )
}

export default SidebarLayout