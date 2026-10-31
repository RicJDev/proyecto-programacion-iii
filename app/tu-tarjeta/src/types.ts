export type Gender = 'M' | 'F'

export interface Vaccine {
  name: string
  doses: string[]
}

export interface ParentData {
  name: string
  relationship: string
  phone: string
}

export interface Patient {
  name: string
  gender: Gender
  birthday: string
  parent: ParentData
}
