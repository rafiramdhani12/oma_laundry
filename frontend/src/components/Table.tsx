import { type ReactNode } from "react";

// FAKTA 1: Membuat Tipe Data (Interface) untuk Konfigurasi Kolom.
// Daripada memakai 'any', kita beri tahu TypeScript bentuk konfigurasi kolomnya.
export type ColumnType = {
  header: string; // Teks yang akan tampil di <th> (Kepala Tabel)
  accessor?: string; // Nama 'key' pada data object (misal: "customerName")
  render?: (row: any) => ReactNode; // Fungsi khusus jika isinya bukan sekadar teks (misal: Tombol Action)
};

type TableProps = {
  title?: string; // Judul tabel dibuat dinamis, default-nya bebas
  columns: ColumnType[]; // Menerima array blueprint kolom
  data: any[]; // Menerima array data
};

const Table = ({ title = "Data Table", columns, data }: TableProps) => {
  return (
    <div className="mt-5">
      <h1 className="text-xl font-bold mb-4 ml-5">{title}</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="table w-full">
          <thead>
            <tr>
              {/* FAKTA 2: Render Header Dinamis. 
                  Looping (map) berdasarkan konfigurasi kolom, bukan memanggil name1, name2 satu per satu. */}
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* FAKTA 3: Render Sel (<td>) Dinamis menggunakan Bracket Notation.
                    Kita melakukan looping lagi untuk setiap kolom di dalam baris data. 
                    - row["customerName"] di JavaScript sama dengan row.customerName. 
                    - Jika ada properti 'render', jalankan fungsi rendernya (berguna untuk tombol).
                */}
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render
                      ? col.render(row)
                      : col.accessor
                      ? row[col.accessor]
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;