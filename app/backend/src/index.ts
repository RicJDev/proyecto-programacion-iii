import express from 'express'
import apiRoutes from './routes/api.routes'
import { BACKEND_HOST, BACKEND_PORT } from './config'

const app = express()

app.use(express.json())
app.use('/api', apiRoutes)

app.listen(BACKEND_PORT, () => {
  console.log(`server is running at http://${BACKEND_HOST}:${BACKEND_PORT}`)
})
