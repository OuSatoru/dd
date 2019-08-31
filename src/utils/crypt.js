import md5 from 'crypto-js'

export function calcPwd(real) {
  return md5(real).toString()
}
