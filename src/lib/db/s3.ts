//import AWS from "aws-sdk";
import { PutObjectCommand} from "@aws-sdk/client-s3"
import * as dotenv from "dotenv";
import s3 from '@/lib/s3-client';

dotenv.config({ path: ".env" });

export async function uploadToS3(file:File){
    console.log("uploadToS3");
    try{
        /*
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        })
        const file_key = 'updloads/' + Date.now().toString() + file.name.replace(' ','-')
        const s3 = new AWS.S3(
            {
                region: "us-east-2",
                credentials: {
                  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
                }, 
            }
        )
            */
        /*
        const s3 = new S3Client({
            region: "us-east-2",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
            },
        });
        */

        const file_key = 'updloads/' + Date.now().toString() + file.name.replace(' ','-')

        
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: file_key,
            Body: file,
        }
        try{
            const data = await s3.send(new PutObjectCommand(params));
            console.log('successfully uploaded to s3',file_key,file.name);

        }catch(err){
            console.log(err);
        }
        /*
        const upload = s3.putObject(params).on('httpUploadProgress', evt =>{
            console.log('uploading to s3...',parseInt((evt.loaded / evt.total).toString()))+"%";
        }).promise()
        await upload.then(data => {
            console.log('successfully uploaded to s3',file_key,file.name)
        }).catch(err => {
            console.log(err)
        })
        */
        
        return Promise.resolve({
            file_key,
            file_name:file.name,
        });

        
    }catch(err){
        console.log(err);
    }
}

export function getS3Url(file_key:string){
    const encoded_url = encodeURIComponent(file_key);
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${encoded_url}`
    console.log('url'+url);
    return url;
}