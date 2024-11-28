/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const { assetExts, sourceExts } = defaultConfig.resolver;

  return {
    resolver: {
      // Ensure .png and other assets are included
      assetExts: [...assetExts, 'png', 'jpg', 'jpeg', 'svg'],
      sourceExts: [...sourceExts, 'js', 'json', 'ts', 'tsx', 'jsx'],
    },
    transformer: {
      // Enable inline requires for performance
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();
