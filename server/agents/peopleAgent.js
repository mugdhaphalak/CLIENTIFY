require('dotenv').config()
const Groq = require('groq-sdk')
const { webSearch } = require('../utils/searchClient')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function peopleAgent(company, category, searchContext) {
  console.log('   → Searching for real decision makers...')

  const [leaderSearch, linkedinSearch] = await Promise.all([
    webSearch(`${searchContext} CMO "chief marketing officer" OR "VP marketing" OR "head of marketing" OR "brand director" 2024`),
    webSearch(`${company} marketing head brand manager LinkedIn site:linkedin.com 2024`)
  ])

  const res = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `You are a B2B lead researcher who finds real decision makers at companies.
Return ONLY valid JSON. No backticks. No explanation outside JSON.
STRICT RULES:
- Only include people who are confirmed in the search results provided
- Use the exact job titles found in search results
- For LinkedIn URL always use format linkedin.com/in/firstname-lastname with actual name
- For email always use format firstname.lastname@companydomain.com
- Do not invent or guess people who are not mentioned in the search results
- Focus only on marketing brand and communications roles not operations or finance`
      },
      {
        role: 'user',
        content: `Find 3 current senior decision makers at "${company}" (${category}) that a brand or marketing agency should contact.

Only look for people in these roles:
- Chief Marketing Officer or CMO
- VP of Marketing or Vice President Marketing
- Head of Marketing or Head of Brand
- Brand Director or Marketing Director
- Chief Growth Officer
- Head of Communications or PR

REAL SEARCH RESULTS ABOUT THEIR LEADERSHIP:
${leaderSearch}

LINKEDIN SEARCH RESULTS:
${linkedinSearch}

Use only names that appear in the search results above.
For the company email domain use the most likely domain for ${company}.

Return ONLY this JSON with no extra text:
{
  "decision_makers": [
    {
      "name": "real full name exactly as found in search results",
      "title": "their exact current job title from search results",
      "relevance": "write one very specific sentence explaining exactly why a brand or marketing agency should contact this specific person and what decisions they control",
      "linkedin": "linkedin.com/in/firstname-lastname",
      "email": "firstname.lastname@companydomain.com",
      "phone": null
    },
    {
      "name": "second real person found in search results",
      "title": "their exact current title",
      "relevance": "one specific sentence on why contact this person and what they control",
      "linkedin": "linkedin.com/in/firstname-lastname",
      "email": "firstname.lastname@companydomain.com",
      "phone": null
    },
    {
      "name": "third real person found in search results",
      "title": "their exact current title",
      "relevance": "one specific sentence on why contact this person and what they control",
      "linkedin": "linkedin.com/in/firstname-lastname",
      "email": "firstname.lastname@companydomain.com",
      "phone": null
    }
  ]
}`
      }
    ],
    max_tokens: 1000,
    temperature: 0.2
  })

  const text = res.choices[0]?.message?.content || ''
  try {
    return JSON.parse(text)
  } catch(e) {
    const match = text.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : { decision_makers: [] }
  }
}

module.exports = peopleAgent