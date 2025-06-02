 "use client"
import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'
import useProject from '@/hooks/use-project'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import CodeReferences from './code-references'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'



const AskQuestionCard = () => {
    const {project }=useProject()
    const [question,setQuestion]=React.useState('')
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [filesReferences,setFileReferences]=React.useState<{fileName:string; sourceCode:string ; summary:string}[]>([])
    const [answer ,setAnswer]=React.useState('')
    const saveAnswer=api.project.saveAnswer.useMutation()

    const refetch=useRefetch()
    const onSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
        setAnswer('')
        setFileReferences([])
        e.preventDefault()
        if(!project?.id) return
        setLoading(true)
        
        const {output ,filesReferences}=await askQuestion(question, project.id)
        setOpen(true)

        setFileReferences(filesReferences);

        for await (const delta of readStreamableValue(output)){
            if(delta){
                setAnswer(ans=>ans+delta)
            }
        }
        setLoading(false);
    }
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}  >
        <DialogContent className='sm:max-w-[80vw] !h-full'>
                    <DialogHeader>
                        <div className='flex items-center gap-2' >

                        <DialogTitle>
                            <Image src='/logo.png' alt='dionysus' width={40} height={40} />
                        </DialogTitle>
                            <Button variant={'outline'} onClick={()=>{
                                    saveAnswer.mutate({
                                        projectId: project!?.id,
                                        question,
                                        answer,
                                        filesReferences
                                    },{
                                        onSuccess:()=>{
                                            toast.success('Answer saved')
                                            refetch()
                                        },
                                        onError:()=>{
                                            toast.error('Failed to save answer')
                                        }
                                    })
                            }} >
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>


                <MDEditor.Markdown source={answer} className="max-w-[70vw] pl-3 !h-full max-h-[40vh] overflow-y-scroll scrollbar-hide   scrollbar-hover  " />
                    <div className="h-4"></div>
                    <CodeReferences filesReferences={filesReferences}/>

                    <Button type='button' onClick={()=>{
                        setOpen(false)
                        setAnswer('')
                    }
                        } disabled={loading} >
                        Close   

                    </Button>
        </DialogContent>

    </Dialog>
    <Card className='relative  col-span-3'>
        <CardHeader>
            <CardTitle>
                Ask a Question
            </CardTitle>
        </CardHeader>
        <CardContent>
                <form onSubmit={onSubmit} >
                    <Textarea placeholder="Which file should i edit to change the home page?" value={question} onChange={e=>setQuestion(e.target.value)}/>
                    <div className="h-4"></div>
                    <Button type='submit' >
                        Ask Dionysus!
                    </Button>
                </form>
        </CardContent>
    </Card>
    </>
  )
}

export default AskQuestionCard