const userInput = "<script>alert('XSS')</script>";
document.body.innerHTML = userInput;  // 未清理直接插入

const userInput2 = "<script>alert('XSS')</script>";
const sanitizedInput = DOMPurify.sanitize(userInput2);
document.body.innerHTML = sanitizedInput;