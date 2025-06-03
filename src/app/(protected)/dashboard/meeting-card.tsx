'use client'

import { Card } from '@/components/ui/card'
import {useDropzone} from 'react-dropzone'
import React from 'react'
// import { uploadFile } from '@/lib/firebase'
import { uploadFile } from '@/lib/supabase'
import { Presentation, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {CircularProgressbar,buildStyles} from 'react-circular-progressbar'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const MeetingCard = () => {

  const router =useRouter()
  const {project}=useProject()

  const processMeeting=useMutation({
    mutationFn:async(data:{meetingUrl:string,meetingId:string,projectId:string})=>{

      const {meetingId,meetingUrl,projectId}=data
      const response=await axios.post('/api/process-meeting',{meetingUrl,meetingId,projectId})

      return response.data
    }
  })

  const [progress, setProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const uploadMeeting=api.project.uploadMeeting.useMutation()

  const {getRootProps,getInputProps}=useDropzone({
    accept:{
        'audio/*':['.mp3','.wav','.m4a']
    },
    multiple:false,
    maxSize:50_000_000,
    onDrop: async acceptedFiles=>{
      if(!project) return
      setIsUploading(true)
      console.log(acceptedFiles)
      const file=acceptedFiles[0]

      if(!file) return

      const downloadUrl=await uploadFile(file as File ,setProgress) 
      uploadMeeting.mutate({
        projectId:project.id,
        meetingUrl:downloadUrl,
        name:file.name
      },{
        onSuccess:(meeting)=>{
          toast.success('Meeting uploaded successfully')
          router.push('/meetings')
          processMeeting.mutateAsync({meetingUrl:downloadUrl,meetingId:meeting.id , projectId:project.id})

        },
        onError:()=>{
          toast.error('Failed to upload meeting')
        }
      })

      setIsUploading(false)
    }
  })
    
  return (
    <Card className='col-span-2 flex flex-col items-center gap-3 justify-center p-10' {...getRootProps()} >

      {!isUploading && (
        <>
        <Presentation className='h-10 w-10 animate-bounce' />
        <h3 className=' text-sm font-semibold text-gray-800' >Create a new meeting</h3>

        <p className='text-sm text-center text-gray-600  '>
          Analyse your meeting with Dionysus
          <br />
          Powered by AI.
        </p>

          <div className='mt-1'>
            <Button disabled={isUploading} >
              <Upload className='-ml-0.5 mr-1.5 h-5 w-5 ' aria-hidden='true' />
              Upload Meeting
              <input className='hidden' {...getInputProps()} />
            </Button>

          </div>
        </>
      )}
      
      {isUploading && (
        <div className='flex flex-col  items-center justify-center'  >
          <CircularProgressbar value={progress} text={`${progress}%`} className='size-20'  styles={
            buildStyles({
              textColor:'#2563eb',
              pathColor:'#2563eb',
              textSize: '16px', 

            })
          } />
          <p className='text-sm text-gray-400 text-center'>Uploading your meeting...</p>

        </div>
      )}


    </Card>
  )
}

export default MeetingCard