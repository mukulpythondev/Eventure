export type CreateUserParams = {
    clerkId: string
    firstName: string
    lastName: string
    // userName: string
    email: string
    profile: string
  }
  export type UpdateUserParams = {
    firstName: string
    lastName: string
    // userName: string
    profile: string
  }
  export type CreateEventParams = {
    userId: string
    event: {
      title: string
      description: string
      venue: string
      eventImage: string
      startDateTime: Date
      endDateTime: Date
      category: string
      price?: number
      isPaid?: boolean
      hostEmail: string
      totalSeats: number

    }
    path: string
  }
  export type UpdateEventParams = {
    userId: string
    event: {
      _id:string
      title: string
      description: string
      location: string
      eventImage: string
      startDateTime: Date
      endDateTime: Date
      category: string
      price: number
      isPaid: boolean
      hostEmail: string
      totalSeats: number

    }
    path: string
  }
  export type DeleteEventParams = {
    eventId: string
    path: string
  }
  
  export type GetAllEventsParams = {
    query: string
    category: string
    limit: number
    page: number
  }
  
  export type GetEventsByUserParams = {
    userId: string
    limit?: number
    page: number
  }
 