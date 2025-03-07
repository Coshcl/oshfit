import { NextResponse } from 'next/server'
import { 
  getWorkoutsByUserId, 
  addWorkout, 
  updateWorkout, 
  deleteWorkout 
} from '@/lib/db/models/workout'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    const workouts = await getWorkoutsByUserId(userId)
    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, workout } = await request.json()

    if (!userId || !workout) {
      return NextResponse.json({ error: 'userId and workout are required' }, { status: 400 })
    }

    await addWorkout(userId, workout)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { workoutId, workout } = await request.json()

    if (!workoutId || !workout) {
      return NextResponse.json({ error: 'workoutId and workout are required' }, { status: 400 })
    }

    await updateWorkout(workoutId, workout)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const workoutId = searchParams.get('workoutId')

  if (!workoutId) {
    return NextResponse.json({ error: 'workoutId is required' }, { status: 400 })
  }

  try {
    await deleteWorkout(workoutId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 