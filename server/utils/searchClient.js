require('dotenv').config()
const axios = require('axios')

async function webSearch(query) {
  try {
    const res = await axios.post(
      'https://google.serper.dev/search',
      { q: query, num: 8 },
      { headers: { 'X-API-KEY': process.env.SERPER_API_KEY } }
    )
    return (res.data.organic || [])
      .map(r => `${r.title}: ${r.snippet}`)
      .join('\n')
  } catch(err) {
    console.error('Search error:', err.message)
    return ''
  }
}

async function getNews(company) {
  try {
    const res = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: company,
        sortBy: 'publishedAt',
        pageSize: 6,
        language: 'en',
        apiKey: process.env.NEWS_API_KEY
      }
    })
    return (res.data.articles || [])
      .map(a => `${a.title}: ${a.description}`)
      .join('\n')
  } catch(err) {
    console.error('News error:', err.message)
    return ''
  }
}

module.exports = { webSearch, getNews }