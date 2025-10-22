exports.parseDateForFilter = (dateString, isEndDate = false) => {
  if (!dateString) return null

  const parts = dateString.split('-').map(Number)
  if (parts.length < 3) return null
  const [year, month, day] = parts

  // Construct date in local time to avoid UTC offset issues with MSSQL
  if (isEndDate) {
    return new Date(year, month - 1, day, 23, 59, 59, 999)
  } else {
    return new Date(year, month - 1, day, 0, 0, 0, 0)
  }
}

// Helper function to format Date objects into MSSQL compatible string (local time)
exports.formatDateToMSSQLString = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};
