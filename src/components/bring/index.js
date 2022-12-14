export default function bring({
    path,
    options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        redirect: "follow", // manual, *follow, error
        // body: formData // body data type must match "Content-Type" header
    },
}) {
    if (!path) throw new Error("Path is required")
    options = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include",
        // headers: {
        //     "Content-Type": "application/json",
        // },
        redirect: "follow", // manual, *follow, error
        // body: formData // body data type must match "Content-Type" header
        ...options,
    }
    // console.log(options)
    path = path.includes("://") ? path : "http://localhost:3000" + (path.startsWith("/") ? path : "/" + path)
        return fetch(path, options)
}