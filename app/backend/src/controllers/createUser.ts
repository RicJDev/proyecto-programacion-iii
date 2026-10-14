import User from '@/models/user'
import { Request, Response } from 'express'

export async function createUser(req: Request, res: Response) {
  const user = await User.create(req.body)

  res.status(201).json(user)
}
