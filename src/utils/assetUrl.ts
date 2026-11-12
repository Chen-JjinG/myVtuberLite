/** Site-root URL for a file copied into the build output (not a bundled import). */
export function assetUrl(filePath: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const trimmed = filePath.replace(/^\/+/, '')
  return base.endsWith('/') ? `${base}${trimmed}` : `${base}/${trimmed}`
}

export const bundledModels = [
  { id: 1, name: 'Miku2', file: 'source/humanModel/Miku2.vrm' },
  { id: 2, name: 'Miku', file: 'source/humanModel/Miku.vrm' },
] as const

export const bundledBackground = {
  id: 0,
  name: '默认背景',
  file: 'source/images/loginBackground.png',
} as const

export function bundledModelUrl(id: number | undefined | null): string {
  const found = bundledModels.find((model) => model.id === Number(id))
  return assetUrl((found ?? bundledModels[0]).file)
}

export function bundledBackgroundUrl(): string {
  return assetUrl(bundledBackground.file)
}

export function mediapipeHolisticFile(file: string): string {
  return assetUrl(`mediapipe/holistic/${file}`)
}
