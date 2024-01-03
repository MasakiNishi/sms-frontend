'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Page() {
    let [data, setData] = useState({ name: '' })

    useEffect(() => {
       axios.get('/api/hello')
        .then((res) => res.data)
        .then((data) => {
            setData(data)
        })
    }, [])

    return <div>hello {data.name}!</div>
}
