import { Request, Response } from 'express';

function unsafeRedirect(req: Request, res: Response) {
    const redirectUrl = req.query.url as string; // 从查询参数中获取 URL

    // 错误示例：直接使用用户输入的 URL 进行重定向
    res.redirect(redirectUrl);
}

function safeRedirect(req: Request, res: Response) {
    const redirectUrl = req.query.url as string; // 从查询参数中获取 URL

    // 正确示例：验证 URL 是否属于允许的域名
    if (redirectUrl) {
        const isValidUrl = ['https://example.com', 'https://secure.example.com'].some(domain => redirectUrl.startsWith(domain));

        if (isValidUrl) {
            res.redirect(redirectUrl); // 重定向到安全的 URL
        } else {
            res.status(400).send('Invalid redirect URL');
        }
    } else {
        res.status(400).send('No URL provided');
    }
}

// 假设 Express 应用已经初始化
app.get('/redirect', unsafeRedirect);
app.get('/redirect', safeRedirect);
