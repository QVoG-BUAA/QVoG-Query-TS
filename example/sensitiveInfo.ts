function processPayment(cardNumber: string, cvv: string) {
    // 错误示例：直接在日志中打印敏感信息
    console.log(`Processing payment with card number: ${cardNumber} and CVV: ${cvv}`);

    // 模拟支付处理逻辑
    // ...
}

const cardNumber = "1234-5678-9876-5432";
const cvv = "123";
processPayment(cardNumber, cvv);
