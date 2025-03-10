self.addEventListener('install', (event) => {
    console.log('Service worker install');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
});

self.addEventListener('push', (event) => {
    console.log('Service worker pushed');
    console.log(event.data.text());
    const data = JSON.parse(event.data.text());
    event.waitUntil(
        self.registration.showNotification(
            data.title,
            {
                title: data.title,
                body: data.body,
                data: {
                    id:data.id,
                    url: "https://www.google.com/aeeajejeeaje"
                },
                actions: [
                    { title: "Do", action: 'mark_do' },
                ]
            }
        )
    )

});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    if (event.action === 'mark_do') {
        console.log('Mark as do notification');
    } else {
        console.log("Notification clicked");
        console.log(event);
        console.log(event.notification);
        console.log(event.notification.data);
    }
})