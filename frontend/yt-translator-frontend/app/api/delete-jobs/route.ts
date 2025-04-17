import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-west-2' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, jobs } = body;
    
    if (!userId || !jobs || !Array.isArray(jobs)) {
      return NextResponse.json({ error: 'Missing userId or jobs' }, { status: 400 });
    }
    console.log('userid: ', userId)
    //console.log('vid id:', jobs.videoId)
    const deleteRequests = jobs.map((job) => ({
      DeleteRequest: {
        Key: {
          userid: userId,          // Partition key
          videoId: job.videoId,    // Sort key (update this if your table uses a different sort key)
        },
      },
    }));
    
    const params = {
      RequestItems: {
        YTTranslationJobs: deleteRequests,
      },
    };
    
    try {
      await dynamodb.batchWrite(params).promise();
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Error deleting jobs:', err);
      return NextResponse.json({ error: 'Failed to delete jobs' }, { status: 500 });
    }
    
}
