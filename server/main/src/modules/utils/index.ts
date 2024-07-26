import { ActionResult } from '@baik/types';
import https from 'https';
import ogs from 'open-graph-scraper';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { URL } from 'url';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const translate = async ({
  text,
  language,
  option,
}: {
  text: string;
  language: string;
  option?: string;
}): Promise<ActionResult> => {
  try {
    const prompt = text;

    const systemMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You will be provided with a sentence in Korean, and your task is to translate it into ${language}.`,
      },
      {
        role: 'system',
        content: `If it's text in Markdown format, translate it without breaking the formatting`,
      },
    ];
    if (option) systemMessages.push({ role: 'system', content: option });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [...systemMessages, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
    });

    const translatedText = completion.choices[0].message.content;

    return {
      data: { item: translatedText, success: true },
      message: 'Successfully translated text',
    };
  } catch (error) {
    return {
      message: 'Failed to translate text',
      error: {
        code: 'UTILS>TRANSLATE_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const extractOpenGraphData = (url: string): Promise<{ [key: string]: string }> => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const ogData: { [key: string]: string } = {};
        const ogRegex = /<meta\s+(?:property|name)=["']og:([^"']+)["']\s+content=["']([^"']+)["']/gi;

        let match;
        while ((match = ogRegex.exec(data)) !== null) {
          ogData[match[1].toLowerCase()] = match[2]; // 키를 소문자로 저장
        }

        resolve(ogData);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

const extractOpenGraphDataUseScraper = async (url: string): Promise<{ [key: string]: string } | null> => {
  const response = await fetch(url, { redirect: 'follow' });
  const finalUrl = response.url;

  const options = { url: finalUrl };
  const { result, error } = await ogs(options);

  if (result) {
    const ogData: { [key: string]: string } = {};
    if (result.ogTitle) ogData.title = result.ogTitle;
    if (result.ogDescription) ogData.description = result.ogDescription;
    if (result.ogImage && result.ogImage[0].url) ogData.image = result.ogImage[0].url;
    ogData.url = result.ogUrl || finalUrl;
    return ogData;
  }

  if (error) {
    console.error('Error fetching Open Graph data:', error);
    return null;
  }

  return null;
};

const getOpenGraphData = async ({ url }: { url: string }): Promise<ActionResult> => {
  try {
    let ogData = await extractOpenGraphData(url);

    // If no data is found using extractOpenGraphData, try extractOpenGraphDataUseScraper
    if (Object.keys(ogData).length === 0) {
      console.log('No Open Graph data found using extractOpenGraphData. Trying extractOpenGraphDataUseScraper...');
      const scraperData = await extractOpenGraphDataUseScraper(url);
      if (scraperData) {
        ogData = scraperData;
      }
    }

    if (Object.keys(ogData).length === 0) {
      return {
        message: 'No Open Graph data found',
        error: {
          code: 'UTILS>OG_DATA_NOT_FOUND',
          message: 'The requested URL does not contain Open Graph metadata',
        },
      };
    } else {
      return {
        data: { item: ogData, success: true },
        message: 'Successfully retrieved Open Graph data',
      };
    }
  } catch (error) {
    return {
      message: 'Failed to retrieve Open Graph data',
      error: {
        code: 'UTILS>OG_DATA_ERROR',
        message: error instanceof Error ? error.message : String(error),
      },
    };
  }
};

const getSiteData = async ({ url }: { url: string }): Promise<ActionResult> => {
  return new Promise((resolve) => {
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', async () => {
        const siteInfo: { [key: string]: string } = {};

        // Extract title
        const titleMatch = /<title>(.*?)<\/title>/i.exec(data);
        if (titleMatch) {
          siteInfo['title'] = titleMatch[1];
        }

        // Extract description
        const descriptionMatch = /<meta\s+name="description"\s+content="([^"]+)"/i.exec(data);
        if (descriptionMatch) {
          siteInfo['description'] = descriptionMatch[1];
        }

        // Extract favicon URL
        const faviconMatch = /<link\s+rel="(?:shortcut )?icon"\s+(?:href="([^"]+)")?/i.exec(data);
        if (faviconMatch && faviconMatch[1]) {
          siteInfo['favicon_url'] = new URL(faviconMatch[1], url).href;
        }

        // Extract feed URL
        const feedMatch =
          /<link\s+rel="alternate"\s+type="application\/(?:rss\+xml|atom\+xml)"\s+(?:title="[^"]+"\s+)?href="([^"]+)"/i.exec(
            data,
          );
        if (feedMatch && feedMatch[1]) {
          siteInfo['feed_url'] = new URL(feedMatch[1], url).href;
        } else {
          // If feed URL not found in <link> tag, try common patterns
          const commonFeedPaths = ['/feed', '/rss', '/atom', '/rss.xml', '/atom.xml', '/index.xml'];
          for (const path of commonFeedPaths) {
            const feedUrl = new URL(path, url).href;
            try {
              const response = await fetch(feedUrl);
              if (response.ok && response.headers.get('content-type')?.includes('xml')) {
                siteInfo['feed_url'] = feedUrl;
                break;
              }
            } catch (error) {
              console.error(`Error checking feed URL ${feedUrl}:`, error);
            }
          }
        }

        if (Object.keys(siteInfo).length === 0) {
          resolve({
            message: 'No site information found',
            error: {
              code: 'UTILS>SITE_INFO_NOT_FOUND',
              message: 'The requested URL does not contain the required metadata',
            },
          });
        } else {
          resolve({
            data: { item: siteInfo, success: true },
            message: 'Successfully retrieved site information',
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        message: 'Failed to retrieve site information',
        error: {
          code: 'UTILS>SITE_INFO_ERROR',
          message: error.message,
        },
      });
    });

    req.end();
  });
};

export default {
  translate: {
    run: translate,
    skip_auth: false,
  },
  getOpenGraphData: {
    run: getOpenGraphData,
    skip_auth: false,
  },
  getSiteData: {
    run: getSiteData,
    skip_auth: false,
  },
};
