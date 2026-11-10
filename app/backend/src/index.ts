import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/api.routes'
import { HOST, PORT } from './config'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`server is running at http://${HOST}:${PORT}`)
})
