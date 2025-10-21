const TimeKeeping = require('./src/models/TimeKeeping');
const sequelize = require('./src/config/sequelize');

async function testModel() {
  try {
    // Test kết nối database
    await sequelize.authenticate();
    console.log('✓ Kết nối database thành công!');

    // Test đọc dữ liệu từ bảng ChamCong
    const records = await TimeKeeping.findAll({
      limit: 5,
      order: [['ThoiGian', 'DESC']],
    });

    console.log(`✓ Tìm thấy ${records.length} bản ghi gần nhất:`);
    records.forEach((record, index) => {
      console.log(`\n  ${index + 1}. ID: ${record.ID}`);
      console.log(`     Thời gian: ${record.ThoiGian}`);
      console.log(`     Người chấm công: ${record.NguoiChamCong}`);
      console.log(`     Loại: ${record.Loai}`);
    });

    // Đóng kết nối
    await sequelize.close();
    console.log('\n✓ Test hoàn thành thành công!');
  } catch (error) {
    console.error('✗ Lỗi:', error.message);
    process.exit(1);
  }
}

testModel();
