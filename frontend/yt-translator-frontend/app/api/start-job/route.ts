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
      videoId,
      userId,
      status: 'pending',
      createdAt: timestamp,
    },
  };
  console.log('DynamoDB params: ', dynamoParams);

  try {
    await dynamodb.put(dynamoParams).promise();
    console.log('Successfully wrote to DynamoDB');

    // Call your local API endpoint
    const downloadApiUrl = 'http://localhost:3000/download';
    const downloadApiPayload = { videoUrl };

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
      // Optionally return an error to the client if the local API call fails
      return NextResponse.json(
        { message: 'Job started and data saved, but error calling download API', videoId },
        { status: downloadApiResponse.status }
      );
    }

    const downloadApiData = await downloadApiResponse.json();
    console.log('Local API response:', downloadApiData);

    return NextResponse.json({ message: 'Job started and download initiated', videoId, downloadApiData });

  } catch (dynamoDbErr) {
    console.error('DynamoDB error:', dynamoDbErr);
    return NextResponse.json({ error: 'Failed to write to database' }, { status: 500 });
  }
}