import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, PutObjectCommandInput, PutBucketCorsCommand, ListObjectsV2Command, GetObjectTaggingCommand, PutObjectTaggingCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import * as https from "https";

const corsConfig = {
    Bucket: process.env.S3_BUCKET_NAME!,
    CORSConfiguration: {
        CORSRules: [
            {
                AllowedHeaders: ['*'],
                AllowedMethods: ['PUT', 'POST', 'GET'],
                AllowedOrigins: ['*'],
                ExposeHeaders: ['ETag'],
                MaxAgeSeconds: 3000,
            },
        ],
    },
};

let s3: S3Client;
export const getClient = async () => {

    const S3_ENDPOINT = process.env.S3_ENDPOINT;
    if (!S3_ENDPOINT) throw new Error("S3_ENDPOINT is not defined");
    const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
    if (!S3_ACCESS_KEY) throw new Error("S3_ACCESS_KEY is not defined");
    const S3_SECRET_KEY = process.env.S3_SECRET_KEY;
    if (!S3_SECRET_KEY) throw new Error("S3_SECRET_KEY is not defined");

    if (!s3) {
        s3 = new S3Client({
            region: "us-east-1",
            endpoint: S3_ENDPOINT as string,
            credentials: {
                accessKeyId: S3_ACCESS_KEY as string,
                secretAccessKey: S3_SECRET_KEY as string,
            },
            forcePathStyle: true,
            requestHandler: new NodeHttpHandler({
                httpsAgent: new https.Agent({
                    rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
                }),
            }),
        });
        try {
            const command = new PutBucketCorsCommand(corsConfig);
            await s3.send(command);
            console.log('✅ CORS configuration applied successfully.');
        } catch (err) {
            console.error('❌ Failed to apply CORS:', err);
        }
    }
    return s3;
};




export async function scanDirectory(prefix: string = "/", maxLength: number = 100, next?: string | null): Promise<{ files: any[]; next?: string | null }> {

    const s3 = await getClient();

    const command = new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: prefix,
        Delimiter: "/",
        MaxKeys: maxLength,
        ContinuationToken: next || undefined,
    });

    try {
        const data = await s3.send(command);
        return {
            files: data.Contents?.map(e => e.Key) || [],
            next: data.NextContinuationToken || null,
        };
    } catch (err) {
        console.error("Error listing S3 directory:", err);
        return {
            files: [],
            next: null,
        };
    }
}



export async function updatedAttribute(filePath: string, attrs: { [key: string]: string | boolean }) {

    const s3 = await getClient();
    const bucket = process.env.S3_BUCKET_NAME!;

    try {

        // 1. Get existing tags
        const getTags = new GetObjectTaggingCommand({ Bucket: bucket, Key: filePath });
        const currentTagsResponse = await s3.send(getTags);
        const currentTagSet = currentTagsResponse.TagSet || [];

        // 2. Merge with new tags
        const updatedTagSet = [
            ...currentTagSet.filter((tag): tag is { Key: string; Value: string } => tag.Key !== undefined && !(tag.Key in attrs)),
            ...Object.entries(attrs).map(([Key, Value]) => ({
                Key,
                Value: String(Value),
            })),
        ];

        console.log("updatedTagSet", updatedTagSet)

        // 3. Apply updated tags
        const putTags = new PutObjectTaggingCommand({
            Bucket: bucket,
            Key: filePath,
            Tagging: { TagSet: updatedTagSet },
        });

        await s3.send(putTags);
        return { status: true, message: "Tags updated successfully" };
        
    } catch (err) {
        console.error("Error updating tags:", err);
        return { status: false, message: "Failed to update tags" };
    }
}





export async function deleteDirectory(prefix: string) {
    const s3 = await getClient();

    // List all objects under the prefix
    const list = await s3.send(new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME,
        Prefix: prefix.endsWith("/") ? prefix : `${prefix}/`,
    }));

    if (!list.Contents || list.Contents.length === 0) return;

    const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
            Objects: list.Contents.map(obj => ({ Key: obj.Key! })),
        },
    };

    await s3.send(new DeleteObjectsCommand(deleteParams));
    console.log(`✅ Deleted ${list.Contents.length} objects under ${prefix}`);
}



/**
 * Upload a file to IDCloudHost S3
 */
export async function uploadFile(content: Buffer, destinationKey: string, contentType?: string) {
    const s3 = await getClient();
    const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

    const uploadParams: PutObjectCommandInput = {
        Bucket: BUCKET_NAME,
        Key: destinationKey.replace(/^(\/|\\)/, ""),
        Body: content,
        ContentType: contentType || "application/octet-stream",
        ACL: "public-read",
        CacheControl: "max-age=31536000"
    };
    return s3.send(new PutObjectCommand(uploadParams));
}



/**
 * Delete a file from IDCloudHost S3
 */
export async function deleteFile(destinationKey: string) {
    const s3 = await getClient();
    const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

    const deleteParams = {
        Bucket: BUCKET_NAME,
        Key: destinationKey,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

}


/**
 * Get a file (download) from IDCloudHost S3 and return it as a proper parsed object
 */
export async function getFile<T>(destinationKey: string): Promise<T | null> {
    const s3 = await getClient();
    const BUCKET_NAME = process.env.S3_BUCKET_NAME as string;

    const getParams = {
        Bucket: BUCKET_NAME,
        Key: destinationKey.replace(/^(\/|\\)/, ""),
    };

    try {
        const { Body } = await s3.send(new GetObjectCommand(getParams));

        if (Body instanceof Readable) {
            const chunks: Buffer[] = [];
            for await (const chunk of Body) {
                chunks.push(chunk);
            }
            const buffer = Buffer.concat(chunks);

            // Try to parse the buffer as JSON if the expected type is an object
            if (isJsonType<T>()) {
                const content = buffer.toString('utf-8'); // Convert the buffer to a string first
                return JSON.parse(content) as T; // Parse it into a JavaScript object
            }

            // If it's a string type, return the content as a string
            if (isStringType<T>()) {
                return buffer.toString('utf-8') as unknown as T;
            }

            return buffer as unknown as T; // If no transformation needed, return the buffer directly
        }

        return null;
    } catch (error) {
        console.error("❌ Fetch failed:", error);
        return null;
    }
}

/**
 * Type guard to check if T is expected to be a string.
 */
function isStringType<T>(): boolean {
    return typeof "" as unknown as T === 'string';
}

/**
 * Type guard to check if T is expected to be a JSON object.
 */
function isJsonType<T>(): boolean {
    try {
        JSON.parse('{}'); // Test to check if T is an object
        return true;
    } catch {
        return false;
    }
}
