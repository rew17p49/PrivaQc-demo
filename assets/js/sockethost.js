let hostname = window.location.hostname;
hostname.includes('localhost') ? hostname = hostname + ":3000" : hostname;
// const hostname = window.location.hostname;
let socketHost = window.location.protocol + "//" + hostname;
