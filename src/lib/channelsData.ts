
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
    id: 10,
    name: "SESC TV",
    streamUrl: "https://slbps-ml-sambatech.akamaized.net/samba-live/2472/7424/b0601c5cba87e912a4e37e8b68c1499b/video/3ddc38be-7935-4d7d-ad0c-2da72c1d5613_index1080p.m3u8",
    logo: "https://i.imgur.com/Tn8T7QM.png",
    description: "Canal cultural do SESC",
    categories: ["Cultura", "Educacional", "Entretenimento"]
  },
  {
    id: 12,
    name: "TV Poços",
    streamUrl: "https://video01.logicahost.com.br/tvpocos/tvpocos/chunklist_w470694492.m3u8",
    logo: "https://i.imgur.com/KMXfp7v.png",
    description: "Canal de Poços de Caldas, Minas Gerais",
    categories: ["Notícias", "Entretenimento"]
  },
  {
    id: 13,
    name: "RTP 1",
    streamUrl: "https://gcdn.2mdn.net/videoplayback/id/938c1413aa58ec28/itag/347/source/web_video_ads/xpc/EgVovf3BOg%3D%3D/ctier/L/acao/yes/ip/0.0.0.0/ipbits/0/expire/3883851423/sparams/id,itag,source,xpc,ctier,acao,ip,ipbits,expire/signature/63E5AF3BFBD26B6A63D1391C7933725CD9620BBC.7D4C641797D686D407E27AAF032C680D52CADA6E/key/ck2/file/file.mp4",
    logo: "https://i.imgur.com/DsVYHN0.png",
    description: "Canal de televisão português",
    categories: ["Notícias", "Entretenimento", "Cultura"]
  },
  {
    id: 14,
    name: "Rede Brasil",
    streamUrl: "https://video09.logicahost.com.br/redebrasiloficial/redebrasiloficial/chunklist_w1421363920.m3u8",
    logo: "https://i.imgur.com/zX5c4CG.png",
    description: "Emissora brasileira de televisão aberta",
    categories: ["Notícias", "Entretenimento"]
  },
  {
    id: 15,
    name: "TV Cultura",
    streamUrl: "https://player-tvcultura.stream.uol.com.br/live/tvcultura_lsd.m3u8?vhost=player-tvcultura.stream.uol.com.br",
    logo: "https://i.imgur.com/4d3qSZ3.png",
    description: "Canal de televisão educativa e cultural",
    categories: ["Educacional", "Cultura", "Entretenimento"]
  },
  {
    id: 16,
    name: "TVE RS",
    streamUrl: "https://streaming.procergs.com.br:8443/tve/smil:tve-s.smil/chunklist_w762456522_b5128000.m3u8",
    logo: "https://i.imgur.com/OJaEU5B.png",
    description: "Televisão Educativa do Rio Grande do Sul",
    categories: ["Educacional", "Cultura"]
  },
  {
    id: 17,
    name: "Euronews",
    streamUrl: "https://r2---sn-bg0e6nel.c.2mdn.net/videoplayback/id/e79db77bdba9c262/itag/37/source/web_video_ads/xpc/EgVovf3BOg%3D%3D/ctier/L/acao/yes/ip/0.0.0.0/ipbits/0/expire/1772719484/sparams/acao,ctier,expire,id,ip,ipbits,itag,met,mh,mip,mm,mn,ms,mv,mvi,pl,rms,source,xpc/signature/13677EEB7AEB4778DE7C6CCF85D368C91F167E7A.6A65285B2D60E56DBBB1E8B41300CD255656D62B/key/cms1/cms_redirect/yes/met/1741183485,/mh/iY/mip/2804:2140:1000:9900:6cc8:5415:c387:7bb3/mm/42/mn/sn-bg0e6nel/ms/onc/mt/1741183233/mv/m/mvi/2/pl/47/rms/onc,onc/file/file.mp4",
    logo: "https://i.imgur.com/8t9mdg9.png",
    description: "Canal de notícias europeu com cobertura internacional",
    categories: ["Notícias"]
  }
];
