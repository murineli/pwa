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
                    fetch('http://127.0.0.1:7777/api/subs', {
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