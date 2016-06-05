var http = {
  get: function(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        callback(xmlhttp);
      }
    };
    xmlhttp.send();
  },
  post: function(url, data, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        callback(xmlhttp);
      }
    }
    xmlhttp.send(data);
  }
};
