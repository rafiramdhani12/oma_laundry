import Card from '../components/Card';
import Layout from '../components/Layout'
import Table, { type ColumnType } from '../components/Table';

const Dashboard = () => {
  const date = new Date();


     const tableColumns: ColumnType[] = [
    { header: "ID", accessor: "orderId" },
    { header: "Pelanggan", accessor: "customerName" },
    { header: "Layanan", accessor: "services" },
    { header: "Status", accessor: "status" },
    { header: "Berat", accessor: "berat" },
    { header: "Unit", accessor: "unit" },
    { header: "Total", accessor: "total" },
    { 
      header: "Action", 
      // Karena Action berisi tombol, kita gunakan 'render'
      render: (row) => (
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => console.log("Lihat detail ID:", row.orderId)}
        >
          Detail
        </button>
      ) 
    }
  ];
  const cardList = [
    { id : 1, title : "Order Today", value : 25 },
    { id : 2, title : "Revenue Today", value : 25 },
    { id : 3, title : "Status(Processed)", value : 25 },
    { id : 4, title : "Status(Pending)", value : 25 }
  ]

  const dumyList = [
    { orderId : 1, customerName : "John Doe", services : "Laundry", status : "Processed", unit : "kg", berat : 2, total : 25000 },
    { orderId : 3, customerName : "Jane Doe", services : "Laundry", status : "Processed", unit : "kg", berat : 2, total : 25000 },
  ]

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        
        {/* header start */}
        <div>
          <h5 className="text-sm text-gray-500 mb-2">Sistem internal Oma Laundry</h5>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button className="btn btn-primary rounded-2xl w-full sm:w-auto">
              + Buat Order
            </button>
          </div>
          
          <h5 className="text-sm text-gray-500 mt-2">{date.toDateString()}</h5>
        </div>
        {/* header end */}

        {/* card */}
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cardList.map((card) => (
           
            <Card key={card.id} title={card.title} value={card.value}/>
          ))}
        </div>
        {/* card end */}

        {/* table */}
       
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <Table title="Daftar Orders" columns={tableColumns} data={dumyList}/>
        </div>
        {/* table end*/}
        
      </div>
    </Layout>
  )
}

export default Dashboard