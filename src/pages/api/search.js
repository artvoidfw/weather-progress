export default async function handler(req, res) {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(200).json({ results: [] });
  }

  const trimmedQuery = query.trim();

  try {
    const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedQuery)}&count=10&language=en&format=json`;
    const openRes = await fetch(openMeteoUrl);
    const openData = await openRes.json();

    if (openData.results && openData.results.length > 0) {
      const mapped = openData.results.map((item) => ({
        id: `loc-${item.id}`,
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || item.admin2 || '',
        latitude: item.latitude,
        longitude: item.longitude,
        country_code: item.country_code
      }));
      return res.status(200).json({ results: mapped });
    }
  } catch (err) {
    return res.status(500).json({ error: "Failed to search locations", results: [] });
  }

  return res.status(200).json({ results: [] });
}
