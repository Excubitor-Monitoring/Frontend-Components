let socket;
let sublist = [];

export async function connectSocket(url, callback){
    socket = new WebSocket(url);
    socket.addEventListener("message", (socketEvent) => {
        //console.log(socketEvent.data);

        const data = JSON.parse(socketEvent.data);
        const event = new CustomEvent(data.target, {
            detail: JSON.parse(data.value)
        })
        window.dispatchEvent(event);
    });

    socket.addEventListener("open", () => {
        window.addEventListener("SUB2SOCKET", (event) => {
            socket.send(JSON.stringify({
                op: "SUB",
                target: event.detail,
                value: ""
            }));
    
            sublist.push(event.detail);
        })

        window.addEventListener("UNSUB2SOCKET", (event) => {
            socket.send(JSON.stringify({
                op: "UNSUB",
                target: event.detail,
                value: ""
            }));
        })

        window.addEventListener("HIST2SOCKET", (event) => {

            //console.log(event.detail);

            socket.send(JSON.stringify({
                op: "HIST",
                target: event.detail.target,
                value: event.detail.value
            }));
        })

        callback();
    })

}

export function unsubAll(){
    sublist.forEach(element => {
        socket.send(JSON.stringify({
            op: "UNSUB",
            target: element,
            value: ""
        }));
    });
    sublist = [];
}

export function logSocket(){
    console.log(socket);
}