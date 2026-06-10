// pages/api/ada.js  ← REPLACE your existing file with this
// Now tier-aware: unlimited users get state-specific context

import { createServerClient, createAdminClient } from '../../lib/supabase'

const BASE_SYSTEM_PROMPT_EN = `You are Ada, an AI IEP advocate created by IEP Approved. You help parents, caregivers, and families navigate the special education system with confidence and clarity.

You have deep knowledge of:
- The Individuals with Disabilities Education Act (IDEA) and its requirements
- Section 504 of the Rehabilitation Act
- Americans with Disabilities Act (ADA) in educational contexts
- IEP process: evaluations, eligibility, IEP meetings, services, placement
- Parent rights and procedural safeguards
- Dispute resolution: mediation, due process, state complaints

IMPORTANT GUIDELINES:
- Always be warm, empathetic, and encouraging — you know how overwhelming this process feels
- Provide clear, actionable information in plain language
- Always clarify you provide information, not legal advice
- If a parent seems distressed, acknowledge their feelings first
- Recommend consulting a special education attorney or advocate for complex disputes
- Use The Know Me Method™ principles: Know your child, Know your rights, Know your team

Respond in the language the user writes in. Be thorough but conversational.`

const BASE_SYSTEM_PROMPT_ES = `Eres Ada, una defensora de IEP con IA creada por IEP Approved. Ayudas a padres, cuidadores y familias a navegar el sistema de educación especial con confianza y claridad.

Tienes conocimiento profundo de:
- La Ley de Educación para Individuos con Discapacidades (IDEA) y sus requisitos
- Sección 504 de la Ley de Rehabilitación
- ADA en contextos educativos
- El proceso de IEP: evaluaciones, elegibilidad, reuniones, servicios, colocación
- Derechos de los padres y salvaguardias procedimentales
- Resolución de disputas: mediación, proceso debido, quejas estatales

DIRECTRICES IMPORTANTES:
- Sé siempre cálida, empática y alentadora
- Proporciona información clara y procesable en lenguaje sencillo
- Siempre aclara que proporcionas información, no asesoramiento legal
- Recomienda consultar a un abogado de educación especial para disputas complejas

Responde en el idioma en que escribe el usuario.`

const FREE_DAILY_LIMIT = 3

async function getStateContext(userState) {
  if (!userState) return ''
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('state_content')
    .select('*')
    .or(`state_name.ilike.${userState},state_code.ilike.${userState}`)
    .single()

  if (!data) return ''

  let ctx = `\n\n--- STATE-SPECIFIC: ${data.state_name.toUpperCase()} ---\n`
  if (data.complaint_procedures) ctx += `\nCOMPLAINT PROCEDURES:\n${data.complaint_procedures}\n`
  if (data.pti_centers?.length) {
    ctx += `\nPTI CENTERS:\n`
    data.pti_centers.forEach(c => { ctx += `- ${c.name}: ${c.contact || ''} ${c.website || ''}\n` })
  }
  if (data.advocacy_orgs?.length) {
    ctx += `\nADVOCACY ORGS:\n`
    data.advocacy_orgs.forEach(o => { ctx += `- ${o.name}: ${o.description || ''} ${o.contact || ''}\n` })
  }
  if (data.additional_context) ctx += `\nADDITIONAL CONTEXT:\n${data.additional_context}\n`
  ctx += `\n--- END STATE INFO ---\nWhen relevant, share ${data.state_name}-specific resources proactively.`
  return ctx
}

async function checkAndTrackUsage(userId, supabase) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('questions_used_today, questions_reset_at, tier')
    .eq('id', userId)
    .single()

  if (!profile) return { allowed: false }
  if (profile.tier === 'unlimited') return { allowed: true }

  const now = new Date()
  const resetAt = new Date(profile.questions_reset_at)
  const hoursSince = (now - resetAt) / (1000 * 60 * 60)

  let used = profile.questions_used_today
  if (hoursSince >= 24) {
    used = 0
    await supabase.from('profiles').update({ questions_used_today: 0, questions_reset_at: now.toISOString() }).eq('id', userId)
  }

  if (used >= FREE_DAILY_LIMIT) return { allowed: false, reason: 'daily_limit' }

  await supabase.from('profiles').update({ questions_used_today: used + 1 }).eq('id', userId)
  return { allowed: true, remaining: FREE_DAILY_LIMIT - used - 1 }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { messages, lang = 'en' } = req.body

    // Get user from session
    const supabase = createServerClient(req, res)
    const { data: { user } } = await supabase.auth.getUser()

    let systemPrompt = lang === 'es' ? BASE_SYSTEM_PROMPT_ES : BASE_SYSTEM_PROMPT_EN
    let userTier = 'guest'

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      userTier = profile?.tier || 'free'

      // Check limits
      const usage = await checkAndTrackUsage(user.id, supabase)
      if (!usage.allowed) {
        return res.status(429).json({
          error: 'daily_limit',
          upgrade: true,
          message: lang === 'es'
            ? 'Has alcanzado tu límite diario. Actualiza a Ada Sin Límites para conversaciones ilimitadas.'
            : 'You\'ve reached your daily limit. Upgrade to Ada Unlimited for unlimited conversations.',
        })
      }

      // State context for unlimited users
      if (userTier === 'unlimited' && profile?.state) {
        systemPrompt += await getStateContext(profile.state)
        systemPrompt += `\n\nThis user is Ada Unlimited from ${profile.state}. Provide state resources when relevant.`
      }

// Web search — Unlimited members only
if (userTier === 'unlimited') {
systemPrompt += '\n\nWEB SEARCH:\nYou have access to a web search tool. Use it when a question involves recent policy or regulation changes, current contact information for state agencies, PTI centers, or advocacy organizations, deadlines, or local resources that may have changed. Do not search for settled federal law fundamentals you already know, such as the definitions of FAPE, LRE, or the IEP process. When your answer relies on web results, end with a final section that begins exactly with Sources: listing the source names and links in plain text.'
}

      systemPrompt += `\nUser language preference: ${profile?.language_preference || lang}`
    } else {
      systemPrompt += '\n\nThis is a guest user. Provide federal law information only. Gently mention they can sign up free to track questions and upgrade for state-specific help.'
    }

    // Paid members get the flagship model; free and guest traffic runs on Sonnet (~40% cheaper)
const aiModel = (userTier === 'unlimited' || userTier === 'pro') ? 'claude-opus-4-5' : 'claude-sonnet-4-6'

// Call Anthropic API
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: aiModel,
max_tokens: 2048,
system: systemPrompt,
messages,
...(userTier === 'unlimited' ? { tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }] } : {}),
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      throw new Error(`Anthropic error: ${errText}`)
    }

    const data = await anthropicRes.json()
    const blocks = Array.isArray(data.content) ? data.content : []
const message = blocks.filter(function (b) { return b && b.type === 'text' }).map(function (b) { return b.text }).join('\n').trim()

if (!message) {
throw new Error('Unexpected Anthropic response')
}

return res.status(200).json({ message: message, tier: userTier })

  } catch (err) {
    console.error('Ada API error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
