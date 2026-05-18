export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  aerodatabox: {
    apiKey: process.env.AERODATABOX_API_KEY,
  },
  weather: {
    apiKey: process.env.WEATHER_API_KEY,
  },
});
