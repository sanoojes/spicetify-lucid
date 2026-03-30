export function isVersionAtLeast(targetVersion: string) {
  const current = Spicetify?.Platform?.version?.split('.').map(Number) || [0, 0, 0];
  const target = targetVersion.split('.').map(Number);

  for (let i = 0; i < target.length; i++) {
    if ((current[i] || 0) > target[i]) return true;
    if ((current[i] || 0) < target[i]) return false;
  }
  return true;
}

export function isLinux() {
  if (Spicetify?.Platform?.operatingSystem.toLowerCase().includes('linux')) return true;

  if (Spicetify.Platform?.PlatformData?.os_name)
    return Spicetify.Platform.PlatformData.os_name.toLowerCase().includes('linux');

  return false;
}

export function isMac() {
  if (Spicetify?.Platform?.operatingSystem.toLowerCase().includes('mac')) return true;

  if (Spicetify.Platform?.PlatformData?.os_name)
    return Spicetify.Platform.PlatformData.os_name.toLowerCase().includes('mac');

  return false;
}

export function isWindows() {
  if (Spicetify?.Platform?.operatingSystem === 'Windows') return true;

  if (Spicetify.Platform?.PlatformData?.os_name)
    return Spicetify.Platform.PlatformData.os_name.toLowerCase().includes('win');

  return false;
}
