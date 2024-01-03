'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Page() {
    let [data, setData] = useState({ message: '' })

    useEffect(() => {
       axios.get('/api/hello/backend')
        .then((res) => res.data)
        .then((data) => {
            setData(data)
        })
    }, [])

    return <div>hello {data.message}!</div>
}
