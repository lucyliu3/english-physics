// yaml-parse.js — 极简 YAML 解析器（v2）
// 专门为 vocabulary.yaml 设计，处理嵌套对象 + 对象数组 + 字符串

export function parse(yaml) {
  const lines = yaml.split('\n');
  const root = {};
  // state: { indent, obj }  obj 是当前正在操作的对象
  const stack = [{ indent: -1, obj: root }];
  // 跟踪哪些 key 被标记为数组
  const arrayKeys = new Set();

  // 预扫描：找出所有数组（key: 后面跟 - 缩进行）
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const content = line.trim();
    const indent = line.search(/\S/);

    if (content.includes(':') && !content.startsWith('-')) {
      const colonIdx = content.indexOf(':');
      const rest = content.slice(colonIdx + 1).trim();
      if (rest === '' && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const nextIndent = nextLine.search(/\S/);
        if (nextLine.trim().startsWith('- ') && nextIndent > indent) {
          const key = content.slice(0, colonIdx).trim();
          // 标记在缩进层级 indent 下的 key 为数组
          // 不能在 Set 里存对象比较，但可以用路径字符串
          arrayKeys.add(`${indent}:${key}`);
        }
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    // 弹栈
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const ctx = stack[stack.length - 1];
    const obj = ctx.obj;

    if (content.startsWith('- ')) {
      // 数组项
      const rest = content.slice(2).trim();
      const colonIdx = rest.indexOf(':');

      if (colonIdx >= 0 && colonIdx < rest.length - 1) {
        // "- key: value" → 对象字面量属性
        const k = rest.slice(0, colonIdx).trim();
        const v = rest.slice(colonIdx + 1).trim();
        const item = {};
        item[k] = parseValue(v);
        if (Array.isArray(obj)) {
          obj.push(item);
          stack.push({ indent, obj: item });
        }
      } else if (colonIdx === rest.length - 1) {
        // "- key:" → 对象，后续缩进是属性
        const k = rest.slice(0, colonIdx).trim();
        const item = {};
        if (Array.isArray(obj)) {
          obj.push(item);
        }
        stack.push({ indent, obj: item });
      } else {
        // "- value" → 简单值
        if (Array.isArray(obj)) {
          obj.push(parseValue(rest));
        }
      }
    } else {
      // key: value 行
      const colonIdx = content.indexOf(':');
      const key = content.slice(0, colonIdx).trim();
      let rest = content.slice(colonIdx + 1).trim();

      if (rest === '') {
        // 子节点
        const isArr = arrayKeys.has(`${indent}:${key}`);
        if (isArr) {
          obj[key] = [];
          stack.push({ indent, obj: obj[key] });
        } else {
          obj[key] = {};
          stack.push({ indent, obj: obj[key] });
        }
      } else if (rest.startsWith('|')) {
        const lines_arr = [rest.slice(1).trim()];
        while (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const nextIndent = nextLine.search(/\S/);
          if (nextIndent <= indent) break;
          lines_arr.push(nextLine.trim());
          i++;
        }
        obj[key] = lines_arr.join('\n');
      } else {
        obj[key] = parseValue(rest);
      }
    }
  }

  return root;
}

function parseValue(str) {
  if (str === 'true') return true;
  if (str === 'false') return false;
  if (str === 'null' || str === '~') return null;
  const num = Number(str);
  if (!isNaN(num) && str !== '') return num;
  if ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1);
  }
  return str;
}
