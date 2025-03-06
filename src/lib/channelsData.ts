
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
    logo: "https://seeklogo.com/images/S/sbt-logo-3D30D31294-seeklogo.com.png",
    description: "Canal de televisão pública brasileiro",
    categories: ["Notícias", "Cultura", "Educacional"]
  },
  {
    id: 2,
    name: "Amazon Sat",
    streamUrl: "https://amazonsat.brasilstream.com.br/hls/amazonsat/index.m3u8",
    logo: "https://portalamazonia.com/wp-content/uploads/2022/05/b2ap3_large_atual-logo.jpg",
    description: "Emissora da região amazônica",
    categories: ["Notícias", "Cultura"]
  },
  {
    id: 3,
    name: "Rede Minas",
    streamUrl: "https://8hzcavccys.zoeweb.tv/redeminas/ngrp:redeminas_all/chunklist_b2179072.m3u8",
    logo: "https://redeminas.tv/wp-content/uploads/2014/09/RedeMinas.png",
    description: "Canal de televisão do estado de Minas Gerais",
    categories: ["Entretenimento", "Cultura"]
  },
  {
    id: 4,
    name: "ISTV",
    streamUrl: "https://video08.logicahost.com.br/istvnacional/srt.stream/chunklist_w745016844.m3u8",
    logo: "https://www.istv.com.br/static/media/Logo_ISTV_01.0b00a8e55712712e3890.png",
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
  }
];
