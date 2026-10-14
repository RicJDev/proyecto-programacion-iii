import { Request, Response } from 'express'

export function getUsers(_: Request, res: Response) {
  res.json({ message: 'users fetched' })
}
