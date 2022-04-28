now = new Date();
//year = now.getFullYear();
document.write(now);

    var aylar = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
    var gunler = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");
    function tarih() {
        var now = new Date();
        var yil = now.getFullYear();
        var ay = now.getMonth();
        var gun = now.getDate();
        var haftagun = now.getDay();       
        var now = new Date();
        var saat = now.getHours();
        var dakika = now.getMinutes();
        saat = sifirekle(saat);
        dakika = sifirekle(dakika);
      //  var s = getZeroNumber(second);
        document.getElementById("tarih").innerHTML = gun + " " + aylar[ay] + " " + yil + " " + gunler[haftagun] + " " + saat + ":" + dakika;
        window.setTimeout("tarih()", 60000);
    }
    function sifirekle(sayi) {
        if (sayi < 10) {
            return "0" + sayi.toString();
        } else {
            return sayi.toString();
        }
    }
