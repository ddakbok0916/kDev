/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
    debug: process.env.NODE_ENV === 'local',
    i18n: {
      defaultLocale: 'ko',
      locales: ['ko', 'en'],
    },
    reloadOnPrerender: process.env.NODE_ENV === 'local',
  }