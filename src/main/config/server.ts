import { app } from '@/main/config/app'

const server = { ...app, address: () => ({ port: process.env.PORT }) }

export { server }
