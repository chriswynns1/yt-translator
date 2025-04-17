import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-west-2' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { videoUrl, userId, userEmail } = body;

  if (!videoUrl || !userId) {
    return NextResponse.json({ error: 'Missing video URL or user ID' }, { status: 400 });
  }

  const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  const videoId = videoIdMatch?.[1];

  if (!videoId) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }

  const timestamp = new Date().toISOString();

  const dynamoParams = {
    TableName: 'YTTranslationJobs',
    Item: {
      userid: `${userId}`,
      videoid: `${videoId}`,
      videoUrl,
      userEmail,
      status: 'pending',
      createdAt: timestamp,
    },
  };
  console.log('DynamoDB params: ', dynamoParams);

  try {
    await dynamodb.put(dynamoParams).promise();
    console.log('Successfully wrote to DynamoDB');

    const downloadApiUrl = 'http://eukksmequf.a.pinggy.link/download';
    const downloadApiPayload = { videoUrl, userId };

    console.log('Calling local API:', downloadApiUrl, downloadApiPayload);

    const downloadApiResponse = await fetch(downloadApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(downloadApiPayload),
    });

    if (!downloadApiResponse.ok) {
      console.error('Error calling local API:', downloadApiResponse.status, await downloadApiResponse.text());
      return NextResponse.json(
        { message: 'Job started and data saved, but error calling download API', videoId },
        { status: downloadApiResponse.status }
      );
    }

    const downloadApiData = await downloadApiResponse.json();
    console.log('Local API response:', downloadApiData);

    // Update the status in DynamoDB to "uploaded"
    const updateParams = {
      TableName: 'YTTranslationJobs',
      Key: {
        userid: `${userId}`,
        videoid: `${videoId}`,
      },
      UpdateExpression: 'set #s = :newStatus',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':newStatus': 'uploaded',
      },
    };

    await dynamodb.update(updateParams).promise();
    console.log('Successfully updated status to uploaded');

    return NextResponse.json({ message: 'Job started and download initiated', videoId, downloadApiData });

  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Failed to process job' }, { status: 500 });
  }
}
