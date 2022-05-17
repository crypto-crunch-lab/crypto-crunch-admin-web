import { atom } from 'recoil'

const menuState = atom<string>({
  key: 'menuState',
  default: '0-0',
})

const subMenuState = atom<string>({
  key: 'subMenuState',
  default: '0',
})

export const ATOMS = {
  menuState,
  subMenuState,
}
