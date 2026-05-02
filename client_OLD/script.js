async function analyzeCompany() {
  const company  = document.getElementById('company').value.trim()
  const category = document.getElementById('category').value.trim()

  // Frontend basic checks
  if (!company || !category) {
    document.getElementById('error').innerText = '❌ Please enter both company name and category'
    return
  }

  if (company.length < 2) {
    document.getElementById('error').innerText = '❌ Please enter a valid company name'
    return
  }

  document.getElementById('result').innerHTML  = ''
  document.getElementById('error').innerText   = ''
  document.getElementById('loading').innerHTML =
    '⏳ Verifying company and running intelligence pipeline... this takes 30-40 seconds'

  try {
    const response = await fetch('http://localhost:5000/api/analyze', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ company, category })
    })

    const data = await response.json()
    document.getElementById('loading').innerHTML = ''

    // Handle invalid company error specially
    if (data.is_invalid_company) {
      document.getElementById('error').innerHTML = `
        <div style="background:#1e293b;border:1px solid #ef4444;border-radius:12px;padding:20px;margin-top:20px;text-align:center">
          <div style="font-size:40px;margin-bottom:10px">🚫</div>
          <div style="font-size:18px;font-weight:bold;color:#ef4444;margin-bottom:8px">
            Company Not Found
          </div>
          <div style="font-size:14px;color:#94a3b8;margin-bottom:12px">
            ${data.error}
          </div>
          <div style="font-size:13px;color:#64748b">
            Please try a real company like:<br>
            <span style="color:#38bdf8">Zomato · Tata Motors · HDFC Bank · Flipkart · Infosys</span>
          </div>
        </div>
      `
      return
    }

    // Handle other errors
    if (!data.success) {
      document.getElementById('error').innerText = '❌ Error: ' + data.error
      return
    }

    renderResult(data)

 } catch(err) {
    document.getElementById('loading').innerHTML = ''
    document.getElementById('error').innerHTML = `
      <div style="background:#1e293b;border:1px solid #ef4444;border-radius:12px;padding:20px;margin-top:20px;text-align:center">
        <div style="font-size:40px;margin-bottom:10px">⚠️</div>
        <div style="font-size:16px;font-weight:bold;color:#ef4444;margin-bottom:8px">
          Connection Error
        </div>
        <div style="font-size:14px;color:#94a3b8">
          Cannot connect to server. Make sure you ran: node server/index.js
        </div>
      </div>
    `
  }
}

