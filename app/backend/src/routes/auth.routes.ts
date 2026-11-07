import { Router } from 'express'
import { constants } from 'node:http2'

const router = Router()

router.post('/login', (_, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_IMPLEMENTED)
    .json({ message: 'login not implemented' })
})

router.post('/logout', (_, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_IMPLEMENTED)
    .json({ message: 'logout not implemented' })
})

export default router
