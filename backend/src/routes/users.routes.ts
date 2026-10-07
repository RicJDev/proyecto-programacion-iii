import { Router } from 'express'
import { getUsers } from '@/controllers/getUsers'
import { createUser } from '@/controllers/createUser'

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)

export default router
