# Checkin Report Project

Dự án quản lý chấm công sử dụng Node.js, Express và Sequelize ORM.

## Cấu trúc project

```
checkin-report/
├── src/
│   ├── config/
│   │   ├── db.js          # Cấu hình kết nối SQL Server (legacy)
│   │   └── sequelize.js   # Cấu hình Sequelize ORM
│   ├── controllers/
│   │   └── TimeKeepingController.js
│   ├── models/
│   │   └── TimeKeeping.js # Model Sequelize cho bảng ChamCong
│   ├── routes/
│   │   ├── index.js
│   │   ├── site.js
│   │   └── timekeeping.js
│   ├── public/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env                    # Cấu hình môi trường
├── .gitignore
├── package.json
└── test-model.js          # File test model

```

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` với nội dung:

```env
DB_USER=sa
DB_PASSWORD=your_password
DB_NAME=ICLC_DB
DB_HOST=localhost
DB_PORT=14333
```

## TimeKeeping Model (Sequelize ORM)

Model `TimeKeeping` map với bảng `ChamCong` trong database với các field:

- `ID` (INTEGER, Primary Key, Auto Increment)
- `ThoiGian` (DATE) - Thời gian chấm công
- `MapPlaceID` (INTEGER) - ID địa điểm
- `NguoiChamCong` (INTEGER) - ID người chấm công
- `Loai` (INTEGER) - Loại chấm công (vào/ra)
- `HinhThuc` (INTEGER) - Hình thức chấm công
- `DiaChi` (TEXT) - Địa chỉ chấm công
- `File` (STRING) - File đính kèm
- `GhiChu` (STRING) - Ghi chú

### Sử dụng Model

```javascript
const TimeKeeping = require('./src/models/TimeKeeping');
const sequelize = require('./src/config/sequelize');

// Lấy tất cả bản ghi
const records = await TimeKeeping.findAll();

// Lấy bản ghi theo ID
const record = await TimeKeeping.findByPk(1);

// Lấy với điều kiện
const records = await TimeKeeping.findAll({
  where: {
    NguoiChamCong: 316
  },
  order: [['ThoiGian', 'DESC']],
  limit: 10
});

// Tạo bản ghi mới
const newRecord = await TimeKeeping.create({
  ThoiGian: new Date(),
  NguoiChamCong: 316,
  Loai: 1,
  DiaChi: 'Hà Nội'
});

// Cập nhật bản ghi
await TimeKeeping.update(
  { GhiChu: 'Updated note' },
  { where: { ID: 1 } }
);

// Xóa bản ghi
await TimeKeeping.destroy({
  where: { ID: 1 }
});

// Tìm kiếm theo khoảng thời gian
const records = await TimeKeeping.findAll({
  where: {
    ThoiGian: {
      [Op.between]: [startDate, endDate]
    }
  }
});
```

## Test Model

Chạy file test để kiểm tra model:

```bash
node test-model.js
```

## Khởi chạy server

```bash
npm start
# hoặc
node src/server.js
```

## Git

Repository đã được khởi tạo với Git. Các file quan trọng đã được commit.

```bash
# Xem trạng thái
git status

# Thêm thay đổi
git add .

# Commit
git commit -m "Your message"
