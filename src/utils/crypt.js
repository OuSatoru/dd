import md5 from 'crypto-js/md5'

export function calcPwd(real) {
  return md5(real).toString()
}
