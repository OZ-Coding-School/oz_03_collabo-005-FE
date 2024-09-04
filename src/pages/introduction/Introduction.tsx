import 'react-notion/src/styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { NotionRenderer } from 'react-notion';

export default function ReactNotion() {
  const [response, setResponse] = useState({});

  useEffect(() => {
    const NOTION_PAGE_ID = 'f92d717ea09e4471b440ab5812d7c613';
    axios.get(`https://notion-api.splitbee.io/v1/page/${NOTION_PAGE_ID}`).then(({ data }) => {
      setResponse(data);
    });

    // 상단 메뉴를 숨기기 위한 CSS 적용
    const style = document.createElement('style');
    style.innerHTML = `
      .notion-page-header {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="p-4">{Object.keys(response).length && <NotionRenderer blockMap={response} fullPage={true} />}</div>
  );
}
