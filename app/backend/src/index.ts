import express from 'express'
import dotenv from 'dotenv'
import userRoutes from '@/routes/users.routes'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/users', userRoutes)

app.get('/', (_, res) => {
  res.send('API is running, bruh')
})

const PORT = process.env.PORT ?? 5000

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`)
})
