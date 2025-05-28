"use client"

import React from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

type FormInput={

    repoUrl: string
    projectName: string
    githubToken?: string

}

const CreatePage = () => {
    const {register, handleSubmit, reset } = useForm<FormInput>()

    const createProject= api.project.createProject.useMutation()

    const refetch= useRefetch()

      
    function onsubmit(data: FormInput) {
            createProject.mutate({
                githubUrl: data.repoUrl,
                name: data.projectName,
                githubToken: data.githubToken,  
            },{
                onSuccess: () => {
                    toast.success('Project created successfully!')
                  void refetch()
                    reset()
                },
                onError:()=>{
                    toast.error('Failed to create project. Please try again.')

                }
            } )

        return true;
    }


  return (
    <div className='flex items-center gap-12 h-full justify-center ' >
        <Image src='/undraw_github.svg' className='h-56 w-auto  ' width={56} height={56}  alt='logo'/>

        <div>
            <div>
                <h1 className='font-semibold text-2xl'> Link your Github Repository</h1>
                <p className='text-sm text-muted-foreground'> Enter the Url of your Repository to link it to Dionysus</p>
            </div>
            <div className='h-4'></div>

            <div>
                <form onSubmit={handleSubmit(onsubmit)} >

                    <Input 
                        {...register('projectName', { required: true })}
                        placeholder='Project Name'
                        required

                    />
                    <div className="h-2"></div>
                    <Input 
                        {...register('repoUrl', { required: true })}
                        placeholder='repoUrl'
                        type='url'
                        required

                    />
                    <div className="h-2"></div>
                    <Input 
                        {...register('githubToken')}
                        placeholder='Github Token (optional)'
                    />

                    <div className="h-4"></div>

                    <Button type='submit' disabled={createProject.isPending} >
                        Create Project
                    </Button>
                </form>
            </div>
        </div>


    </div>
  )
}

export default CreatePage