vcl 4.0;

backend default {
    .host = "store-web";
    .port = "3000";
}

sub vcl_recv {
    if (req.method == "GET") {
        return (hash);
    } else {
        return (pass);
    }
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Varnish-Cache = "HIT";
    } else {
        set resp.http.X-Varnish-Cache = "MISS";
    }
}