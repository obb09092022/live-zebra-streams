
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
  }
];
