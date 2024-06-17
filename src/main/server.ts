import { env } from '@/lib/env'
import { app } from './config/app'

const PORT = Number(env.PORT)
app.listen(PORT).then(() => {
  console.log(`Server running at http://localhost:${PORT}`)
})
