
  "use client"

import { Button } from '@/components/ui/button'
  import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import useProject from '@/hooks/use-project'
  import { cn } from '@/lib/utils'
  import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from 'lucide-react'
import Image from 'next/image'
  import Link from 'next/link'
  import { usePathname } from 'next/navigation'
  import React from 'react'

  const items=[
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      url: '/dashboard'
    },
    {
      title: 'Q&A',
      icon: Bot,
      url: '/qa'
    },
    {
      title: 'Meetings',
      icon: Presentation,
      url: '/meetings'
    },
    {
      title: 'Billing',
      icon: CreditCard,
      url: '/billing'
    }
  ]
 
  export const AppSidebar = () => {
    const pathname=usePathname()
    const {open}= useSidebar()

    const {projects,projectId,setProjectId}=useProject()
    
    return (
      <Sidebar collapsible='icon' variant='floating' >

          <SidebarHeader>
              <div className='flex items-center gap-2 '>
                <Image src='/logo.png' width={40} height={40} alt='logo'/>
                {open &&(

                  <h1 className='text-xl font-bold text-primary/80 '>Dionysus</h1>
                )}
              </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                Application
              </SidebarGroupLabel>
              <SidebarGroupContent>

                <SidebarMenu>
                  {items.map(item=>{
                    return (
                      <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild >
                            <Link href={item.url} className={cn({
                              '!bg-primary !text-white': pathname === item.url
                            })} >

                              <item.icon/>
                              <span > {item.title}</span>


                            </Link>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}

                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                Your Projects
              </SidebarGroupLabel>
                  
                 <SidebarGroupContent>
                  <SidebarMenu>
                  {projects?.map(project=>{
                    return (
                      <SidebarMenuItem key={project.name}>
                        <SidebarMenuButton asChild>
                          <div  onClick={()=>{
                            
                            setProjectId(project.id)}
                          }
                            >
                            <div className={cn(
                              'rounded-sm border size-6 flex items-center justify-center bg-white text-primary',
                              {'bg-primary text-white': project.id===projectId},
                            )}>
                                {project.name[0]}
                            </div>
                                <span> {project.name} </span>
                          </div>
                        </SidebarMenuButton>

                      </SidebarMenuItem>
                    )
                  })}

                  <div className='h-2'></div>
              {open &&(

                <SidebarMenuItem>
                    <Link href='/create'>
                    <Button variant='outline' size='sm' className='w-fit'>
                      <Plus/>
                      Create Project
                    </Button>
                    </Link>
                  </SidebarMenuItem>
                ) }

                
                  </SidebarMenu>
                  </SidebarGroupContent> 
              </SidebarGroup>     

          </SidebarContent>
      </Sidebar>
    )
  }
