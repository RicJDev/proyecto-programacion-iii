import { prisma } from '../config/client'
import { Request, Response } from 'express'
import { constants } from 'node:http2'

export async function createUser(req: Request, res: Response) {
  const newUser = await prisma.user.create({
    // Obvio hay que validar el esquema antes, pero lo dejaremos asi por los jajas
    data: req.body,
  })

  res.status(constants.HTTP_STATUS_CREATED).json({
    message: `User ${newUser.name} has been created!`,
  })
}

export async function getUsers(_: Request, res: Response) {
  res.json({ message: 'users fetched' })
}

export async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
      message: 'id is invalid',
    })
    return
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!user) {
    res.status(constants.HTTP_STATUS_NOT_FOUND).json({
      message: 'user not found',
    })
    return
  }

  res.status(constants.HTTP_STATUS_OK).json({
    message: `Say hello to ${user.name}!`,
  })
}
