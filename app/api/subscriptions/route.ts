import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/services/database';

// Feature pricing in ETH (Base network)
const FEATURE_PRICES = {
  notifications: '0.001', // 0.001 ETH for notifications
  project_linking: '0.002', // 0.002 ETH for project linking
  premium_bundle: '0.0025', // 0.0025 ETH for both features
};

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

    const subscriptions = await databaseService.getUserSubscriptions(userId);
    
    // Check active subscriptions
    const hasNotificationAccess = await databaseService.hasActiveSubscription(
      userId,
      'notifications'
    );
    const hasProjectLinking = await databaseService.hasActiveSubscription(
      userId,
      'project_linking'
    );

    return NextResponse.json({
      success: true,
      subscriptions,
      activeFeatures: {
        notifications: hasNotificationAccess,
        projectLinking: hasProjectLinking,
      },
      pricing: FEATURE_PRICES,
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, featureType, transactionHash, duration = 30 } = body;

    if (!userId || !featureType || !transactionHash) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, featureType, transactionHash' },
        { status: 400 }
      );
    }

    // Validate feature type
    const validFeatures = ['notifications', 'project_linking', 'premium_bundle'];
    if (!validFeatures.includes(featureType)) {
      return NextResponse.json(
        { error: 'Invalid feature type' },
        { status: 400 }
      );
    }

    // TODO: Verify transaction on Base network
    // This would involve checking the transaction hash on Base blockchain
    // to ensure payment was made correctly
    
    // For now, we'll assume the transaction is valid
    // In production, you would:
    // 1. Verify the transaction exists on Base
    // 2. Check the amount matches the feature price
    // 3. Ensure the recipient is correct
    // 4. Verify the transaction hasn't been used before

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);

    if (featureType === 'premium_bundle') {
      // Create subscriptions for both features
      await databaseService.createSubscription(userId, 'notifications', expiresAt);
      await databaseService.createSubscription(userId, 'project_linking', expiresAt);
    } else {
      // Create subscription for single feature
      await databaseService.createSubscription(userId, featureType, expiresAt);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      featureType,
      expiresAt,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const featureType = searchParams.get('featureType');

    if (!userId || !featureType) {
      return NextResponse.json(
        { error: 'Missing required parameters: userId, featureType' },
        { status: 400 }
      );
    }

    await databaseService.deactivateSubscription(userId, featureType);

    return NextResponse.json({
      success: true,
      message: 'Subscription deactivated successfully',
    });
  } catch (error) {
    console.error('Deactivate subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate subscription' },
      { status: 500 }
    );
  }
}
