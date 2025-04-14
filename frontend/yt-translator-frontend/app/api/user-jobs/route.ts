import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({ region: 'us-west-2' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const params = {
    TableName: 'YTTranslationJobs',
    KeyConditionExpression: 'userid = :uid',
    ExpressionAttributeValues: {
      ':uid': userId,
    },
  };

  try {
    const data = await dynamodb.query(params).promise();
    return NextResponse.json({ items: data.Items || [] });
  } catch (err) {
    console.error('DynamoDB query error:', err);
    return NextResponse.json({ error: 'Error querying DynamoDB' }, { status: 500 });
  }
}
