require('dotenv').config()
const Groq = require('groq-sdk')
const { webSearch, getNews } = require('../utils/searchClient')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

function safeParseJSON(text) {
  try {
    const cleaned = text
      .replace(/[\x00-\x1F\x7F]/g, ' ')
      .replace(/\t/g, ' ')
      .trim()
    return JSON.parse(cleaned)
  } catch(e) {
    try {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        const cleaned = match[0]
          .replace(/[\x00-\x1F\x7F]/g, ' ')
          .replace(/\t/g, ' ')
        return JSON.parse(cleaned)
      }
    } catch(e2) {
      console.error('JSON parse failed:', e2.message)
      console.error('Raw text was:', text.slice(0, 200))
    }
    return null
  }
}

async function askGroq(system, user) {
  try {
    const res = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user   }
      ],
      max_tokens: 2000,
      temperature: 0.3
    })
    const text = res.choices[0]?.message?.content || ''
    console.log('   → Raw response preview:', text.slice(0, 100))
    const parsed = safeParseJSON(text)
    if (!parsed) {
      console.error('   → Parse failed for response')
      return {}
    }
    return parsed
  } catch(err) {
    console.error('   → Groq call failed:', err.message)
    return {}
  }
}

async function researchAgent(company, category, searchContext) {
  console.log('   → Searching web for real data about', company)

  let generalData  = ''
  let revenueData  = ''
  let campaignData = ''
  let competitorData = ''
  let eventsData   = ''
  let newsData     = ''

  try {
    const results = await Promise.all([
      webSearch(`${company} company overview 2024`),
      webSearch(`${company} revenue annual report 2024`),
      webSearch(`${company} marketing campaign launch 2023 2024`),
      webSearch(`${company} ${category} competitors 2024`),
      webSearch(`${company} events sponsorship activation 2024`),
      getNews(company)
    ])
    generalData    = results[0] || ''
    revenueData    = results[1] || ''
    campaignData   = results[2] || ''
    competitorData = results[3] || ''
    eventsData     = results[4] || ''
    newsData       = results[5] || ''
  } catch(e) {
    console.error('   → Search error:', e.message)
  }

  console.log('   → Search done. General data length:', generalData.length)

  // Overview and market
  console.log('   → Building overview...')
  const part1 = await askGroq(
    `You are a senior brand intelligence analyst.
Return ONLY valid JSON. No backticks. No markdown. No text before or after the JSON.
Use facts from search results. For well known companies use your own knowledge if search results are limited.
Never return empty strings for any field. Always write something meaningful.`,

    `Analyze the company "${company}" which is a "${category}".

Search results:
${generalData || 'Limited search data available'}

Revenue data:
${revenueData || 'Limited revenue data available'}

News:
${newsData || 'No news available'}

Return ONLY this JSON. Fill every field with real information. Never leave any field empty:
{
  "overview": {
    "business_model": "explain specifically how ${company} makes money",
    "scale": "number of users or customers, revenue, employees, countries",
    "positioning": "their real tagline or brand positioning",
    "founded": "year founded",
    "hq": "headquarters city and country",
    "revenue_scale": "annual revenue with year"
  },
  "market": {
    "brand_perception": "2 sentences on how public sees ${company}",
    "perception_score": 7,
    "recent_shifts": "2 specific things that changed recently",
    "market_share_est": "percentage or rank in market",
    "consumer_sentiment": "positive or mixed or negative"
  }
}`
  )

  // Competitors
  console.log('   → Building competitors...')
  const part2 = await askGroq(
    `You are a competitive intelligence analyst.
Return ONLY valid JSON. No backticks. No text before or after JSON.
Only list currently active companies. Never leave fields empty.`,

    `List 4 real active competitors of "${company}" in the "${category}" space.

Competitor data:
${competitorData || 'Use your knowledge about this industry'}

Return ONLY this JSON with real specific information:
{
  "competitors": [
    {
      "name": "competitor name",
      "positioning": "how they position themselves",
      "recent_activity": "specific thing they did in 2023 or 2024",
      "strength": "specific advantage over ${company}",
      "gap": "specific weakness vs ${company}"
    },
    {
      "name": "competitor 2",
      "positioning": "",
      "recent_activity": "",
      "strength": "",
      "gap": ""
    },
    {
      "name": "competitor 3",
      "positioning": "",
      "recent_activity": "",
      "strength": "",
      "gap": ""
    },
    {
      "name": "competitor 4",
      "positioning": "",
      "recent_activity": "",
      "strength": "",
      "gap": ""
    }
  ]
}`
  )

  // Campaigns and events
  console.log('   → Building activity and events...')
  const part3 = await askGroq(
    `You are a brand activity researcher.
Return ONLY valid JSON. No backticks. No text before or after JSON.
Only include campaigns from 2023 or 2024.
Never write not publicly reported — describe what happened instead.`,

    `List real campaigns and events by "${company}" in 2023 and 2024.

Campaign data:
${campaignData || 'Use your knowledge about this brand'}

Events data:
${eventsData || 'Use your knowledge about this brand'}

News:
${newsData || 'No news available'}

Return ONLY this JSON:
{
  "activity": [
    {
      "name": "campaign name",
      "period": "Month Year",
      "description": "what this campaign was about",
      "impact": "what it achieved"
    },
    {
      "name": "campaign 2",
      "period": "",
      "description": "",
      "impact": ""
    },
    {
      "name": "campaign 3",
      "period": "",
      "description": "",
      "impact": ""
    }
  ],
  "events": [
    {
      "name": "event name",
      "type": "type of event",
      "scale": "local or national or global",
      "outcome": "what happened"
    },
    {
      "name": "event 2",
      "type": "",
      "scale": "",
      "outcome": ""
    }
  ]
}`
  )

  // Watchouts
  console.log('   → Building watchouts...')
  const part4 = await askGroq(
    `You are a senior strategic brand consultant.
Return ONLY valid JSON. No backticks. No text before or after JSON.
Write specific watchouts for this exact company. Never write generic risks.`,

    `Identify 3 specific strategic risks for "${company}" (${category}).

Context:
${generalData.slice(0, 500) || 'Use your knowledge about this company'}

Competitor context:
${competitorData.slice(0, 300) || 'Use your knowledge about competitors'}

Return ONLY this JSON:
{
  "watchouts": [
    {
      "title": "specific risk name",
      "description": "2 sentences explaining this specific risk for ${company}",
      "severity": "high"
    },
    {
      "title": "risk 2",
      "description": "2 sentences",
      "severity": "medium"
    },
    {
      "title": "risk 3",
      "description": "2 sentences",
      "severity": "low"
    }
  ]
}`
  )

  // Log what we got
  console.log('   → Overview keys:', Object.keys(part1.overview || {}))
  console.log('   → Competitors count:', (part2.competitors || []).length)
  console.log('   → Activity count:', (part3.activity || []).length)
  console.log('   → Watchouts count:', (part4.watchouts || []).length)

  return {
    overview:    part1.overview    || {},
    market:      part1.market      || {},
    competitors: part2.competitors || [],
    activity:    part3.activity    || [],
    events:      part3.events      || [],
    watchouts:   part4.watchouts   || []
  }
}

module.exports = researchAgent