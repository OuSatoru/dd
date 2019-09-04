const levelMap = [
  {
    id: 0,
    levelLabel: 'admin',
    levelName: '管理员'
  },
  {
    id: 1,
    levelLabel: 'teacher',
    levelName: '任课教师'
  },
  {
    id: 2,
    levelLabel: 'class',
    levelName: '班主任'
  },
  {
    id: 3,
    levelLabel: 'lesson',
    levelName: '备课组长'
  },
  {
    id: 4,
    levelLabel: 'grade',
    levelName: '年级长'
  }
]

export function tokenTrim(token) {
  return token.replace('-token', '')
}

export function levelLabelNum(label) {
  return levelMap.filter(a => {
    return a.levelLabel !== label
  })[0].id
}
