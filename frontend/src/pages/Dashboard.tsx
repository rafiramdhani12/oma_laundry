import Card from '../components/Card';
import Layout from '../components/Layout'

const Dashboard = () => {
  const date = new Date();

  const cardList = [
    {
      id : 1,
      title : "Order Today",
      value : 25
    },
    {
      id : 2,
      title : "Revenue Today",
      value : 25
    },
    {
      id : 3,
      title : "Status(Processed)",
      value : 25
    },
    {
      id : 4,
      title : "Status(Pending)",
      value : 25
    }
  ]
  return (
    <>
    <Layout>
      {/* header start */}
        <h5>sistem internal Oma Laundry</h5>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button className="btn btn-primary rounded-2xl">+ Buat Order</button>
        </div>
        <h5>{date.toDateString()}</h5>
        {/* header end */}

        {/* card */}
        <div className="flex gap-5">
        {cardList.map((card) => (
          <>
          <Card key={card.id} title={card.title} value={card.value}/>
          </>
        ))}
        </div>
        {/* card end */}

        {/* card */}
        <div className="mt-10">
        <h1>Orders</h1>
          <div className="overflow-x-auto">
            <table className="table">
              {/* table */}
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Customer Name</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                  <td>Blue</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Desktop Support Technician</td>
                  <td>Purple</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                  <td>Red</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
        {/* table end*/}
    </Layout>
    </>
  )
}

export default Dashboard