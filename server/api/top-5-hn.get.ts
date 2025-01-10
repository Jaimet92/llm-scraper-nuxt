import { z } from 'zod'
import LLMScraper from 'llm-scraper-worker'
import { createOpenAI } from '@ai-sdk/openai'
// import { createWorkersAI } from 'workers-ai-provider'

export default defineCachedEventHandler(async () => {
  const startTime = Date.now()
  console.time('total-execution')

  console.time('browser-init')
  const { page } = await hubBrowser()
  console.timeEnd('browser-init')

  console.time('ai-init')
  // Cloudflare Workers AI implementation
  // const workersAI = createWorkersAI({ binding: hubAI() })
  // const llm = workersAI('@cf/meta/llama-3.1-70b-instruct')

  // OpenAI implementation
  // console.log(process.env.OPENAI_API_KEY)
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const llm = openai.chat('gpt-3.5-turbo')
  console.timeEnd('ai-init')

  console.time('scraper-init')
  const scraper = new LLMScraper(llm)
  console.timeEnd('scraper-init')

  console.time('page-navigation')
  await page.goto('https://news.ycombinator.com')
  console.timeEnd('page-navigation')

  // Define schema to extract contents into
  const schema = z.object({
    top: z
      .array(
        z.object({
          title: z.string(),
          points: z.number(),
          by: z.string(),
          commentsURL: z.string(),
          externalURL: z.string(),
        }),
      )
      .max(10)
      .describe('Top 10 stories on Hacker News'),
  })

  console.time('scraping-execution')
  const { data } = await scraper.run(page, schema, {
    format: 'html',
  })
  console.timeEnd('scraping-execution')

  console.timeEnd('total-execution')
  const executionTime = Date.now() - startTime

  return {
    info: 'This API call is cached for 10 minutes to avoid abuse',
    executionTime: `${executionTime}ms`,
    timestamp: new Date().toISOString(),
    ...data,
  }
}, {
  maxAge: 60 * 10,
})
