"use client"
import React from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import AskQuestionCard from '../dashboard/ask-question-card'
import Image from 'next/image'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from '../dashboard/code-references'



const QAPage = () => {
  const {projectId}=useProject()
  const {data:questions}=api.project.getQuestions.useQuery({projectId})

  const [questionIndex,setQuestionIndex]=React.useState(0);
  const question=questions?.[questionIndex]

  

  return (
    <Sheet>
      <div className="h-4"></div>
      <AskQuestionCard/>
      <div className="h-4"></div>
      <h1 className='text-xl font-semibold' >Saved Questions</h1>
      <div className="h-2"></div>

      <div className='flex flex-col gap-2'>
        {questions?.map((question,index)=>{
          return <React.Fragment key={question.id}>
            <SheetTrigger onClick={()=>setQuestionIndex(index)}>
              <div className='flex items-center gap-4 bg-white rounded-lg p-4 shadow border'>
                <Image src={question.user.imageUrl??""} className='rounded-full ' width={30} height={30}  alt='user' />

                  <div className='flex flex-col text-left'>
                    <div className='flex items-center gap-2' >
                      <p className='text-gray-700 line-clamp-1 text-lg font-medium'> 

                      {question.question}
                      </p>
                      <span className='text-xs whitespace-nowrap text-gray-400'>
                       {question.createdAt.toLocaleDateString()}
                       </span>
                    </div>
                    <div>
                      <p className='text-gray-500 line-clamp-1 text-sm '> {question.answer} </p>
                    </div>

                  </div>
              </div>
            </SheetTrigger>

          </React.Fragment>
        })}

      </div>

      {question && (
        <SheetContent className='sm:max-w-[80vw]'>
            <SheetHeader>
              <SheetTitle >
                {question.question}
              </SheetTitle>
              <MDEditor.Markdown source={question.answer} className='max-h-[40vh] overflow-y-scroll scrollbar-hover' />
              <div className="h-2"></div>

              <CodeReferences filesReferences={(question.filesReferences ?? [] ) as any} />
            </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  )
}

export default QAPage