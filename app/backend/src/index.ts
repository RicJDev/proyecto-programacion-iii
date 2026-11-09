import express from 'express'
import apiRoutes from './routes/api.routes'
import { HOST, PORT } from './config'

const app = express()

app.use(express.json())
app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log(`server is running at http://${HOST}:${PORT}`)
})
