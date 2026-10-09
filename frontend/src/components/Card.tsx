import React from 'react'

const Card = ({title , value} : {title : string , value : number}) => {
  return (
        <div className="card w-60 bg-base-100 shadow-xl mt-6 rounded-2xl">
          <div className="card-body">
            <h2 className="card-title">{title}</h2>
            {title == "revenue today" ? <h2 className="card-title">Rp. {value}</h2> : <h2 className="card-title">{value}</h2>}
          </div>
        </div>
  )
}

export default Card