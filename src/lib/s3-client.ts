import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "ap-southeast-2",
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    },
});
console.log(s3);

export default s3;