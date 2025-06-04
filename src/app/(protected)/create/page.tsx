"use client"

import React from 'react'
import Image from 'next/image'
import { api } from '@/trpc/react'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'
import { Info } from 'lucide-react'

type FormInput={

    repoUrl: string
    projectName: string
    githubToken?: string

}

const CreatePage = () => {
    const {register, handleSubmit, reset } = useForm<FormInput>()

    const createProject= api.project.createProject.useMutation()
    const checkCredits=api.project.checkCredits.useMutation()
    const refetch= useRefetch()

      
    function onsubmit(data: FormInput) {

        if(!!checkCredits.data){
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
        }else{
            checkCredits.mutate({
                githubUrl:data.repoUrl,
                githubToken:data.githubToken
            })
        }
            

    }

    const hasEnoughCredits=checkCredits?.data?.userCredits? checkCredits.data.fileCount<=checkCredits.data.userCredits:true


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

                    {!!checkCredits.data &&(
                        <div className='mt-4 bg-orange-50 px-4 py-2 rounded-md border border-orange-200 text-orange-700'>
                            <div className='flex items-center gap-2'>
                                <Info className='size-4'/>
                                <p className='text-sm'>You will be charged <strong>{checkCredits.data?.fileCount}</strong> Credits for this repository  </p>

                            </div>
                            <p className='text-sm text-blue-600 ml-6'>You have <strong>{checkCredits.data?.userCredits}</strong> credits remaining. </p>

                        </div>
                    )}
                    <div className="h-4"></div>

                    <Button type='submit' disabled={createProject.isPending || checkCredits.isPending || !hasEnoughCredits} >
                        {!!checkCredits.data? 'Create Project':'Check Credits'}
                    
                    </Button>
                </form>
            </div>
        </div>


    </div>
  )
}

export default CreatePage