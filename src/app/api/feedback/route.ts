import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_FEEDBACK } from '@/lib/constants';
import type { FeedbackType } from '@/types/chat';

const VALID_FEEDBACK: FeedbackType[] = ['helpful', 'not_helpful'];

export async function POST(request: NextRequest) {
  const result = await validateRequest(request, {
    routeKey: 'feedback',
    ...RATE_LIMIT_FEEDBACK,
  });
  if (isErrorResponse(result)) return result;

  try {
    const { messageIndex, feedback } = await request.json();

    if (typeof messageIndex !== 'number') {
      return NextResponse.json({ error: 'Invalid messageIndex' }, { status: 400 });
    }

    if (!VALID_FEEDBACK.includes(feedback)) {
      return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 });
    }

    console.log(`Feedback: message=${messageIndex}, type=${feedback}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
