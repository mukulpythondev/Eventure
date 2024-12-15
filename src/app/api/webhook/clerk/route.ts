import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';
import { CreateUserParams } from '@/types';

interface DBUser extends CreateUserParams {
  _id: string;
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error('Error: SIGNING_SECRET is missing in the environment variables');
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  console.log('Initializing webhook verification process...');
  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('Headers extracted:', { svix_id, svix_timestamp, svix_signature });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error: Missing Svix headers');
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    console.log('Verifying webhook payload...');
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;

    console.log('Webhook payload verified successfully');
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', { status: 400 });
  }

  // Handle different event types
  const eventType = evt.type;
  console.log(`Received event of type: ${eventType}`);

  switch (eventType) {
    case 'user.created': {
      console.log('Processing user.created event...');
      const { id, email_addresses, image_url, first_name, last_name} = evt.data;
      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || '',
        profile: image_url || '',
        firstName: first_name || '',
        lastName: last_name || '',
        // userName: username || '',
      };

      console.log('User data extracted:', user);

      const newUser = await createUser(user) as DBUser;
      if (newUser) {
        const client = await clerkClient()

        console.log('Updating Clerk user metadata with new user ID...');
        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id.toString(),
          },
        });

        console.log('Clerk user metadata updated successfully');
      }

      return NextResponse.json({ message: 'User created successfully', user: newUser });
    }

    case 'user.updated': {
      console.log('Processing user.updated event...');
      const { id, image_url, first_name, last_name } = evt.data;
      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        // userName: username || '',
        profile: image_url || '',
      };

      console.log('User data to update:', user);
      const updatedUser = await updateUser(id, user);
      console.log('User updated successfully:', updatedUser);
      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    }

    case 'user.deleted': {
      console.log('Processing user.deleted event...');
      const { id } = evt.data;
      console.log('Deleting user with ID:', id);
      const deletedUser = await deleteUser(id!);
      console.log('User deleted successfully:', deletedUser);
      return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
    }

    default:
      console.log(`Unhandled event type: ${eventType}`);
      return new Response('Unhandled event type', { status: 400 });
  }
}
