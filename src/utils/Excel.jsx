import * as XLSX from "xlsx";

function Excel({ dataRow, dataHeader, nameExcel }) {
  // Dữ liệu tiêu đề và dữ liệu
  const generateExcelFile = async () => {
    // Tạo một workbook mới
    const workbook = XLSX.utils.book_new();

    // Tạo một worksheet trống
    const worksheet = XLSX.utils.aoa_to_sheet([]);

    // Thêm tiêu đề cột vào ô A1
    XLSX.utils.sheet_add_aoa(worksheet, [dataHeader], { origin: "A1" });

    // Thêm dữ liệu bắt đầu từ ô A2
    // Chỉ sử dụng dữ liệu và không lặp lại tiêu đề
    XLSX.utils.sheet_add_json(worksheet, dataRow, {
      skipHeader: true,
      origin: "A2",
    });

    // Tính toán độ rộng cột
    const max_widths = dataHeader.map((header) =>
      Math.max(
        header.length,
        ...dataRow.map((row) => row[header]?.toString().length || 0)
      )
    );
    worksheet["!cols"] = max_widths.map((w) => ({ wch: w + 2 })); // Thêm một khoảng cách cho đẹp hơn

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    // Xuất file Excel
    XLSX.writeFile(workbook, `${nameExcel}.xlsx`, { compression: true });
  };

  // Sử dụng hàm trong sự kiện click của button
  return (
    <button
      onClick={generateExcelFile}
      className="bg-green-500 text-white border border-green-500 hover:bg-gray-100 hover:text-black px-4 py-2 rounded"
    >
      <b className="flex flex-row gap-2">
        <p className="">Excel</p>

        <i className="bi bi-download text-lg"></i>
      </b>
    </button>
  );
}

export default Excel;
