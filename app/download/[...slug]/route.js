import {
	S3Client,
	GetObjectCommand
} from '@aws-sdk/client-s3'

const client = new S3Client({
	region: process.env.AWS_S3_REGION,
})

const Bucket = process.env.AWS_S3_BUCKET

async function responseS3Object(Key) {
	const command = new GetObjectCommand({ Bucket, Key })

	const res = await client.send(command)
	return new Response(res.Body)
}

export async function GET(req, opt) {
    try {
        const {slug} = opt.params
		const fname = slug.join('/')
        const res = await responseS3Object(fname)
		return res
    }
    catch(e) {
		console.log('<<< caught error >>>')
		if (e.Code === 'NoSuchKey') return new Response('Not Found', {status:404, headers:{'Content-Type': 'text/plain;charset=utf-8'} })
        return new Response(e.message, {status:500, headers:{'Content-Type': 'text/plain;charset=utf-8'} })
    }
}