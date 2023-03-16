import requestIp from 'request-ip'
import { appendFile, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const statistics = async (req, res, next) => {
  const day = new Date().toLocaleDateString().replaceAll('\/', '-')
  const time = new Date().toLocaleString()
  const ip = requestIp.getClientIp(req)
  const agent = req.headers['user-agent']
  const simpleLog = `[${time}] <${ip}> (${agent})\n`

  const dir = path.resolve(__dirname, '../../log')

  try {
    await stat(path.resolve(dir, day))
    await appendFile(path.resolve(dir, day), simpleLog)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(path.resolve(dir, day), simpleLog)
    } else {
      await writeFile(path.resolve(dir, day), `[${time}] ${err.toString()}`)
    }
  }

  next()
}


export { statistics }
