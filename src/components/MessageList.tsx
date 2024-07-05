import { Message } from 'ai/react'
import React from 'react'
import { cn } from "@/lib/utils";
import Markdown from 'markdown-to-jsx';

type Props ={
    messages:Message[]
};

export const MessageList = ({messages}: Props) => {
    if(!messages) return <></>
    return (
        <div className="flex flex-col gap-2 px-4">
            {messages.map(message =>{
                return (
                    <div key={message.id}
                        className={cn('flex',{
                            'justify-end':message.role === 'user',
                            'justify-start':message.role === 'assistant',
                        })}>
                    <div className={
                        cn('rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10',{
                            'bg-blue-600 text-white':message.role === 'user',
                        })
                    }>
                        <Markdown className={cn(
                  {'prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none break-words text-black dark:text-white text-sm md:text-base font-medium':message.role==='assistant'}
                )}>
                    {message.content}    
                    </Markdown>
                        
                    </div>

                    </div>
                )
            })}
        </div>
    )
}
