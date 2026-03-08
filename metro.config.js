const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { resolver } = config;

config.resolver = {
  ...resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  resolverMainFields: ['react-native', 'browser', 'main'],
  resolveRequest: (context, moduleName, platform) => {
    if (platform === 'web') {
      // Return empty module stubs for native-only packages on web
      const nativeOnlyModules = [
        'react-native-maps',
        'react-native-swiper',
        '@react-native-community/datetimepicker',
        'react-native-gesture-handler',
      ];

      for (const mod of nativeOnlyModules) {
        if (moduleName === mod || moduleName.startsWith(mod + '/')) {
          return { type: 'empty' };
        }
      }
    }

    // Fall back to default resolution
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;