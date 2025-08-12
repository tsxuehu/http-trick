export function getQueryParams() {
  // 区分 Hash 模式和 History 模式
  let searchString;

  if (window.location.hash) {
    // Hash 模式：从 # 后面提取参数
    const hash = window.location.hash.slice(1); // 去掉 #
    searchString = hash.split('?')[1] || '';
  } else {
    // History 模式：直接使用 search
    searchString = window.location.search.slice(1); // 去掉 ?
  }

  // 解析参数并返回对象
  return Object.fromEntries(new URLSearchParams(searchString));
}
