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
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', { status: 400 });
  }

  // Handle different event types
  const eventType = evt.type;

  switch (eventType) {
    case 'user.created': {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || '',
        profile: image_url || '',
        firstName: first_name || '',
        lastName: last_name || '',
        userName: username || '',
      };

      const newUser = await createUser(user) as DBUser;
      if (newUser) {
        const client = await clerkClient()

        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id.toString(),
          },
        });
      }

      return NextResponse.json({ message: 'User created successfully', user: newUser });
    }

    case 'user.updated': {
      const { id, image_url, first_name, last_name, username } = evt.data;
      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        userName: username || '',
        profile: image_url || '',
      };

      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
    }

    case 'user.deleted': {
      const { id } = evt.data;
      const deletedUser = await deleteUser(id!);
      return NextResponse.json({ message: 'User deleted successfully', user: deletedUser });
    }

    default:
      console.log(`Unhandled event type: ${eventType}`);
      return new Response('Unhandled event type', { status: 400 });
  }
}
