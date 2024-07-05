'use client'

import {useDropzone} from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { Inbox,Loader2 } from "lucide-react"
import { uploadToS3 } from '@/lib/db/s3'
import React, {useCallback} from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast'
import {useRouter} from 'next/navigation';


const FileUpload = () => {
    console.log("FileUpload");
    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);
    const {mutate} = useMutation({
        
        mutationFn: async ({
            file_key,
            file_name
        }:{
            file_key:string,
            file_name:string
        }) => {
            const response = await axios.post('/api/create-chat',{
                file_key:file_key,
                file_name:file_name,
            });
            return response.data;
        },
        });
        
    const onDrop = useCallback((acceptedFiles: any) => {
        // Do something with the files
        console.log("acceptedFiles",acceptedFiles);
      }, [])
      const {getRootProps, getInputProps} = useDropzone(
        
        {
            accept: { "application/pdf": [".pdf"] },
            maxFiles: 1,
            onDrop: async(acceptedFiles) => {
            console.log("acceptedFiles",acceptedFiles);
            const file = acceptedFiles[0];
            
            if (file.size > 10*1024*1024) {
                toast.error('File is too large. Please upload a file smaller than 10MB.');
                //console.log('File is too large. Please upload a file smaller than 10MB.');
                return;
            }
            try{
                setUploading(true);
                const data = await uploadToS3(file);
                console.log("after uploadToS3 data",data);
                if(!data?.file_key||!data.file_name){
                    toast.error('Something went wrong while uploading file to S3');
                    //console.log('Something went wrong with data');
                    return;
                }
                
                mutate(data,{
                    onSuccess: ({chat_id}) => {
                        toast.success('Chat created successfully');
                        console.log("chat_id",chat_id);
                        router.push(`/chat/${chat_id}`);
                    },
                    onError: (error) => {
                        toast.error('Error creating chat');
                        //console.log("error",error);
                    },
                });

                //console.log("data",data);

            }catch(error){
                console.log(error);
            } finally{
                setUploading(false);
            }
            
            
        },})
    
    return (
        <div className='p-2 bg-white rounded-x1'>FileUpload
            <div {...getRootProps({
                className: 'border-dashed border-2 rounded-x1 cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
            })}>
                <input {...getInputProps()} />
                {(uploading) ?(
                    <>
                    <Loader2 className="w-10 h-10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">
                        Spilling Tea to GPT
                    </p>
                    </>
                ):(
                    <>
                    <Inbox className="w-10 h-10 text-blue-500" />
                    <p className="mt-2 text-sm text-slate-400">
                        Drop PDF Here
                    </p>
                    </>

                )}
                
            </div>
            
        </div>
       
    )
}

export default FileUpload
