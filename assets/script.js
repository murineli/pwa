const URL = "https://api-sse-pwa-orpin.vercel.app/api";
const title = document.getElementById("title");
const body = document.getElementById("body");
const hamburger = document.getElementsByClassName("hamburger");
const menu = document.getElementsByClassName("menu")[0];

menu.style.display = "none";

hamburger[0].addEventListener("click", (e) => {
    e.preventDefault();
    if (window.innerWidth <= 800) {
        menu.style.display = menu.style.display === "none" ? "flex" : "none";
    }
})

window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
        menu.style.display = "none";
    }
})

async function getData() {
    try {
        const response = await fetch(URL);
        return await response.json()
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    try {
        const page = await getData();

        console.group('PageData');
        console.log(page.data.title);
        console.groupEnd();
        title.innerText = page.data.title;
        body.innerText = page.data.body;
    } catch (e) {
        console.error(e);
    }
}

main();





function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
console.log('Iniciou...')

if ('serviceWorker' in navigator && 'Notification' in window) {
    console.log('Iniciou...')
    window.onload = function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function(reg) {
            console.log('Service worker successfully registered.');
            console.log(reg);
        }).catch(function(err) {
            console.log('Service worker error.')
            console.log(err);
        });

        navigator.serviceWorker.ready.then((reg) => {

            // unsubscribe the browser on the server
            // reg.pushManager.getSubscription()
            //     .then(function(subscription) {
            //         console.log(subscription);
            //         subscription.unsubscribe()
            //             .then(() => {
            //                 console.log('Unsubscribing service worker.');
            //             })
            //         .catch(function(err) {
            //             console.log('Unsubscribing Service worker error.')
            //         })
            //     })

            // subscribe brower on the server
            const appCode = 'BDleIkEWu2Rx2E0WXLkD5IUdtIw6S0KY9lV03IAvFdcpG8QTJJmoc8ZR8acbNG_qpk-r-vG7oYDXujefIxnaWDQ'
            const options = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(appCode)
            }
            reg.pushManager.subscribe(options)
                .then(function(pushSubscription) {
                    console.log(JSON.stringify(pushSubscription));
                    // TODO Send to nodeJS
                    fetch('http://164.92.79.37/api/subs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(pushSubscription)
                    })
                    .then(response => {
                        return response.json()
                    })
                        .catch(function(err) {
                            console.log(err);
                        })
                })
            .catch(function(err) {
                console.log('Service worker error.')
                console.log(err);
            })
        })

        Notification.requestPermission((permission) => {
            if (permission === 'granted') {
                console.log('Permission granted.');
            } else {
                console.log('Permission denied.');
            }
        });
    }

    console.log(navigator)

}
