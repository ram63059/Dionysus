'use client'

import { Button } from '@/components/ui/button'
import useProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'
import { toast } from 'sonner'

const ArchiveButton = () => {

    const {projectId} =useProject()
    const archiveProject=api.project.archiveProject.useMutation()
    const refetch=useRefetch()

  return (
    <Button disabled={archiveProject.isPending} size='sm' variant='destructive' onClick={()=>{
            const confirm=window.confirm("are you sure you want to archive this project?")
            if(confirm) archiveProject.mutate({projectId},{
                onSuccess:()=>{
                    toast.success("Project archived")
                    refetch()
                },
                onError:()=>{
                    toast.error("failed to archive project")
                }
            })
    }} >
            Archive
    </Button>
  )
}

export default ArchiveButton