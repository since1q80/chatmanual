import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from '@/lib/s3-client';
import fs from 'fs';
import path from 'path';




export async function downloadS3File(fileKey: string) :Promise<string> {
    return new Promise(async(resolve,reject)=>{
        try{
            const params = {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
                Key: fileKey,
                
            }
            const command = new GetObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
                Key: fileKey,
            })
            const obj = await s3.send(command);
            const file_name = path.join("/tmp", Date.now().toString() + ".pdf");
            if (obj.Body instanceof require("stream").Readable) 
            {
                // AWS-SDK v3 has some issues with their typescript definitions, but this works
                // https://github.com/aws/aws-sdk-js-v3/issues/843
                //open the writable stream and write the file
                const file = fs.createWriteStream(file_name);
                file.on("open", function (fd) {
                // @ts-ignore
                obj.Body?.pipe(file).on("finish", () => {
                    return resolve(file_name);
                });
                });
            }
        }catch (error) {
        console.error(error);
        reject(error);
        return null;
        }
    });
}

export async function getPdfFromS3(fileKey: string){
    /*
    console.log("getPdfFromS3")
    const command = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: fileKey,
    })
    const response = await s3.send(command);
    // 提取 PDF 内容
    
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(await response.Body.transformToByteArray());
    const pdfText = data.pages.map(page => page.content).join(" ");
    
    
    
    
    return pdfText;
    */
    return "";

}