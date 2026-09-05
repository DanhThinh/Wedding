import type { CSSProperties, ElementType } from 'react';

interface RevealTitleProps {
  /** Nội dung thuần văn bản — sẽ được tách theo từ để chạy hiệu ứng mặt nạ. */
  text: string;
  as?: ElementType;
  className?: string;
}

/**
 * Tiêu đề tách theo từ: mỗi từ trượt lên từ sau một tấm mặt nạ, lệch pha nhau.
 * Hiệu ứng do CSS lo (`.title-words` trong _motion.scss), reveal engine chỉ
 * gắn class `is-revealed` khi tiêu đề vào khung nhìn.
 */
export default function RevealTitle({ text, as: Tag = 'h2', className = '' }: RevealTitleProps) {
  const words = text.split(' ');

  return (
    <Tag className={`${className} title-words`.trim()} data-reveal="fade">
      {words.map((word, index) => (
        // Khoảng trắng để ngoài `.word` vì phần tử đó bị `overflow: hidden` cắt mất.
        <span key={`${word}-${index}`} aria-hidden="true">
          <span className="word" style={{ '--word-index': index } as CSSProperties}>
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
      {/* Giữ nguyên câu gốc cho trình đọc màn hình, tránh đọc rời từng từ. */}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
