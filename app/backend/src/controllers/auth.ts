import { Request, Response } from 'express'
import { constants } from 'node:http2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma, JWT_SECRET, JWT_EXPIRES_IN } from '../config'

// Usuarios precargados del sistema para desarrollo / fallback
const mockUsers = [
  {
    id: 1,
    name: 'Dra. Carmen Mendoza',
    email: 'admin@healthsystem.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    roles: ['ADMIN'],
    permissions: ['READ_USERS', 'MANAGE_IMMUNIZATIONS', 'FULL_CONTROL'],
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 2,
    name: 'Dr. Roberto Velásquez',
    email: 'regional@salud.gob',
    passwordHash: bcrypt.hashSync('password123', 10),
    roles: ['REGIONAL'],
    permissions: ['MANAGE_CENTERS', 'READ_REPORTS'],
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 3,
    name: 'Lic. Elena Ramos',
    email: 'local@salud.gob',
    passwordHash: bcrypt.hashSync('password123', 10),
    roles: ['LOCAL'],
    permissions: ['MANAGE_STAFF', 'MANAGE_STOCK'],
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 4,
    name: 'Enf. Cristian Feo',
    email: 'crisnotanfeo@gmail.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    roles: ['OPERATOR'],
    permissions: ['MANAGE_IMMUNIZATIONS'],
    createdAt: new Date('2026-01-01'),
  },
]

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

    let userFound: {
      id: number
      name: string
      email: string
      passwordHash: string
      roles: string[]
      permissions: string[]
      createdAt: Date
    } | null = null

    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      })

      if (dbUser) {
        userFound = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          passwordHash: dbUser.passwordHash,
          roles: dbUser.roles.map((r) => r.name),
          permissions: Array.from(
            new Set(dbUser.roles.flatMap((r) => r.permissions.map((p) => p.name))),
          ),
          createdAt: dbUser.createdAt,
        }
      }
    } catch {
      // Si la base de datos MariaDB/MySQL no está activa localmente, usamos fallback
      console.warn('Prisma DB not available, checking mock users fallback')
    }

    if (!userFound) {
      const fallback = mockUsers.find((u) => u.email.toLowerCase() === normalizedEmail)
      if (fallback) {
        userFound = fallback
      }
    }

    if (!userFound) {
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Credenciales inválidas',
      })
      return
    }

    const passwordMatches = await bcrypt.compare(password, userFound.passwordHash)
    if (!passwordMatches) {
      res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: 'Credenciales inválidas',
      })
      return
    }

    const token = jwt.sign(
      {
        sub: userFound.id,
        email: userFound.email,
        roles: userFound.roles,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    )

    res.status(constants.HTTP_STATUS_OK).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
        roles: userFound.roles,
        permissions: userFound.permissions,
        createdAt: userFound.createdAt,
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
