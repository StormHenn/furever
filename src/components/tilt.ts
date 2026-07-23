import { TILT } from '../config'

export function tiltDeg(deg: number): string {
  return TILT ? `rotate(${deg}deg)` : 'none'
}
