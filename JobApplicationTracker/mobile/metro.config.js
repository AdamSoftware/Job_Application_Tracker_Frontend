const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// Some React Native asset transforms still request the legacy subpath.
// RN 0.83 ships the registry through its dedicated assets-registry package.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolvedName = moduleName === 'react-native/asset-registry'
    ? '@react-native/assets-registry/registry'
    : moduleName

  return context.resolveRequest(context, resolvedName, platform)
}

module.exports = config
