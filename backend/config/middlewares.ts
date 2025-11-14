export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://ndport-n582.onrender.com','https://justonemore.bet', 'https://www.justonemore.bet', 'http://localhost:3000'], // your frontend domain
      headers: [
        'Content-Type',
        'Authorization',
        'Origin',
        'Accept',
        'Keep-Alive',
        'User-Agent',
        'If-Modified-Since',
        'Cache-Control',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      keepHeaderOnError: true,
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
