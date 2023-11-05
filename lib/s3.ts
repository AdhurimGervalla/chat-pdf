import AWS from 'aws-sdk';

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-central-1'
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '_');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
        }

        const upload = s3.putObject(params).on('httpUploadProgress', (progress) => {
        }).promise();

        await upload.then((data) => {
            console.log('upload to s3 success', data);
        });

        return Promise.resolve({
            file_key, 
            file_name: file.name
        });

    } catch (err) {
        console.log(err);
    }
}

/**
 * Delete file from s3
 * @param file_key File key to delete from s3
 * @returns Promise<boolean>
 */
export async function deleteFromS3(file_key: string) {
    // delete from s3
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'eu-central-1'
        });

        const toDelete = s3.deleteObject({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        }).promise();

        await toDelete.then((data) => {
            console.log('delete from s3 success', data);
        });

        return Promise.resolve(true);
    } catch (err) {
        console.log(err);
        return Promise.resolve(false);
    }

}

export function getS3Url(file_key: string) {
    return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${file_key}`;
}