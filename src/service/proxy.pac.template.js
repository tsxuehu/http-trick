var proxy = "<%= proxy %>";
var hostMap = <%= hostMap %>;
var globHostArray = <%= globHostArray %>;
var all= <%= all %>;
function FindProxyForURL(url, host) {
  var shouldGoThroughProxy = false;
  if (all) {
    shouldGoThroughProxy = true;
  } else if (hostMap[host]) {
    shouldGoThroughProxy = true;
  } else {
    var length = globHostArray.length;
    var i;
    for (i = 0; i < length; i++) {
      if (dnsDomainIs(host, globHostArray[i])) {
        shouldGoThroughProxy = true;
        break;
      }
    }
  }

  if (shouldGoThroughProxy) {
    return proxy;
  } else {
    return "DIRECT";
  }
}