function renderResult(data) {
  const overview    = data.overview    || {}
  const market      = data.market      || {}
  const competitors = data.competitors || []
  const activity    = data.activity    || []
  const events      = data.events      || []
  const watchouts   = data.watchouts   || []
  const people      = data.people?.decision_makers || []
  const outreach    = data.outreach    || {}
  const tracking    = data.tracking    || {}
  const conclusion  = data.conclusion  || {}

  // Pick color based on verdict
  const verdictColor =
    conclusion.verdict === 'Worth Pitching'       ? '#22c55e' :
    conclusion.verdict === 'Proceed With Caution' ? '#f59e0b' : '#ef4444'

  const verdictEmoji =
    conclusion.verdict === 'Worth Pitching'       ? '✅' :
    conclusion.verdict === 'Proceed With Caution' ? '⚠️' : '❌'

  // Build pitch score bar
  const pitchScore = conclusion.pitch_score || 0
  const scoreBar   = `
    <div style="margin:10px 0">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;color:#94a3b8">Pitch Score</span>
        <span style="font-size:13px;font-weight:bold;color:${verdictColor}">${pitchScore}/10</span>
      </div>
      <div style="background:#334155;border-radius:8px;height:10px;width:100%">
        <div style="background:${verdictColor};height:10px;border-radius:8px;width:${pitchScore * 10}%;transition:width 1s ease"></div>
      </div>
    </div>`

  document.getElementById('result').innerHTML = `

    <!-- SECTION 1 — OVERVIEW -->
    <div class="card">
      <h2 class="section-title">📊 Company Overview</h2>
      <p><b>Business Model:</b> ${overview.business_model || '—'}</p>
      <p><b>Scale:</b> ${overview.scale || '—'}</p>
      <p><b>Positioning:</b> ${overview.positioning || '—'}</p>
      <p><b>Founded:</b> ${overview.founded || '—'}</p>
      <p><b>HQ:</b> ${overview.hq || '—'}</p>
      <p><b>Revenue:</b> ${overview.revenue_scale || '—'}</p>
    </div>

    <!-- SECTION 2 — MARKET -->
    <div class="card">
      <h2 class="section-title">📈 Market Position</h2>
      <p><b>Brand Perception:</b> ${market.brand_perception || '—'}</p>
      <p><b>Perception Score:</b> ${market.perception_score || '—'} / 10</p>
      <p><b>Consumer Sentiment:</b> ${market.consumer_sentiment || '—'}</p>
      <p><b>Market Share:</b> ${market.market_share_est || '—'}</p>
      <p><b>Recent Shifts:</b> ${market.recent_shifts || '—'}</p>
    </div>

    <!-- SECTION 3 — COMPETITORS -->
    <div class="card">
      <h2 class="section-title">⚔️ Competitor Mapping</h2>
      ${competitors.map(c => `
        <div class="mini-card">
          <p><b>${c.name}</b></p>
          <p><b>Positioning:</b> ${c.positioning}</p>
          <p><b>Recent Activity:</b> ${c.recent_activity}</p>
          <p><b>Strength:</b> ✅ ${c.strength}</p>
          <p><b>Gap:</b> ⚠️ ${c.gap}</p>
        </div>
      `).join('')}
    </div>

    <!-- SECTION 4 — BRAND ACTIVITY -->
    <div class="card">
      <h2 class="section-title">📣 Brand Activity (Last 12–24 Months)</h2>
      ${activity.length > 0 ? activity.map(a => `
        <div class="mini-card">
          <p><b>${a.name}</b> — ${a.period}</p>
          <p>${a.description}</p>
          <p><b>Impact:</b> ${a.impact}</p>
        </div>
      `).join('') : '<div class="mini-card"><p>No recent brand activity found</p></div>'}
    </div>

    <!-- SECTION 5 — EVENTS -->
    <div class="card">
      <h2 class="section-title">🎪 Experiential & Events Footprint</h2>
      ${events.length > 0 ? events.map(e => `
        <div class="mini-card">
          <p><b>${e.name}</b> (${e.type})</p>
          <p><b>Scale:</b> ${e.scale}</p>
          <p><b>Outcome:</b> ${e.outcome}</p>
        </div>
      `).join('') : '<div class="mini-card"><p>No recent events found</p></div>'}
    </div>

    <!-- SECTION 6 — WATCHOUTS -->
    <div class="card">
      <h2 class="section-title">🚨 Strategic Watchouts</h2>
      ${watchouts.map(w => `
        <div class="mini-card">
          <p><b>${w.title}</b>
            <span style="color:${
              w.severity === 'high'   ? '#ef4444' :
              w.severity === 'medium' ? '#f59e0b' : '#22c55e'
            }"> [${w.severity}]</span>
          </p>
          <p>${w.description}</p>
        </div>
      `).join('')}
    </div>

    <!-- SECTION 7 AND 8 — PEOPLE AND CONTACTS -->
    <div class="card">
      <h2 class="section-title">👥 Decision Makers & Contact Intelligence</h2>
      ${people.length > 0 ? people.map(p => `
        <div class="mini-card">
          <p><b>${p.name}</b> — ${p.title}</p>
          <p><b>Why contact:</b> ${p.relevance}</p>
          <p><b>Email:</b> ${p.email || '—'}</p>
          <p><b>LinkedIn:</b>
            <a href="https://${p.linkedin}"
               target="_blank"
               style="color:#38bdf8">${p.linkedin}</a>
          </p>
          <p><b>Phone:</b> ${p.phone || 'Not available'}</p>
        </div>
      `).join('') : '<div class="mini-card"><p>No decision makers found</p></div>'}
    </div>

    <!-- SECTION 9 — OUTREACH -->
    <div class="card">
      <h2 class="section-title">✉️ Personalized Outreach</h2>
      <div class="mini-card">
        <p><b>LinkedIn Message:</b></p>
        <p style="color:#e2e8f0;line-height:1.6">
          ${outreach.linkedin_message || '—'}
        </p>
        <p style="color:#64748b;font-size:12px;margin-top:6px">
          ${(outreach.linkedin_message || '').length} / 280 characters
        </p>
      </div>
      <div class="mini-card" style="margin-top:10px">
        <p><b>Email Subject:</b>
          <span style="color:#38bdf8"> ${outreach.email_subject || '—'}</span>
        </p>
        <p style="margin-top:8px"><b>Email Body:</b></p>
        <p style="color:#e2e8f0;white-space:pre-line;line-height:1.7">
          ${outreach.email_body || '—'}
        </p>
      </div>
    </div>

    <!-- SECTION 10 — TRACKING -->
    <div class="card">
      <h2 class="section-title">📡 Outreach Tracking Logic</h2>
      <p><b>Tracking Pixel URL:</b></p>
      <p style="font-family:monospace;font-size:12px;color:#94a3b8;word-break:break-all">
        ${tracking.pixel_url || '—'}
      </p>
      <br>
      <p><b>Follow-up Sequence:</b></p>
      ${(tracking.sequence || []).map(s => `
        <div class="mini-card">
          <p><b>Day ${s.day}:</b> ${s.action}</p>
        </div>
      `).join('')}
      <br>
      <p><b>Effectiveness Metrics:</b></p>
      ${(tracking.metrics || []).map(m => `
        <div class="mini-card">
          <p><b>${m.name}:</b>
            Target ${m.target} — Formula: ${m.formula}
          </p>
        </div>
      `).join('')}
    </div>

    <!-- SECTION 11 — CONCLUSION -->
    <div class="card" style="border:2px solid ${verdictColor}">
      <h2 class="section-title">🎯 Pitch Recommendation</h2>

      <div style="text-align:center;padding:20px 0">
        <div style="font-size:48px">${verdictEmoji}</div>
        <div style="font-size:28px;font-weight:bold;color:${verdictColor};margin:8px 0">
          ${conclusion.verdict || '—'}
        </div>
        <div style="font-size:14px;color:#94a3b8">
          Confidence: ${conclusion.confidence || '—'}
        </div>
      </div>

      ${scoreBar}

      <div class="mini-card" style="margin-top:10px">
        <p><b>Summary:</b></p>
        <p style="color:#e2e8f0;line-height:1.6">
          ${conclusion.summary || '—'}
        </p>
      </div>

      <div class="mini-card" style="margin-top:10px">
        <p><b style="color:#22c55e">✅ Reasons to Pitch:</b></p>
        ${(conclusion.reasons_to_pitch || []).map(r => `
          <p style="color:#e2e8f0;margin:6px 0">• ${r}</p>
        `).join('')}
      </div>

      <div class="mini-card" style="margin-top:10px">
        <p><b style="color:#f59e0b">⚠️ Reasons to Be Cautious:</b></p>
        ${(conclusion.reasons_to_be_cautious || []).map(r => `
          <p style="color:#e2e8f0;margin:6px 0">• ${r}</p>
        `).join('')}
      </div>

      <div class="mini-card" style="margin-top:10px">
        <p><b>🎯 Best Opportunity Angle:</b></p>
        <p style="color:#38bdf8;line-height:1.6">
          ${conclusion.best_opportunity || '—'}
        </p>
      </div>

      <div class="mini-card" style="margin-top:10px">
        <p><b>📅 Best Time to Pitch:</b></p>
        <p style="color:#e2e8f0;line-height:1.6">
          ${conclusion.best_time_to_pitch || '—'}
        </p>
      </div>

      <div class="mini-card"
           style="margin-top:10px;border:1px solid ${verdictColor}">
        <p><b>⚡ Recommended First Step:</b></p>
        <p style="color:#e2e8f0;line-height:1.6">
          ${conclusion.recommended_first_step || '—'}
        </p>
      </div>

    </div>

  `
}