let body = $response.body;
let obj = JSON.parse(body);

if (obj.data && Array.isArray(obj.data)) {
    obj.data = obj.data.filter(item => {
        return item.type !== "DISCOVERY_BANNER";
    });
}

$done({
    body: JSON.stringify(obj)
});