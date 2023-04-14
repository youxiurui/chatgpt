// 清空上下文，开启全新的聊天
function clear() {
  fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clear: true,
    }),
  });
}

clear();

const form = document.querySelector('.send');
const textArea = document.querySelector('.send textarea');

textArea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    form.dispatchEvent(new Event('submit'));
  }
});

form.onsubmit = (e) => {
  e.preventDefault();
  // 发送消息
  sendMsg();
};

let isReplying = false; // 是否正在回复中
async function sendMsg() {
  if (isReplying) {
    // 机器人正在回复之前的内容
    return;
  }
  const content = textArea.value.trim();
  if (!content) {
    return; // 无内容
  }
  createUserContent('瑞');
  isReplying = true;
  const robot = createRobotContent();
  const resp = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
    }),
  });
  const reader = resp.body.getReader();
  const decoder = new TextDecoder('utf-8');
  while (1) {
    const { done, value } = await reader.read();
    if (done) {
      // 读完了，没有了
      break;
    }
    const txt = decoder.decode(value);
    robot.append(txt);
  }
  robot.over();
  isReplying = false;
}
