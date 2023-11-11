let promise = new Promise((resolve, reject) => {
    // setTimeout(() => {
    //     console.log("I am executing after 5 second")
        resolve("Resolved")
    // }, 5000)
    console.log("i am exe")
})

console.log("at line 9")

promise
.then((r) => console.log("then ",r))
.catch((r) => console.log("catch",r))

console.log("at line 15")

// async function prom() {
//     const res = await promise
//     console.log("Res", res)

//     for (let I = 0; I < 10; I++) {
//         console.log("-->", I)
//     }
// }

// prom()