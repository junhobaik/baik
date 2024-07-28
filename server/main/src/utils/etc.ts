import https from 'https';
import ogs from 'open-graph-scraper';
import { URL } from 'url';

export const extractOpenGraphData = (url: string): Promise<{ [key: string]: string }> => {
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

export const extractOpenGraphDataUseScraper = async (url: string): Promise<{ [key: string]: string } | null> => {
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

export const extractRSSFeedUrl = (url: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const checkPath = async (path: string): Promise<string | null> => {
      return new Promise((resolveCheck) => {
        const options = {
          hostname: parsedUrl.hostname,
          path: path,
          method: 'HEAD',
        };

        const req = https.request(options, (res) => {
          if (res.statusCode === 200) {
            resolveCheck(new URL(path, url).href);
          } else {
            resolveCheck(null);
          }
        });

        req.on('error', () => resolveCheck(null));
        req.end();
      });
    };

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
        // RSS 피드 URL을 찾기 위한 정규 표현식들
        const rssRegexes = [
          /<link[^>]+type=["']application\/rss\+xml["'][^>]*href=["']([^"']+)["']/i,
          /<link[^>]+href=["']([^"']+)["'][^>]*type=["']application\/rss\+xml["']/i,
          /<link[^>]+rel=["']alternate["'][^>]*type=["']application\/rss\+xml["'][^>]*href=["']([^"']+)["']/i,
          /<link[^>]+href=["']([^"']+\.rss)["']/i,
        ];

        for (const regex of rssRegexes) {
          const match = regex.exec(data);
          if (match && match[1]) {
            // 상대 URL을 절대 URL로 변환
            const feedUrl = new URL(match[1], url).href;
            resolve(feedUrl);
            return;
          }
        }

        // HTML에서 RSS 링크를 찾지 못한 경우, 일반적인 경로 확인
        const commonPaths = ['/rss.xml', '/feed', '/rss', '/atom.xml', '/feed.xml'];
        for (const path of commonPaths) {
          const feedUrl = await checkPath(path);
          if (feedUrl) {
            resolve(feedUrl);
            return;
          }
        }

        // RSS 피드 URL을 찾지 못한 경우
        resolve(null);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};
