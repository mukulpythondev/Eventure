import { dbConnect } from '@/lib/database/db';
import Event from '@/lib/models/eventModel';
import User from '@/lib/models/userModel';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventId, clerkId, hostId } = req.body;

    // Validate request body
    if (!eventId || !clerkId || !hostId) {
      return res.status(400).json({ error: 'eventId, clerkId, and hostId are required' });
    }

    await dbConnect();

    // Fetch the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Ensure the hitting user is the host of the event
    if (String(event.host) !== String(hostId)) {
      return res.status(403).json({ error: 'Only the event host can mark attendance' });
    }

    // Fetch the user (attendee)
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is an attendee
    if (!event.attendees?.includes(clerkId)) {
      return res.status(400).json({ error: 'User not registered for the event' });
    }

    // Check if attendance is already marked
    if (event.attendance?.includes(clerkId)) {
      return res.status(400).json({ error: 'Attendance already marked' });
    }

    // Mark attendance
    if (!event.attendance) {
      event.attendance = [];
    }
    event.attendance.push(clerkId);
    await event.save();

    return res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ error: 'Failed to mark attendance' });
  }
}
