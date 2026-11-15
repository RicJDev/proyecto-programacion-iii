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
  document: string
  name: string
  gender: Gender
  birthday: string
  email: string
  cardNumber: string
  municipality: string
  parent: ParentData
}
