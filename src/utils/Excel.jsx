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
    <button onClick={generateExcelFile}>
      <div className="flex flex-row gap-2  hover:bg-[#8f5e7e] rounded-md py-1 px-2">
        <p className="">Export</p>
        <i className="bi bi-download text-lg"></i>
      </div>
    </button>
  );
}

export default Excel;
