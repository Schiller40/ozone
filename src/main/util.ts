import { Redis } from 'ioredis'
import { Service, Inject } from 'typedi'
import dotProp from 'dot-prop'
import { debuglog } from 'util'
const debug = debuglog('util')
import fs from 'fs'
const fsP = fs.promises

@Service('store')
export class Store {
  constructor(@Inject('redis') private redis: Redis) {
    // redis.set(
    // 	'device',
    // 	JSON.stringify({
    // 		id: 'DID',
    // 		name: 'DNAME',
    // 		location: 'DLOCATION'
    // 	})
    // )
    // redis.set(
    // 	'network',
    // 	JSON.stringify({
    // 		name: 'very nice network',
    // 		secure: false
    // 	})
    // )
  }

  async get(path: string) {
    const query = parseDotPath(path)
    const data = JSON.parse(await this.redis.get(query.group))
    if (query.restPath) {
      return dotProp.get(data, query.restPath) || null
    }
    return data
  }
  async set(path: string, value: any) {
    const query = parseDotPath(path)
    if (query.restPath) {
      const data = JSON.parse(await this.redis.get(query.group)) || {}
      dotProp.set(data, query.restPath, value)
      await this.redis.set(query.group, JSON.stringify(data))
    } else {
      await this.redis.set(query.group, JSON.stringify(value))
    }
  }
  async has(path: string) {
    const query = parseDotPath(path)
    if (query.restPath) {
      const data = JSON.parse(await this.redis.get(query.group))
      return dotProp.has(data, query.restPath)
    } else {
      return !!(await this.redis.exists(query.group))
    }
  }
  async values(path: string) {
    const query = parseDotPath(path)
    let data: any
    if (query.restPath) {
      const raw = JSON.parse(await this.redis.get(query.group))
      data = dotProp.get(raw, query.restPath)
    } else {
      data = JSON.parse(await this.redis.get(query.group))
    }
    return Object.values(data || {})
  }
  async keys(path: string) {
    const query = parseDotPath(path)
    let data: any
    if (query.restPath) {
      const raw = JSON.parse(await this.redis.get(query.group))
      data = dotProp.get(raw, query.restPath)
    } else {
      data = JSON.parse(await this.redis.get(query.group))
    }
    return Object.keys(data || {})
  }
}

function parseDotPath(path: string) {
  const parts = path.split('.')
  return {
    group: parts.shift(),
    restPath: parts.join('.')
  }
}

export function getJSON(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fsP
      .readFile(path)
      .then(data => {
        resolve(JSON.parse(data.toString()))
      })
      .catch(e => {
        reject(e)
      })
  })
}
