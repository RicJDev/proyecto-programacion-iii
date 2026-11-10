import { Request, Response } from 'express'
import { constants } from 'node:http2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma, JWT_SECRET, JWT_EXPIRES_IN } from '../config'

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: 'Correo electrónico y contraseña son requeridos',
      })
      return
    }

    const normalizedEmail = String(email).trim().toLowerCase()

    const dbUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        roles: {
          include: { permissions: true },
        },
      },
    })

    if (!dbUser) {
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Credenciales inválidas',
      })
      return
    }

    const passwordMatches = await bcrypt.compare(password, dbUser.passwordHash)
    if (!passwordMatches) {
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Credenciales inválidas',
      })
      return
    }

    const token = jwt.sign(
      {
        sub: dbUser.id,
        email: dbUser.email,
        roles: dbUser.roles.map((r) => r.name),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    )

    res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        roles: dbUser.roles.map((r) => r.name),
        permissions: Array.from(
          new Set(dbUser.roles.flatMap((r) => r.permissions.map((p) => p.name))),
        ),
        createdAt: dbUser.createdAt,
      },
    })
  } catch (error) {
    console.error('Error in login controller:', error)
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error interno del servidor al procesar el inicio de sesión',
    })
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.status(constants.HTTP_STATUS_OK).json({
    success: true,
    message: 'Sesión cerrada exitosamente',
  })
}
