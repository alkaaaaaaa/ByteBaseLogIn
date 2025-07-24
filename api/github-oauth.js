
export default async function handler(request, response) {
  // 只允许 POST 请求
  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { code } = request.body;

    if (!code) {
      response.status(400).json({ error: 'Missing authorization code' });
      return;
    }

    // 从 Vercel 的环境变量中安全地获取 secrets
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      // 将 GitHub 的错误信息传递给前端
      response.status(tokenResponse.status).json(data);
    } else {
      response.status(200).json(data);
    }
  } catch (error) {
    console.error('Error in Vercel function:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
