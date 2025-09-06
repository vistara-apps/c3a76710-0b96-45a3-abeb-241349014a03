import { NextRequest, NextResponse } from 'next/server';
import { neynarService } from '@/lib/services/neynar';
import { databaseService } from '@/lib/services/database';
import { generateId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, signature, message } = body;

    if (!fid || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: fid, signature, message' },
        { status: 400 }
      );
    }

    // Verify the signature with Neynar
    const isValidSignature = await neynarService.verifySignature(message, signature, fid);
    
    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get user data from Farcaster
    const farcasterUser = await neynarService.getUserByFid(fid);
    
    if (!farcasterUser) {
      return NextResponse.json(
        { error: 'User not found on Farcaster' },
        { status: 404 }
      );
    }

    // Check if user exists in our database
    let user = await databaseService.getUserByFarcasterFid(fid);
    
    if (!user) {
      // Create new user
      user = await databaseService.createUser({
        userId: generateId(),
        displayName: farcasterUser.display_name,
        farcasterUsername: farcasterUser.username,
        farcasterFid: farcasterUser.fid,
      });
    } else {
      // Update existing user data
      user = await databaseService.updateUser(user.userId, {
        displayName: farcasterUser.display_name,
        farcasterUsername: farcasterUser.username,
      });
    }

    // Check user's premium subscriptions
    const subscriptions = await databaseService.getUserSubscriptions(user.userId);
    const hasNotificationAccess = await databaseService.hasActiveSubscription(
      user.userId,
      'notifications'
    );
    const hasProjectLinking = await databaseService.hasActiveSubscription(
      user.userId,
      'project_linking'
    );

    return NextResponse.json({
      success: true,
      user,
      features: {
        notifications: hasNotificationAccess,
        projectLinking: hasProjectLinking,
      },
      subscriptions,
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const user = await databaseService.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check user's premium subscriptions
    const subscriptions = await databaseService.getUserSubscriptions(user.userId);
    const hasNotificationAccess = await databaseService.hasActiveSubscription(
      user.userId,
      'notifications'
    );
    const hasProjectLinking = await databaseService.hasActiveSubscription(
      user.userId,
      'project_linking'
    );

    return NextResponse.json({
      success: true,
      user,
      features: {
        notifications: hasNotificationAccess,
        projectLinking: hasProjectLinking,
      },
      subscriptions,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}
