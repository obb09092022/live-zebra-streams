
export interface Channel {
  id: number;
  name: string;
  streamUrl: string;
  logo: string;
  description: string;
  categories: string[];
}

export const categories = [
  "Todos",
  "Notícias",
  "Esportes",
  "Entretenimento",
  "Cultura",
  "Educacional"
];

export const channels: Channel[] = [
  {
    id: 1,
    name: "TV Brasil",
    streamUrl: "https://cdn.live.br1.jmvstream.com/w/LVW-10801/LVW10801_Xvg4R0u57n/chunklist.m3u8",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/TV_Brasil_logo.png/320px-TV_Brasil_logo.png",
    description: "Canal de televisão pública brasileiro",
    categories: ["Notícias", "Cultura", "Educacional"]
  },
  {
    id: 2,
    name: "Amazon Sat",
    streamUrl: "https://amazonsat.brasilstream.com.br/hls/amazonsat/index.m3u8",
    logo: "https://i.imgur.com/7hL3cim.png",
    description: "Emissora da região amazônica",
    categories: ["Notícias", "Cultura"]
  },
  {
    id: 3,
    name: "Rede Minas",
    streamUrl: "https://8hzcavccys.zoeweb.tv/redeminas/ngrp:redeminas_all/chunklist_b2179072.m3u8",
    logo: "https://i.imgur.com/8xJM5Vw.png",
    description: "Canal de televisão do estado de Minas Gerais",
    categories: ["Entretenimento", "Cultura"]
  },
  {
    id: 4,
    name: "ISTV",
    streamUrl: "https://video08.logicahost.com.br/istvnacional/srt.stream/chunklist_w745016844.m3u8",
    logo: "https://i.imgur.com/QtzXz9q.png",
    description: "Canal de televisão brasileiro independente",
    categories: ["Esportes", "Entretenimento"]
  },
  {
    id: 5,
    name: "Times Brasil",
    streamUrl: "https://video01.soultv.com.br/timesbrasil/timesbrasil/chunklist_w1736684773.m3u8",
    logo: "https://i.imgur.com/GRznuGa.png",
    description: "Canal de esportes brasileiro",
    categories: ["Esportes", "Notícias"]
  },
  {
    id: 6,
    name: "CNN Brasil",
    streamUrl: "https://video01.soultv.com.br/cnnbrasil/cnnbrasil/chunklist_w131799499.m3u8",
    logo: "https://i.imgur.com/FYdDmO1.png",
    description: "Canal de notícias 24 horas",
    categories: ["Notícias"]
  },
  {
    id: 7,
    name: "Record News",
    streamUrl: "https://rnw-rn-soultv.otteravision.com/rnw/rn/rnw_rn_720p_high.m3u8",
    logo: "https://i.imgur.com/HZDRG0K.png",
    description: "Canal de notícias da Record",
    categories: ["Notícias"]
  },
  {
    id: 8,
    name: "Canal UOL",
    streamUrl: "https://video01.soultv.com.br/uoltv/uoltv/chunklist_w613550449.m3u8",
    logo: "https://i.imgur.com/WFqNIeO.png",
    description: "Canal de notícias e entretenimento do UOL",
    categories: ["Notícias", "Entretenimento"]
  },
  {
    id: 9,
    name: "CNN Money",
    streamUrl: "https://video03.logicahost.com.br/cnnmoney/cnnmoney/chunklist_w66931688.m3u8",
    logo: "https://i.imgur.com/vK2F3WG.png",
    description: "Canal de notícias econômicas",
    categories: ["Notícias"]
  },
  {
    id: 10,
    name: "SESC TV",
    streamUrl: "https://slbps-ml-sambatech.akamaized.net/samba-live/2472/7424/b0601c5cba87e912a4e37e8b68c1499b/video/3ddc38be-7935-4d7d-ad0c-2da72c1d5613_index1080p.m3u8",
    logo: "https://i.imgur.com/Tn8T7QM.png",
    description: "Canal cultural do SESC",
    categories: ["Cultura", "Educacional", "Entretenimento"]
  },
  {
    id: 11,
    name: "TV Globo",
    streamUrl: "https://live-as-03-31.video.globo.com/j/eyJhbGciOiJSUzUxMiIsImtpZCI6IjEiLCJ0eXAiOiJKV1QifQ.eyJjb3VudHJ5X2NvZGUiOiJCUiIsImRvbWFpbiI6ImxpdmUtYXMtMDMtMzEudmlkZW8uZ2xvYm8uY29tIiwiZXhwIjoxNzQxMTkzMjQ5LCJpYXQiOjE3NDExODI0NDksImlzcyI6InBsYXliYWNrLWFwaS1wcm9kLWdjcCIsIm93bmVyIjoiNWEyNzAzNjQtYTVkZC00ZTE5LTg1ZGMtNWU1ZmZkNDQ0NWQ3IiwicGF0aCI6Ii9udS9mKGk9MikvZ2xvYm8tdmFyL3BsYXlsaXN0Lm0zdTgifQ.WP7eLm9fwRGL9gpSVhGTAp36Uy8lMUp-QMyBDsiU1DZFFu8HTP9nY3qP9Xz-Zdp_U5HiVJYXpm3oKQQ2rySYhHi7DCzmlzgCn85GxzadBSNjc79eBoQNYPUgLSgW7E1XRY3EpA-lCZuLdXez1dUE38gN9tJklBetjX7FPluEgLKdYJWtLkvx64nmKkV8jEUIeutlpkDWB4pzEppX4TQDGBsJZ_SjdXB8MMDB7WO0UUgNm5-w_QWvHa_Mtc8ss-pxCpJibzyRh1p0OrjUDF4anHd7zJSZMFuM5lqgpQyLBmo9MKpk0lQTNWyi1ohmWADRkvkzTiTQUNzEp4xeBFCR1g/nu/f(i=2)/globo-var/globo-var-audio_1=96000-video=3442944.m3u8",
    logo: "https://i.imgur.com/ozCe9ek.png",
    description: "Principal emissora de televisão do Brasil",
    categories: ["Notícias", "Entretenimento"]
  }
];
