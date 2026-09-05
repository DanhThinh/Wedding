#!/usr/bin/env node
/**
 * Sinh link thiệp mời riêng cho từng khách.
 *
 *   npm run guests                                  # đọc guests.csv
 *   npm run guests -- --in danhsach.csv             # đổi file đầu vào
 *   npm run guests -- --base https://vidu.com/      # đổi tên miền
 *   npm run guests -- --out links.csv               # đổi file đầu ra
 *
 * File CSV có 2 cột: `xung_ho,ho_ten` (cột xưng hô để trống cũng được).
 * Xem `guests.example.csv`.
 *
 * ⚠️ `guests.csv` và `guests-links.csv` là danh sách khách thật — đã cho vào
 * .gitignore, đừng commit lên repo công khai.
 *
 * Hàm `buildLink` ở đây phải khớp với `parseGuest` trong src/lib/guest.ts;
 * `src/lib/guest.test.ts` import file này để kiểm tra hai bên không lệch nhau.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { argv } from 'node:process';
import { pathToFileURL } from 'node:url';

/* Giữ đồng bộ với src/lib/guest.ts */
const GUEST_NAME_PARAM = 'guest';
const GUEST_TITLE_PARAM = 't';
const GUEST_MAX_LENGTH = 60;

const DEFAULT_BASE = 'https://danhthinh.github.io/Wedding/';
const DEFAULT_IN = 'guests.csv';
const DEFAULT_OUT = 'guests-links.csv';

export function sanitize(value) {
  if (!value) return '';
  const cleaned = String(value)
    .replace(/[\p{Cc}\p{Cf}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return [...cleaned].slice(0, GUEST_MAX_LENGTH).join('').trim();
}

export function buildLink(baseUrl, name, title = '') {
  const cleanName = sanitize(name);
  if (!cleanName) throw new Error('Thiếu họ tên khách mời');

  const url = new URL(baseUrl);
  const cleanTitle = sanitize(title);
  if (cleanTitle) url.searchParams.set(GUEST_TITLE_PARAM, cleanTitle);
  url.searchParams.set(GUEST_NAME_PARAM, cleanName);
  return url.toString();
}

/** Tách một dòng CSV, hiểu được ô bọc trong dấu nháy kép. */
export function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') { current += '"'; i += 1; }
        else inQuotes = false;
      } else current += char;
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      cells.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map(cell => cell.trim());
}

/** Đọc CSV → [{ title, name }]. Bỏ qua dòng trống và dòng tiêu đề. */
export function parseGuestCsv(content) {
  const rows = [];
  const lines = content.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);

    // Dòng đầu là tiêu đề thì bỏ qua.
    if (index === 0 && /ho[_ ]?ten|họ tên|name/i.test(line)) continue;

    // Một cột = chỉ có họ tên; hai cột trở lên = xưng hô, họ tên.
    const [title, name] = cells.length === 1 ? ['', cells[0]] : cells;
    const cleanName = sanitize(name);
    if (!cleanName) continue;

    rows.push({ title: sanitize(title), name: cleanName });
  }

  return rows;
}

function parseArgs(args) {
  const options = { base: DEFAULT_BASE, in: DEFAULT_IN, out: DEFAULT_OUT };
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i].replace(/^--/, '');
    if (key in options && args[i].startsWith('--')) {
      options[key] = args[i + 1];
      i += 1;
    }
  }
  return options;
}

function csvCell(value) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function main() {
  const options = parseArgs(argv.slice(2));

  if (!existsSync(options.in)) {
    console.error(`✗ Không tìm thấy file "${options.in}".`);
    console.error('  Tạo file đó theo mẫu guests.example.csv rồi chạy lại.');
    process.exitCode = 1;
    return;
  }

  const guests = parseGuestCsv(readFileSync(options.in, 'utf8'));
  if (guests.length === 0) {
    console.error(`✗ "${options.in}" không có dòng khách nào hợp lệ.`);
    process.exitCode = 1;
    return;
  }

  const rows = guests.map(({ title, name }) => ({
    label: title ? `${title} ${name}` : name,
    link: buildLink(options.base, name, title),
  }));

  const width = Math.max(...rows.map(row => row.label.length));
  console.log(`\nTên miền: ${options.base}\n`);
  for (const row of rows) {
    console.log(`${row.label.padEnd(width)}  ${row.link}`);
  }

  const csv = ['ho_ten,link', ...rows.map(r => `${csvCell(r.label)},${csvCell(r.link)}`)].join('\n');
  writeFileSync(options.out, `${csv}\n`, 'utf8');
  console.log(`\n✓ ${rows.length} khách — đã ghi ra "${options.out}"\n`);
}

// Chỉ chạy khi gọi trực tiếp, để test có thể import các hàm ở trên.
if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
  main();
}
