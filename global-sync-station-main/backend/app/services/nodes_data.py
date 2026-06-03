"""Static node registry — mirrors the COUNTRIES list in the React frontend
so that the API and UI stay in lockstep."""

COUNTRIES: list[dict] = [
    {"flag":"🇮🇳","iso":"in","name":"India",         "code":"IND","tz":"Asia/Kolkata",                  "offsetLabel":"UTC +05:30","accent":"#FF9933","peer":"time.nplindia.gov.in", "refid":".GPS.", "stratum":1,"baseRtt":142.4,"baseDrift": 0.21,"poll":8},
    {"flag":"🇺🇸","iso":"us","name":"United States", "code":"USA","tz":"America/New_York",              "offsetLabel":"UTC −05:00","accent":"#3C3B6E","peer":"time.nist.gov",        "refid":".NIST","stratum":1,"baseRtt": 94.6,"baseDrift":-0.08,"poll":8},
    {"flag":"🇯🇵","iso":"jp","name":"Japan",         "code":"JPN","tz":"Asia/Tokyo",                    "offsetLabel":"UTC +09:00","accent":"#BC002D","peer":"ntp.nict.jp",          "refid":".JJY.", "stratum":1,"baseRtt":238.7,"baseDrift": 0.42,"poll":9},
    {"flag":"🇩🇪","iso":"de","name":"Germany",       "code":"DEU","tz":"Europe/Berlin",                 "offsetLabel":"UTC +01:00","accent":"#FFCE00","peer":"ptbtime1.ptb.de",      "refid":".DCFa.","stratum":1,"baseRtt": 12.3,"baseDrift":-0.04,"poll":7},
    {"flag":"🇦🇺","iso":"au","name":"Australia",     "code":"AUS","tz":"Australia/Sydney",              "offsetLabel":"UTC +11:00","accent":"#00247D","peer":"ntp1.tpg.com.au",      "refid":".GPS.", "stratum":1,"baseRtt":296.1,"baseDrift": 0.55,"poll":9},
    {"flag":"🇦🇪","iso":"ae","name":"UAE",           "code":"ARE","tz":"Asia/Dubai",                    "offsetLabel":"UTC +04:00","accent":"#00732F","peer":"time.etisalat.ae",     "refid":".GPS.", "stratum":2,"baseRtt": 72.9,"baseDrift": 0.18,"poll":8},
    {"flag":"🇸🇬","iso":"sg","name":"Singapore",     "code":"SGP","tz":"Asia/Singapore",                "offsetLabel":"UTC +08:00","accent":"#EF3340","peer":"ntp.singnet.com.sg",   "refid":".PPS.", "stratum":1,"baseRtt":214.5,"baseDrift": 0.31,"poll":9},
    {"flag":"🇨🇦","iso":"ca","name":"Canada",        "code":"CAN","tz":"America/Toronto",               "offsetLabel":"UTC −05:00","accent":"#FF0000","peer":"time.chu.nrc.ca",      "refid":".CHU.", "stratum":1,"baseRtt": 88.2,"baseDrift":-0.11,"poll":8},
    {"flag":"🇬🇧","iso":"gb","name":"United Kingdom","code":"GBR","tz":"Europe/London",                 "offsetLabel":"UTC +00:00","accent":"#012169","peer":"ntp1.npl.co.uk",       "refid":".MSF.", "stratum":1,"baseRtt":  9.8,"baseDrift":-0.02,"poll":7},
    {"flag":"🇫🇷","iso":"fr","name":"France",        "code":"FRA","tz":"Europe/Paris",                  "offsetLabel":"UTC +01:00","accent":"#0055A4","peer":"ntp.obspm.fr",         "refid":".GPS.", "stratum":1,"baseRtt": 11.4,"baseDrift": 0.03,"poll":7},
    {"flag":"🇧🇷","iso":"br","name":"Brazil",        "code":"BRA","tz":"America/Sao_Paulo",             "offsetLabel":"UTC −03:00","accent":"#009C3B","peer":"a.ntp.br",             "refid":".GPS.", "stratum":1,"baseRtt":218.6,"baseDrift": 0.27,"poll":9},
    {"flag":"🇰🇷","iso":"kr","name":"South Korea",   "code":"KOR","tz":"Asia/Seoul",                    "offsetLabel":"UTC +09:00","accent":"#CD2E3A","peer":"time.kriss.re.kr",     "refid":".PPS.", "stratum":1,"baseRtt":232.4,"baseDrift": 0.39,"poll":9},
    {"flag":"🇨🇳","iso":"cn","name":"China",         "code":"CHN","tz":"Asia/Shanghai",                 "offsetLabel":"UTC +08:00","accent":"#DE2910","peer":"ntp.aliyun.com",       "refid":".BPC.", "stratum":2,"baseRtt":226.0,"baseDrift": 0.34,"poll":9},
    {"flag":"🇷🇺","iso":"ru","name":"Russia",        "code":"RUS","tz":"Europe/Moscow",                 "offsetLabel":"UTC +03:00","accent":"#0039A6","peer":"ntp1.vniiftri.ru",     "refid":".GLNS.","stratum":1,"baseRtt": 44.7,"baseDrift": 0.15,"poll":8},
    {"flag":"🇮🇹","iso":"it","name":"Italy",         "code":"ITA","tz":"Europe/Rome",                   "offsetLabel":"UTC +01:00","accent":"#008C45","peer":"ntp1.inrim.it",        "refid":".CSm.", "stratum":1,"baseRtt": 18.6,"baseDrift": 0.05,"poll":7},
    {"flag":"🇪🇸","iso":"es","name":"Spain",         "code":"ESP","tz":"Europe/Madrid",                 "offsetLabel":"UTC +01:00","accent":"#AA151B","peer":"hora.roa.es",          "refid":".GPS.", "stratum":1,"baseRtt": 22.3,"baseDrift": 0.07,"poll":7},
    {"flag":"🇳🇱","iso":"nl","name":"Netherlands",   "code":"NLD","tz":"Europe/Amsterdam",              "offsetLabel":"UTC +01:00","accent":"#AE1C28","peer":"ntp.time.nl",          "refid":".PPS.", "stratum":1,"baseRtt":  8.4,"baseDrift":-0.03,"poll":7},
    {"flag":"🇨🇭","iso":"ch","name":"Switzerland",   "code":"CHE","tz":"Europe/Zurich",                 "offsetLabel":"UTC +01:00","accent":"#DA291C","peer":"ntp11.metas.ch",       "refid":".CSm.", "stratum":1,"baseRtt": 14.1,"baseDrift": 0.02,"poll":7},
    {"flag":"🇸🇪","iso":"se","name":"Sweden",        "code":"SWE","tz":"Europe/Stockholm",              "offsetLabel":"UTC +01:00","accent":"#006AA7","peer":"ntp1.sp.se",           "refid":".CSm.", "stratum":1,"baseRtt": 26.8,"baseDrift": 0.06,"poll":7},
    {"flag":"🇳🇴","iso":"no","name":"Norway",        "code":"NOR","tz":"Europe/Oslo",                   "offsetLabel":"UTC +01:00","accent":"#BA0C2F","peer":"ntp.justervesenet.no", "refid":".PPS.", "stratum":1,"baseRtt": 29.7,"baseDrift": 0.09,"poll":8},
    {"flag":"🇿🇦","iso":"za","name":"South Africa",  "code":"ZAF","tz":"Africa/Johannesburg",           "offsetLabel":"UTC +02:00","accent":"#007749","peer":"ntp1.meraka.csir.co.za","refid":".GPS.","stratum":1,"baseRtt":168.3,"baseDrift": 0.22,"poll":8},
    {"flag":"🇲🇽","iso":"mx","name":"Mexico",        "code":"MEX","tz":"America/Mexico_City",           "offsetLabel":"UTC −06:00","accent":"#006847","peer":"cronos.cenam.mx",      "refid":".GPS.", "stratum":1,"baseRtt":142.8,"baseDrift": 0.17,"poll":8},
    {"flag":"🇦🇷","iso":"ar","name":"Argentina",     "code":"ARG","tz":"America/Argentina/Buenos_Aires","offsetLabel":"UTC −03:00","accent":"#74ACDF","peer":"hora.oan.uncu.edu.ar", "refid":".GPS.", "stratum":2,"baseRtt":232.5,"baseDrift": 0.29,"poll":9},
    {"flag":"🇹🇷","iso":"tr","name":"Turkey",        "code":"TUR","tz":"Europe/Istanbul",               "offsetLabel":"UTC +03:00","accent":"#E30A17","peer":"time.ulakbim.gov.tr",  "refid":".GPS.", "stratum":1,"baseRtt": 56.4,"baseDrift": 0.12,"poll":8},
    {"flag":"🇸🇦","iso":"sa","name":"Saudi Arabia",  "code":"SAU","tz":"Asia/Riyadh",                   "offsetLabel":"UTC +03:00","accent":"#006C35","peer":"time.kacst.edu.sa",    "refid":".PPS.", "stratum":1,"baseRtt": 78.9,"baseDrift": 0.19,"poll":8},
    {"flag":"🇮🇱","iso":"il","name":"Israel",        "code":"ISR","tz":"Asia/Jerusalem",                "offsetLabel":"UTC +02:00","accent":"#0038B8","peer":"ntp.inp.org.il",       "refid":".GPS.", "stratum":1,"baseRtt": 61.2,"baseDrift": 0.14,"poll":8},
    {"flag":"🇪🇬","iso":"eg","name":"Egypt",         "code":"EGY","tz":"Africa/Cairo",                  "offsetLabel":"UTC +02:00","accent":"#C8102E","peer":"time.nis.sci.eg",      "refid":".GPS.", "stratum":2,"baseRtt": 68.5,"baseDrift": 0.16,"poll":8},
    {"flag":"🇳🇬","iso":"ng","name":"Nigeria",       "code":"NGA","tz":"Africa/Lagos",                  "offsetLabel":"UTC +01:00","accent":"#008751","peer":"ng.pool.ntp.org",      "refid":"0x4e3b","stratum":2,"baseRtt":124.6,"baseDrift": 0.24,"poll":9},
    {"flag":"🇰🇪","iso":"ke","name":"Kenya",         "code":"KEN","tz":"Africa/Nairobi",                "offsetLabel":"UTC +03:00","accent":"#BB0000","peer":"ke.pool.ntp.org",      "refid":"0x8a17","stratum":2,"baseRtt":152.4,"baseDrift": 0.26,"poll":9},
    {"flag":"🇹🇭","iso":"th","name":"Thailand",      "code":"THA","tz":"Asia/Bangkok",                  "offsetLabel":"UTC +07:00","accent":"#A51931","peer":"time.nimt.or.th",      "refid":".GPS.", "stratum":1,"baseRtt":198.7,"baseDrift": 0.28,"poll":9},
    {"flag":"🇮🇩","iso":"id","name":"Indonesia",     "code":"IDN","tz":"Asia/Jakarta",                  "offsetLabel":"UTC +07:00","accent":"#FF0000","peer":"ntp.bmkg.go.id",       "refid":".GPS.", "stratum":1,"baseRtt":234.1,"baseDrift": 0.33,"poll":9},
    {"flag":"🇵🇭","iso":"ph","name":"Philippines",   "code":"PHL","tz":"Asia/Manila",                   "offsetLabel":"UTC +08:00","accent":"#0038A8","peer":"ph.pool.ntp.org",      "refid":"0xc104","stratum":2,"baseRtt":248.6,"baseDrift": 0.36,"poll":9},
    {"flag":"🇻🇳","iso":"vn","name":"Vietnam",       "code":"VNM","tz":"Asia/Ho_Chi_Minh",              "offsetLabel":"UTC +07:00","accent":"#DA251D","peer":"vn.pool.ntp.org",      "refid":"0x7f21","stratum":2,"baseRtt":212.4,"baseDrift": 0.31,"poll":9},
    {"flag":"🇳🇿","iso":"nz","name":"New Zealand",   "code":"NZL","tz":"Pacific/Auckland",              "offsetLabel":"UTC +13:00","accent":"#00247D","peer":"ntp.massey.ac.nz",     "refid":".GPS.", "stratum":1,"baseRtt":318.2,"baseDrift": 0.48,"poll":9},
]

COUNTRIES_BY_CODE = {c["code"].lower(): c for c in COUNTRIES}
COUNTRIES_BY_ISO = {c["iso"].lower(): c for c in COUNTRIES}


def find_country(key: str) -> dict | None:
    k = key.lower()
    return COUNTRIES_BY_CODE.get(k) or COUNTRIES_BY_ISO.get(k)
