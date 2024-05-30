export const postPoolerReward = async (
    address: string, 
    target: string, 
    txn: string, 
    amount: string,  
    txOf: string
) => {
    try {
        const res = await fetch('https://susu.club/api/postDeposit', {
            method: 'POST',
            headers: {
            'Content-type': 'application/json'
            },
            body: JSON.stringify({
                address,
                target, 
                txn, 
                amount, 
                txOf 
            })
        }) 
        const reward =  await res.json()
        console.log(reward)
    } catch (error) {
        console.log(error)
    }
    
}