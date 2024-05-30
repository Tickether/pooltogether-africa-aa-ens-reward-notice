export interface Pooler {
    address: string
    email: string
    ens: string 
}

export const getPooler = async (address: `0x${string}`)=>{
    if (address) {
        try {
            const res = await fetch('https://susu.club/api/getPooler', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    address,
                })
            })
            const pooler: Pooler = await res.json()
            console.log(pooler)
            return pooler
        } catch(err){
            console.log(err)
        }
    }
}