// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

/* =========================================================
 * ✅ [추가] KST 타임스탬프 & 콘솔 래퍼
 * - 모든 console.log/warn/error에 KST 기준 "YYYY/MM/DD HH:mm" 자동 부착
 * - 요청하신 '대기열 타임스탬프' 개념을 전역 로그에도 일관 적용
 * =======================================================*/
function tsKST() {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(now); // 예: "2025. 10. 26. 17:22"

    // "YYYY. MM. DD. HH:mm" → "YYYY/MM/DD HH:mm"
    return fmt.replace(/\./g, '/').replace(/\s+/g, ' ').trim().replace(/^(\d{4})\/(\d{2})\/(\d{2})/, '$1/$2/$3');
    }

    // 원본 바인딩 저장
    const _log  = console.log.bind(console);
    const _warn = console.warn.bind(console);
    const _err  = console.error.bind(console);

    // 래핑: 모든 로그 앞에 [YYYY/MM/DD HH:mm]
    console.log  = (...args) => _log(`[${tsKST()}]`, ...args);
    console.warn = (...args) => _warn(`[${tsKST()}]`, ...args);
    console.error= (...args) => _err(`[${tsKST()}]`, ...args);

    /* =========================================================
    * ✅ uploads 폴더 자동 생성
    * =======================================================*/
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    }

    /* =========================================================
    * ✅ 미들웨어 설정
    * =======================================================*/
    app.use(cors());
    app.use(express.json({ limit: '20mb' }));
    app.use(requestQueue); // ※ 아래에 선언된 함수(함수 선언은 hoist됨)

    /* =========================================================
    * ✅ 정적 파일 경로 설정 (uploads 폴더 접근 허용)
    * =======================================================*/
    app.use('/uploads', express.static(uploadsDir));

    /* =========================================================
    * ✅ MySQL 연결
    * =======================================================*/
    const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });

    db.getConnection((err, conn) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL 연결 성공!');
    conn.release();
    });

    /* =========================================================
    * ✅ API 이용 대기열
    * - 요구사항 반영:
    *   1) "즉시 처리"는 로그 미출력(소음 제거)
    *   2) "대기열 발생"한 요청만 큐 로그 출력
    *   3) 모든 대기열 로그에 user_id 또는 IP 포함
    *   4) /uploads 정적요청은 큐 동작은 유지하되 로그만 숨김
    *   5) 모든 로그는 상단 래퍼로 KST 타임스탬프 일괄 출력
    * =======================================================*/
    const MAX_CONCURRENT = 10; // 동시 처리 최대치
    let activeCount = 0;       // 현재 처리 중인 개수
    const waitQueue = [];      // 대기열 큐

    function runNext() {
    if (activeCount >= MAX_CONCURRENT) return;
    const next = waitQueue.shift();
    if (!next) return;
    activeCount++;
    next();
    }

    function requestQueue(req, res, next) {
    const userId = req.body?.user_id || req.query?.user_id || 'unknown';
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
    const reqPath = req.path;

    // /uploads 정적 요청은 로그만 숨김(큐 동작은 유지)
    const isUploads = reqPath.startsWith('/uploads');

    // 이 요청이 "실제 대기열"을 거쳤는지 여부(로그 필터링용)
    let fromQueue = false;

    // 대기열에서 빠져 실제 처리가 시작되는 시점
    const startHandling = () => {
        // "대기열을 실제로 경험한" 요청만 큐 관련 로그 출력
        if (!isUploads && fromQueue) {
        console.log(`QUEUE-EXIT | user_id=${userId} | ip=${ip} | path=${reqPath} | active=${activeCount}/${MAX_CONCURRENT}`);
        }

        const startedAt = Date.now();

        res.on('finish', () => {
        activeCount--;
        const dur = Date.now() - startedAt;

        // 완료 로그도 "대기열을 거친 요청만" 출력
        if (!isUploads && fromQueue) {
            console.log(`REQ-DONE   | user_id=${userId} | ip=${ip} | path=${reqPath} | status=${res.statusCode} | duration=${dur}ms | active=${activeCount}/${MAX_CONCURRENT}`);
        }
        runNext();
        });

        res.on('close', () => {
        if (res.writableEnded) return; // finish에서 처리됨
        activeCount = Math.max(0, activeCount - 1);

        if (!isUploads && fromQueue) {
            console.warn(`REQ-ABORT  | user_id=${userId} | ip=${ip} | path=${reqPath} | active=${activeCount}/${MAX_CONCURRENT}`);
        }
        runNext();
        });

        next();
    };

    // 즉시 처리 가능: 불필요 로그 제거(요청사항 1번)
    if (activeCount < MAX_CONCURRENT) {
        activeCount++;
        return startHandling();
    }

    // 대기열 입장: 실제로 큐에 들어갈 때만 로그 출력
    waitQueue.push(() => {
        fromQueue = true;
        startHandling();
    });

    if (!isUploads) {
        console.log(`QUEUE-ENTER| user_id=${userId} | ip=${ip} | path=${reqPath} | queue_len=${waitQueue.length}`);
    }
    }

    /* =========================================================
    * ✅ 일반 상품 추가 (image_url 직접 받는 경우)
    * =======================================================*/
    app.post('/api/add-product', (req, res) => {
    const { name, price, image_url } = req.body;

    console.log('📦 요청 받은 상품 데이터:', { name, price, image_url });

    if (!name || !price || !image_url) {
        return res.status(400).json({ message: '입력값 누락' });
    }

    const sql = `
            INSERT INTO products (name, price, image_url, stock, created_at)
            VALUES (?, ?, ?, 0, NOW())
        `;

    db.query(sql, [name, price, image_url], (err, result) => {
        if (err) {
        console.error('DB 저장 오류:', err);
        return res.status(500).json({ message: 'DB 오류' });
        }

        res.status(200).json({ message: '등록 성공', productId: result.insertId });
    });
    });

    /* =========================================================
    * ✅ base64 이미지 처리 + DB 저장
    * =======================================================*/
    app.post('/api/add-product-base64', (req, res) => {
    const { name, price, base64 } = req.body;

    console.log('📥 받은 데이터:', {
        name,
        price,
        base64_preview: base64?.substring(0, 30) + '...'
    });

    if (!name || !price || !base64) {
        console.log('🚨 필수 값 누락');
        return res.status(400).json({ message: '필수 값 누락' });
    }

    const filename = Date.now() + '.jpg';
    const filepath = path.join(uploadsDir, filename);
    const imageUrl = `/uploads/${filename}`;

    const imageBuffer = Buffer.from(base64, 'base64');

    fs.writeFile(filepath, imageBuffer, err => {
        if (err) {
        console.error('❌ 이미지 저장 실패:', err);
        return res.status(500).json({ message: '이미지 저장 실패' });
        }

        const sql = `
                INSERT INTO products (name, price, image_url, stock, created_at)
                VALUES (?, ?, ?, 0, NOW())
            `;

        db.query(sql, [name, price, imageUrl], (err, result) => {
        if (err) {
            console.error('❌ DB 저장 오류:', err);
            return res.status(500).json({ message: 'DB 오류' });
        }

        console.log('✅ 등록 성공:', result.insertId);
        res.status(200).json({ message: '등록 성공', productId: result.insertId });
        });
    });
    });

    /* =========================================================
    * ✅ 상품 목록 조회 API
    * =======================================================*/
    app.get('/api/products', (req, res) => {
    const sql = 'SELECT id, name, price, image_url FROM products ORDER BY id DESC';

    db.query(sql, (err, results) => {
        if (err) {
        console.error('❌ 상품 목록 조회 오류:', err);
        return res.status(500).json({ message: 'DB 오류' });
        }

        res.status(200).json(results);
    });
    });

    /* =========================================================
    * ✅ 주문 생성 API
    * =======================================================*/
    app.post('/api/orders', (req, res) => {
    const {
        order_number,
        user_id,
        recipient,
        recipient_address,
        recipient_phone,
        request_note,
        total_price,
        status,
        created_at,
        updated_at,
        items // 배열: [{ product_id, quantity, price_each }]
    } = req.body;

    // ✅ 주문 요청 로그(전역 KST 프리픽스 적용됨)
    console.log('🧾 주문 요청 도착!', {
        order_number,
        user_id,
        recipient,
        recipient_address,
        recipient_phone,
        total_price,
        request_note,
        status,
        items_len: Array.isArray(items) ? items.length : 0
    });

    // 기본 체크
    if (!user_id || !recipient || !recipient_address || !recipient_phone || !Array.isArray(items)) {
        return res.status(400).json({ message: '필수 값 누락' });
    }

    // ✅ 빈 주문 방지
    if (items.length === 0) {
        return res.status(400).json({ message: '주문 항목이 없습니다.' });
    }

    // 1) orders
    const orderSql = `
            INSERT INTO orders
            (user_id, recipient, recipient_address, recipient_phone, request_note,
                total_price, status, order_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const orderValues = [
        user_id,
        recipient,
        recipient_address,
        recipient_phone,
        request_note || '',
        total_price,
        status || 'pending',
        order_number,
    ];

    db.query(orderSql, orderValues, (err, result) => {
        if (err) {
        console.error('❌ 주문 저장 오류:', err);
        return res.status(500).json({ message: '주문 저장 실패' });
        }

        const order_id = result.insertId;

        // 2) order_items
        const itemSql = `
                INSERT INTO order_items (order_id, product_id, quantity, price_each)
                VALUES ?
            `;
        const itemValues = items.map(item => [
        order_id,
        item.product_id,
        item.quantity,
        item.price_each
        ]);

        db.query(itemSql, [itemValues], (err2) => {
        if (err2) {
            console.error('❌ 주문 항목 저장 실패:', err2);
            return res.status(500).json({ message: '주문 항목 저장 실패' });
        }

        res.status(200).json({ message: '주문 저장 성공', order_id });
        });
    });
    });

    /* =========================================================
    * ✅ 어드민 상품 수정 API
    * =======================================================*/
    app.post('/api/update-product', (req, res) => {
    const { product_id, name, price } = req.body;

    if (!product_id || !name || !price) {
        return res.status(400).json({ message: '필수 값 누락' });
    }

    const selectSql = `SELECT name, price FROM products WHERE id = ?`;
    db.query(selectSql, [product_id], (selectErr, selectResult) => {
        if (selectErr || selectResult.length === 0) {
        console.error('❌ 기존 상품 조회 실패:', selectErr || '데이터 없음');
        return res.status(500).json({ message: '기존 상품 조회 실패' });
        }

        const prev = selectResult[0];

        const updateSql = `
                UPDATE products
                SET name = ?, price = ?
                WHERE id = ?
            `;

        db.query(updateSql, [name, price, product_id], (err, result) => {
        if (err) {
            console.error('❌ 상품 수정 오류:', err);
            return res.status(500).json({ message: '상품 수정 실패' });
        }

        console.log('✅ 상품 수정 완료', {
            product_id,
            before: { name: prev.name, price: prev.price },
            after: { name, price }
        });

        res.status(200).json({ message: '상품 수정 성공' });
        });
    });
    });

    /* =========================================================
    * ✅ 어드민 상품 삭제 API
    * =======================================================*/
    app.delete('/api/delete-product/:product_id', (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        return res.status(400).json({ message: '상품 ID 누락' });
    }

    const selectSql = `SELECT name, price FROM products WHERE id = ?`;
    db.query(selectSql, [product_id], (selectErr, selectResult) => {
        if (selectErr || selectResult.length === 0) {
        console.error('❌ 상품 정보 조회 실패:', selectErr || '데이터 없음');
        return res.status(500).json({ message: '상품 정보 조회 실패' });
        }

        const product = selectResult[0];

        const deleteSql = `DELETE FROM products WHERE id = ?`;
        db.query(deleteSql, [product_id], (err, result) => {
        if (err) {
            console.error('❌ 상품 삭제 오류:', err);
            return res.status(500).json({ message: '상품 삭제 실패' });
        }

        console.log('🗑️ 상품 삭제 완료', { product_id, name: product.name, price: product.price });
        res.status(200).json({ message: '상품 삭제 성공' });
        });
    });
    });

    /* =========================================================
    * ✅ CRON: 자동 상태/개인정보 처리
    * =======================================================*/
    const cron = require('node-cron');

    cron.schedule('0 0 * * *', () => {
    const cancelSql = `
            UPDATE orders
            SET status = '취소'
            WHERE status = '입금대기'
                AND created_at < (NOW() - INTERVAL 2 DAY)
        `;

    db.query(cancelSql, (err, result) => {
        if (err) {
        console.error('❌ 입금대기 자동 취소 실패:', err);
        } else {
        console.log(`🔁 입금대기 → 취소 자동 처리 완료: ${result.affectedRows}건`);
        }
    });
    });

    cron.schedule('10 0 * * *', () => {
    const deletePrivateSql = `
            UPDATE orders
            SET recipient = NULL,
                recipient_address = NULL,
                recipient_phone = NULL
            WHERE created_at < (NOW() - INTERVAL 1 YEAR)
                AND (recipient IS NOT NULL OR recipient_address IS NOT NULL OR recipient_phone IS NOT NULL)
        `;

    db.query(deletePrivateSql, (err, result) => {
        if (err) {
        console.error('❌ 개인정보 자동 삭제 실패:', err);
        } else {
        console.log(`🧹 개인정보 자동 삭제 완료: ${result.affectedRows}건`);
        }
    });
    });

    /* =========================================================
    * ✅ CoolSMS API (solapi)
    * =======================================================*/
    const axios = require('axios');
    const crypto = require('crypto');

    app.post('/api/send-auth-code', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ message: '전화번호 누락' });
    }

    const authCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 3 * 60 * 1000); // 3분

    const apiKey = process.env.COOLSMS_API_KEY;
    const apiSecret = process.env.COOLSMS_API_SECRET;
    const sender = process.env.COOLSMS_SENDER;

    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hmacData = date + salt;
    const signature = crypto.createHmac('sha256', apiSecret).update(hmacData).digest('hex');

    try {
        const response = await axios.post('https://api.coolsms.co.kr/messages/v4/send', {
        message: {
            to: phone,
            from: sender,
            text: `[MOMO] 인증번호는 ${authCode}입니다.`,
        }
        }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        }
        });

        // DB 저장
        const deleteSql = `DELETE FROM auth_codes WHERE phone = ?`;
        db.query(deleteSql, [phone], (delErr) => {
        if (delErr) {
            console.error('인증번호 삭제 실패:', delErr);
            return res.status(500).json({ message: 'DB 오류' });
        }

        const insertSql = `
                    INSERT INTO auth_codes (phone, code, expires_at)
                    VALUES (?, ?, ?)
                `;
        db.query(insertSql, [phone, authCode, expires], (err) => {
            if (err) {
            console.error('인증번호 DB 저장 실패:', err);
            return res.status(500).json({ message: 'DB 저장 오류' });
            }

            console.log(`✅ 인증번호 전송 완료: ${phone} / ${authCode}`);
            res.status(200).json({ success: true });
        });
        });

    } catch (error) {
        console.error('❌ 문자 전송 실패:', error.response?.data || error.message);
        res.status(500).json({ message: '문자 전송 실패', error: error.response?.data || error.message });
    }
    });

    /* =========================================================
    * ✅ 인증번호 확인
    * =======================================================*/
    app.post('/api/verify-auth-code', (req, res) => {
    const { phone, code } = req.body;

    if (!phone || !code) {
        return res.status(400).json({ message: '전화번호 또는 인증번호 누락' });
    }

    const sql = `
            SELECT code, expires_at
            FROM auth_codes
            WHERE phone = ?
            ORDER BY expires_at DESC
            LIMIT 1
        `;

    db.query(sql, [phone], (err, results) => {
        if (err) {
        console.error('❌ 인증번호 조회 오류:', err);
        return res.status(500).json({ message: 'DB 오류' });
        }

        if (results.length === 0) {
        return res.status(400).json({ message: '인증번호 없음' });
        }

        const { code: savedCode, expires_at } = results[0];

        const now = new Date();
        if (now > expires_at) {
        return res.status(400).json({ message: '인증번호 만료' });
        }

        if (code !== savedCode) {
        return res.status(400).json({ message: '인증번호 불일치' });
        }

        console.log(`✅ 인증번호 확인 완료: ${phone}`);
        return res.status(200).json({ success: true });
    });
    });

    /* =========================================================
    * ✅ 회원가입 (bcrypt)
    * =======================================================*/
    const bcrypt = require('bcrypt');

    app.post('/api/register', async (req, res) => {
    const { name, phone, pw } = req.body;

    if (!name || !phone || !pw) {
        return res.status(400).json({ message: '입력값 누락' });
    }

    try {
        const hashedPw = await bcrypt.hash(pw, 10);

        const sql = `
                INSERT INTO users (name, phone, password, created_at)
                VALUES (?, ?, ?, NOW())
            `;
        db.query(sql, [name, phone, hashedPw], (err, result) => {
        if (err) {
            console.error('회원가입 오류:', err);
            return res.status(500).json({ message: 'DB 저장 오류' });
        }

        console.log(`✅ 회원가입 완료: ${name} / ${phone}`);
        res.status(200).json({ success: true });
        });
    } catch (error) {
        console.error('회원가입 실패:', error);
        res.status(500).json({ message: '서버 오류' });
    }
    });

    /* =========================================================
    * ✅ 로그인
    * =======================================================*/
    app.post('/api/login', (req, res) => {
    const { phone, pw } = req.body;

    if (!phone || !pw) {
        return res.status(400).json({ message: '전화번호 또는 비밀번호 누락' });
    }

    const sql = 'SELECT * FROM users WHERE phone = ? LIMIT 1';

    db.query(sql, [phone], async (err, results) => {
        if (err) {
        console.error('❌ 로그인 DB 조회 실패:', err);
        return res.status(500).json({ message: '서버 오류' });
        }

        if (results.length === 0) {
        console.warn(`❌ 로그인 실패: 존재하지 않는 사용자 / ${phone}`);
        return res.status(400).json({ message: '존재하지 않는 사용자입니다.' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(pw, user.password);

        if (!isMatch) {
        console.warn(`❌ 로그인 실패: 비밀번호 불일치 / ${phone}`);
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        console.log(`✅ 로그인 성공: ${user.name} / ${user.phone}`);
        res.status(200).json({ success: true, user_id: user.id, is_admin: user.is_admin });
    });
    });

    /* =========================================================
    * ✅ 비밀번호 변경
    * =======================================================*/
    app.post('/api/reset-password', async (req, res) => {
    const { code, newPw } = req.body;

    if (!code || !newPw) {
        return res.status(400).json({ message: '인증번호 또는 새 비밀번호 누락' });
    }

    const sql = `
            SELECT phone, expires_at
            FROM auth_codes
            WHERE code = ?
            ORDER BY expires_at DESC
            LIMIT 1
        `;

    db.query(sql, [code], async (err, results) => {
        if (err) {
        console.error('❌ 인증번호 조회 오류:', err);
        return res.status(500).json({ message: 'DB 오류' });
        }

        if (results.length === 0) {
        return res.status(400).json({ message: '유효하지 않은 인증번호입니다.' });
        }

        const { phone, expires_at } = results[0];

        if (new Date() > expires_at) {
        return res.status(400).json({ message: '인증번호가 만료되었습니다.' });
        }

        try {
        const hashedPw = await bcrypt.hash(newPw, 10);

        const updateSql = `UPDATE users SET password = ? WHERE phone = ?`;
        db.query(updateSql, [hashedPw, phone], (updateErr) => {
            if (updateErr) {
            console.error('❌ 비밀번호 업데이트 오류:', updateErr);
            return res.status(500).json({ message: '비밀번호 변경 실패' });
            }

            console.log(`✅ 비밀번호 변경 완료: ${phone}`);
            return res.status(200).json({ success: true });
        });
        } catch (e) {
        console.error('❌ 해시 오류:', e);
        return res.status(500).json({ message: '서버 오류' });
        }
    });
    });

    /* =========================================================
    * ✅ 입금확인 문자 전송 (요청자 이름, 번호 뒷자리 포함 + DB 저장)
    * =======================================================*/
    app.post('/api/send-payment-alert', async (req, res) => {
    const { orderNumber, name, totalPrice, quantity, user_id, orderId } = req.body;

    const apiKey = process.env.COOLSMS_API_KEY;
    const apiSecret = process.env.COOLSMS_API_SECRET;
    const sender = process.env.COOLSMS_SENDER || '01032700115';
    const receiver = '01032700115';

    const date = new Date().toISOString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hmacData = date + salt;
    const signature = crypto.createHmac('sha256', apiSecret).update(hmacData).digest('hex');

    // 사용자 정보 조회
    const userSql = 'SELECT name, phone FROM users WHERE id = ? LIMIT 1';
    db.query(userSql, [user_id], async (err, result) => {
        if (err || result.length === 0) {
        console.error('❌ 사용자 정보 조회 실패:', err);
        return res.status(500).json({ message: '사용자 조회 실패' });
        }

        const userName = result[0].name;
        const phoneSuffix = result[0].phone.slice(-4);

        const messageText = `[MOMO] 주문 확인 요청
    주문번호: ${orderNumber}
    상품명: ${name}
    수량: ${quantity}개
    총금액: ${Number(totalPrice).toLocaleString()}원
    요청자: ${userName} (${phoneSuffix})
    입금 확인 바랍니다.`;

        try {
        const response = await axios.post('https://api.coolsms.co.kr/messages/v4/send', {
            message: { to: receiver, from: sender, text: messageText }
        }, {
            headers: {
            'Content-Type': 'application/json',
            Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
            }
        });

        const insertSql = `
                    INSERT INTO messages (order_id, to_phone, content, status)
                    VALUES (?, ?, ?, 'success')
                `;
        db.query(insertSql, [orderId, receiver, messageText], (msgErr) => {
            if (msgErr) console.error('📩 문자 이력 저장 실패:', msgErr);
        });

        res.status(200).json({ success: true, response: response.data });
        } catch (error) {
        console.error('❌ 문자 전송 실패:', error.response?.data || error.message);

        const insertSql = `
                    INSERT INTO messages (order_id, to_phone, content, status)
                    VALUES (?, ?, ?, 'fail')
                `;
        db.query(insertSql, [orderId, receiver, messageText], (msgErr) => {
            if (msgErr) console.error('📩 문자 실패 이력 저장 실패:', msgErr);
        });

        res.status(500).json({ success: false, message: '문자 전송 실패', error: error.response?.data || error.message });
        }
    });
    });

    /* =========================================================
    * ✅ 사용자별 주문조회
    * =======================================================*/
    app.get('/api/user-orders/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `
            SELECT 
                o.id AS order_id,
                oi.id AS order_item_id,
                o.order_number,
                o.created_at,
                o.status,
                o.total_price,
                p.name AS product_name,
                p.image_url,
                oi.quantity,
                oi.price_each,
                oi.product_id
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON p.id = oi.product_id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
        console.error('❌ 사용자 주문 조회 오류:', err);
        return res.status(500).json({ message: '주문 조회 실패' });
        }

        res.status(200).json(results);
    });
    });

    /* =========================================================
    * ✅ 전체 주문 목록(상태별) - 어드민
    * =======================================================*/
    app.get('/api/order-status', async (req, res) => {
    const { status } = req.query;

    try {
        const [rows] = await db.promise().query(`
                SELECT 
                    DATE_FORMAT(o.created_at, '%Y%m%d') AS date,
                    o.order_number,
                    u.name AS user_name,
                    oi.product_id,
                    p.name AS product_name,
                    oi.quantity,
                    oi.price_each,
                    o.status,
                    o.total_price
                FROM orders o
                JOIN users u ON o.user_id = u.id
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE o.status = ?
                ORDER BY o.created_at DESC, o.order_number
            `, [status]);

        const grouped = {};
        for (const row of rows) {
        if (!grouped[row.date]) {
            grouped[row.date] = {};
        }
        if (!grouped[row.date][row.order_number]) {
            grouped[row.date][row.order_number] = {
            user_name: row.user_name,
            status: row.status,
            total_price: row.total_price,
            items: [],
            };
        }

        grouped[row.date][row.order_number].items.push({
            product_id: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity,
            price_each: row.price_each,
        });
        }

        res.json(grouped);
    } catch (err) {
        console.error('❌ 주문 상태 조회 실패:', err);
        res.status(500).json({ message: '서버 오류' });
    }
    });

    /* =========================================================
    * ✅ 주문 상태 변경 + 문자
    * =======================================================*/
    app.post('/api/update-order-status', (req, res) => {
    const { order_number, new_status } = req.body;

    if (!order_number || !new_status) {
        return res.status(400).json({ message: '주문번호 또는 상태 누락' });
    }

    const updateSql = `UPDATE orders SET status = ? WHERE order_number = ?`;

    db.query(updateSql, [new_status, order_number], (err, result) => {
        if (err) {
        console.error('❌ 상태 변경 실패:', err);
        return res.status(500).json({ message: '상태 변경 실패' });
        }

        const infoSql = `
                SELECT 
                    o.id AS order_id,
                    o.recipient,
                    o.recipient_address,
                    o.recipient_phone,
                    o.request_note,
                    o.total_price,
                    u.name AS user_name,
                    GROUP_CONCAT(p.name SEPARATOR ', ') AS product_names,
                    GROUP_CONCAT(oi.quantity SEPARATOR ', ') AS quantities,
                    SUM(oi.price_each * oi.quantity) AS product_total
                FROM orders o
                JOIN users u ON o.user_id = u.id
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON p.id = oi.product_id
                WHERE o.order_number = ?
                GROUP BY o.id
            `;

        db.query(infoSql, [order_number], async (infoErr, rows) => {
        if (infoErr || rows.length === 0) {
            console.error('❌ 주문 정보 조회 실패:', infoErr || '데이터 없음');
            return res.status(500).json({ message: '정보 조회 실패' });
        }

        const data = rows[0];

        if (new_status === '배송중') {
            const apiKey = process.env.COOLSMS_API_KEY;
            const apiSecret = process.env.COOLSMS_API_SECRET;
            const sender = process.env.COOLSMS_SENDER || '01032700115';
            const receiver = '01032700115';

            const date = new Date().toISOString();
            const salt = crypto.randomBytes(16).toString('hex');
            const hmacData = date + salt;
            const signature = crypto.createHmac('sha256', apiSecret).update(hmacData).digest('hex');

            const delivery_fee = data.total_price - data.product_total;

            const messageText = `[MOMO] 배송 준비 완료
    주문번호: ${order_number}
    상품: ${data.product_names}
    수량: ${data.quantities}
    받는사람: ${data.recipient}
    주소: ${data.recipient_address}
    전화번호: ${data.recipient_phone}
    상품금액: ${Number(data.product_total).toLocaleString()}원
    배송비: ${Number(delivery_fee).toLocaleString()}원
    총금액: ${Number(data.total_price).toLocaleString()}원
    요청사항: ${data.request_note || '없음'}`;

            try {
            await axios.post('https://api.coolsms.co.kr/messages/v4/send', {
                message: { to: receiver, from: sender, text: messageText }
            }, {
                headers: {
                'Content-Type': 'application/json',
                Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
                }
            });

            const insertSql = `
                            INSERT INTO messages (order_id, to_phone, content, status)
                            VALUES (?, ?, ?, 'success')
                        `;
            db.query(insertSql, [data.order_id, receiver, messageText], (msgErr) => {
                if (msgErr) console.error('📩 문자 이력 저장 실패:', msgErr);
            });

            } catch (error) {
            console.error('❌ 문자 전송 실패:', error.response?.data || error.message);

            const insertSql = `
                            INSERT INTO messages (order_id, to_phone, content, status)
                            VALUES (?, ?, ?, 'fail')
                        `;
            db.query(insertSql, [data.order_id, receiver, messageText], (msgErr) => {
                if (msgErr) console.error('📩 문자 실패 이력 저장 실패:', msgErr);
            });
            }
        }

        console.log(`✅ 상태 변경 완료: 주문번호 ${order_number} → ${new_status}`);
        res.status(200).json({ success: true });
        });
    });
    });

    /* =========================================================
    * ✅ 피드백 수신 (👍=b / 👎=q)
    * - 기존 "[${ts()}]" 접두는 제거: 전역 KST 래퍼가 이미 시간 부여
    * =======================================================*/
    app.post('/api/feedback', (req, res) => {
    try {
        const { user_id, order_id, type, rating, comment } = req.body;

        const validType = type === '구매과정' || type === '배송완료';
        const validRating = rating === 'b' || rating === 'q';
        if (!user_id || !order_id || !validType || !validRating) {
        return res.status(400).json({ message: 'invalid payload' });
        }

        const shortComment = (comment || '').toString().slice(0, 100);
        console.log(
        `피드백 작성 | user_id=${user_id} | order_id=${order_id} | type=${type} | rating=${rating} | comment="${shortComment}${(comment||'').length>100 ? '…' : ''}"`
        );

        const sql = `
            INSERT INTO feedback (user_id, order_id, type, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        const params = [user_id, order_id, type, rating, comment || null];

        db.query(sql, params, (err, result) => {
        if (err) {
            console.error('❌ 피드백 저장 실패:', err);
            return res.status(500).json({ message: 'db error' });
        }
        return res.status(200).json({ success: true, feedback_id: result.insertId });
        });
    } catch (e) {
        console.error('❌ 피드백 처리 오류:', e);
        return res.status(500).json({ message: 'server error' });
    }
    });

    /* =========================================================
    * ✅ 서버 시작 + 타임아웃
    * =======================================================*/
    const server = app.listen(port, '0.0.0.0', () => {
    console.log(`서버 실행 중 → http://localhost:${port}`);
    });

server.setTimeout(10000); // 10초
