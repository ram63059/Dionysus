"use client"

import {Tabs ,TabsContent,TabsList,TabsTrigger} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {lucario} from 'react-syntax-highlighter/dist/esm/styles/prism'

import React from 'react'

type Props = {
    filesReferences:{
        fileName:string; sourceCode:string; summary:string
    }[]
}

const CodeReferences = ({filesReferences}: Props) => {

const [tab ,setTab]=React.useState(filesReferences[0]?.fileName);
if(filesReferences.length===0) return null

  return (
    <div className='max-w-[70vw]'>
        <Tabs value={tab} onValueChange={setTab} >
            <div className='overflow-x-scroll scrollbar-hide flex gap-2 bg-gray-200 p-1 rounded-md'>
                {filesReferences.map(file=>(
                    <button onClick={()=>setTab(file.fileName)} key={file.fileName} className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted ',
                        {
                            'bg-primary text-primary-foreground ': tab===file.fileName,
                        }
                    )} >
                        {file.fileName}

                    </button>
                ))}

            </div>

            {filesReferences.map(file => (
                <TabsContent key={file.fileName} value={file.fileName } className='max-h-[40vh] overflow-scroll max-w-7xl rounded-md scrollbar-hover ' >
                    <SyntaxHighlighter  language='typescript' style={lucario} >
                            {file.sourceCode}
                    </SyntaxHighlighter>
                </TabsContent>
            ))}

        </Tabs>
        </div>
  )
}

export default CodeReferences
