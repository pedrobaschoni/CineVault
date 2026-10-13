/**
 * MODO DEMONSTRAÇÃO
 * Um "TMDB de mentira" com algumas dezenas de títulos, usado quando não há
 * TMDB_API_TOKEN. Responde às mesmas rotas e no mesmo formato da API real,
 * então o resto do site não sabe a diferença. Não há imagens: os pôsteres
 * aparecem como blocos de cor.
 */
import { TmdbError } from './errors';
import { GENRE_NAME } from './taxonomy';
import type { RawListItem, RawPage, RawPerson, RawPersonCredit, RawSeason, RawTitleDetail } from './raw';

type Kind = 'movie' | 'tv';

interface DemoTitle {
  kind: Kind;
  id: number;
  title: string;
  original: string;
  date: string;
  genres: number[];
  origin: string[];
  lang: string;
  vote: number;
  votes: number;
  pop: number;
  overview: string;
  cast?: Array<[number, string]>;
  directors?: number[];
  writers?: number[];
  runtime?: number;
  cert?: string;
  seasons?: Array<[number, number, number]>;
  ended?: number;
  collection?: number;
  flat?: number[];
  rent?: number[];
  kw?: number[];
  trailer?: string;
}

const NETFLIX = 8, PRIME = 119, DISNEY = 337, MAX = 1899, APPLE = 350, CRUNCHY = 283, GOOGLE = 3, APPLE_STORE = 2;
const TWIST = 1, PSYCH_HORROR = 2;

const TITLES: DemoTitle[] = [
  { kind: 'movie', id: 693134, title: 'Duna: Parte Dois', original: 'Dune: Part Two', date: '2024-02-27', genres: [878, 12], origin: ['US'], lang: 'en', vote: 8.1, votes: 7000, pop: 180,
    overview: 'Paul Atreides se une a Chani e aos Fremen em busca de vingança contra quem destruiu sua família, enquanto tenta evitar um futuro terrível que só ele consegue prever.',
    cast: [[1190668, 'Paul Atreides'], [505710, 'Chani'], [933238, 'Jessica'], [3810, 'Stilgar'], [1640439, 'Feyd-Rautha'], [1373737, 'Princesa Irulan']],
    directors: [137427], writers: [137427, 3000010], runtime: 166, cert: '14', collection: 726871, flat: [MAX], rent: [APPLE_STORE, GOOGLE, PRIME], trailer: 'Way9Dexny3w' },
  { kind: 'movie', id: 438631, title: 'Duna', original: 'Dune', date: '2021-09-15', genres: [878, 12], origin: ['US'], lang: 'en', vote: 7.8, votes: 13000, pop: 120,
    overview: 'Paul Atreides, herdeiro de uma família nobre, viaja para Arrakis, o planeta mais perigoso do universo, onde se decide o futuro de seu povo.',
    cast: [[1190668, 'Paul Atreides'], [933238, 'Jessica'], [25072, 'Leto Atreides'], [505710, 'Chani'], [3810, 'Stilgar']],
    directors: [137427], writers: [137427, 3000010], runtime: 155, cert: '14', collection: 726871, flat: [MAX], rent: [APPLE_STORE, GOOGLE] },
  { kind: 'movie', id: 841, title: 'Duna', original: 'Dune', date: '1984-12-14', genres: [878, 12], origin: ['US'], lang: 'en', vote: 6.3, votes: 3000, pop: 30,
    overview: 'Primeira adaptação para o cinema do romance de Frank Herbert sobre a disputa pelo planeta desértico Arrakis.', directors: [5602], runtime: 137, rent: [APPLE_STORE] },
  { kind: 'movie', id: 157336, title: 'Interestelar', original: 'Interstellar', date: '2014-11-05', genres: [12, 18, 878], origin: ['US', 'GB'], lang: 'en', vote: 8.4, votes: 36000, pop: 150,
    overview: 'Com a Terra à beira do colapso, um grupo de exploradores atravessa um buraco de minhoca em busca de um novo lar para a humanidade.', directors: [525], runtime: 169, cert: '10', flat: [PRIME], kw: [TWIST] },
  { kind: 'movie', id: 335984, title: 'Blade Runner 2049', original: 'Blade Runner 2049', date: '2017-10-04', genres: [878, 18], origin: ['US'], lang: 'en', vote: 7.5, votes: 13000, pop: 60,
    overview: 'Um novo blade runner descobre um segredo enterrado há décadas, capaz de mergulhar o que resta da sociedade no caos.', directors: [137427], runtime: 164, cert: '14', flat: [NETFLIX] },
  { kind: 'movie', id: 329865, title: 'A Chegada', original: 'Arrival', date: '2016-11-10', genres: [18, 878, 9648], origin: ['US'], lang: 'en', vote: 7.6, votes: 18000, pop: 50,
    overview: 'Uma linguista é chamada para tentar se comunicar com visitantes que pousaram em doze pontos da Terra.', directors: [137427], runtime: 116, cert: '10', flat: [PRIME], kw: [TWIST] },
  { kind: 'movie', id: 273481, title: 'Sicario: Terra de Ninguém', original: 'Sicario', date: '2015-09-17', genres: [28, 80, 53], origin: ['US'], lang: 'en', vote: 7.4, votes: 9000, pop: 40,
    overview: 'Uma agente do FBI entra numa força-tarefa contra o tráfico na fronteira entre Estados Unidos e México.', directors: [137427], runtime: 121, cert: '16' },
  { kind: 'movie', id: 146233, title: 'Os Suspeitos', original: 'Prisoners', date: '2013-09-18', genres: [18, 53, 80], origin: ['US'], lang: 'en', vote: 8.1, votes: 12000, pop: 45,
    overview: 'Quando a filha desaparece, um pai decide fazer justiça com as próprias mãos enquanto a polícia segue outra pista.', directors: [137427], runtime: 153, cert: '16', flat: [NETFLIX], kw: [TWIST] },
  { kind: 'movie', id: 181886, title: 'O Homem Duplicado', original: 'Enemy', date: '2013-09-08', genres: [9648, 53], origin: ['CA'], lang: 'en', vote: 6.9, votes: 4000, pop: 20,
    overview: 'Um professor descobre um ator idêntico a ele e fica obcecado em entender quem é o outro.', directors: [137427], runtime: 90, kw: [TWIST] },
  { kind: 'movie', id: 46738, title: 'Incêndios', original: 'Incendies', date: '2010-09-04', genres: [18, 9648, 10752], origin: ['CA'], lang: 'fr', vote: 8.1, votes: 2900, pop: 15,
    overview: 'Após a morte da mãe, dois irmãos viajam ao Oriente Médio para cumprir um último pedido e descobrem a história dela.', directors: [137427], writers: [137427], runtime: 131, kw: [TWIST] },
  { kind: 'movie', id: 872585, title: 'Oppenheimer', original: 'Oppenheimer', date: '2023-07-19', genres: [18, 36], origin: ['US'], lang: 'en', vote: 8.1, votes: 10000, pop: 100,
    overview: 'A história do físico J. Robert Oppenheimer e de seu papel no desenvolvimento da bomba atômica.', directors: [525], writers: [525], runtime: 180, cert: '16', flat: [PRIME] },
  { kind: 'movie', id: 76341, title: 'Mad Max: Estrada da Fúria', original: 'Mad Max: Fury Road', date: '2015-05-13', genres: [28, 12, 878], origin: ['AU'], lang: 'en', vote: 7.6, votes: 22000, pop: 70,
    overview: 'Num deserto pós-apocalíptico, Max e a Imperatriz Furiosa fogem de um tirano numa perseguição sem trégua.', runtime: 120, cert: '16', flat: [MAX] },
  { kind: 'movie', id: 786892, title: 'Furiosa: Uma Saga Mad Max', original: 'Furiosa: A Mad Max Saga', date: '2024-05-22', genres: [28, 12, 878], origin: ['AU'], lang: 'en', vote: 7.5, votes: 4000, pop: 80,
    overview: 'A juventude de Furiosa, levada de sua terra natal e criada no meio da guerra entre senhores do deserto.', runtime: 148, cert: '16', flat: [MAX] },
  { kind: 'movie', id: 545611, title: 'Tudo em Todo o Lugar ao Mesmo Tempo', original: 'Everything Everywhere All at Once', date: '2022-03-24', genres: [28, 12, 878], origin: ['US'], lang: 'en', vote: 7.8, votes: 7000, pop: 60,
    overview: 'Uma dona de lavanderia descobre que precisa se conectar com versões de si mesma em outros universos para salvar todos eles.', runtime: 139, flat: [PRIME] },
  { kind: 'movie', id: 762504, title: 'Não! Não Olhe!', original: 'Nope', date: '2022-07-20', genres: [27, 878, 9648], origin: ['US'], lang: 'en', vote: 6.8, votes: 5000, pop: 35,
    overview: 'Dois irmãos que treinam cavalos para Hollywood percebem algo estranho no céu do rancho da família.', runtime: 130, kw: [PSYCH_HORROR] },
  { kind: 'movie', id: 666277, title: 'Vidas Passadas', original: 'Past Lives', date: '2023-06-02', genres: [18, 10749], origin: ['US'], lang: 'en', vote: 7.8, votes: 1800, pop: 40,
    overview: 'Dois amigos de infância separados pela emigração se reencontram em Nova York, vinte anos depois.', runtime: 106 },
  { kind: 'movie', id: 419430, title: 'Corra!', original: 'Get Out', date: '2017-02-24', genres: [9648, 53, 27], origin: ['US'], lang: 'en', vote: 7.6, votes: 17000, pop: 50,
    overview: 'Um jovem visita a família da namorada pela primeira vez e percebe que a hospitalidade esconde algo muito mais sinistro.', runtime: 104, flat: [NETFLIX], kw: [TWIST, PSYCH_HORROR] },
  { kind: 'movie', id: 493922, title: 'Hereditário', original: 'Hereditary', date: '2018-06-07', genres: [27, 9648, 53], origin: ['US'], lang: 'en', vote: 7.3, votes: 8000, pop: 45,
    overview: 'Depois da morte da avó, uma família começa a descobrir segredos cada vez mais perturbadores sobre a própria história.', runtime: 127, kw: [PSYCH_HORROR] },
  { kind: 'movie', id: 496243, title: 'Parasita', original: '기생충', date: '2019-05-30', genres: [35, 53, 18], origin: ['KR'], lang: 'ko', vote: 8.5, votes: 18000, pop: 90,
    overview: 'Uma família pobre se infiltra, um a um, na casa de uma família rica, até que um segredo muda tudo.', runtime: 133, cert: '16', flat: [MAX], kw: [TWIST] },
  { kind: 'movie', id: 11324, title: 'Ilha do Medo', original: 'Shutter Island', date: '2010-02-14', genres: [18, 53, 9648], origin: ['US'], lang: 'en', vote: 8.2, votes: 24000, pop: 60,
    overview: 'Dois agentes investigam o desaparecimento de uma paciente num hospital psiquiátrico isolado numa ilha.', runtime: 138, kw: [TWIST, PSYCH_HORROR] },
  { kind: 'movie', id: 129, title: 'A Viagem de Chihiro', original: '千と千尋の神隠し', date: '2001-07-20', genres: [16, 10751, 14], origin: ['JP'], lang: 'ja', vote: 8.5, votes: 16000, pop: 90,
    overview: 'Uma menina vai parar num mundo de espíritos e precisa trabalhar numa casa de banhos para salvar os pais.', runtime: 125, flat: [NETFLIX] },

  { kind: 'tv', id: 94605, title: 'Arcane', original: 'Arcane', date: '2021-11-06', genres: [16, 18, 10765, 10759], origin: ['US'], lang: 'en', vote: 8.7, votes: 5000, pop: 110,
    overview: 'Duas irmãs crescem em lados opostos de uma guerra entre a rica Piltover e a subterrânea Zaun, numa disputa movida por uma tecnologia mágica.',
    cast: [[3000001, 'Vi'], [3000002, 'Jinx'], [3000003, 'Jayce'], [3000004, 'Caitlyn'], [3000005, 'Viktor']],
    directors: [3000011, 3000012], runtime: 40, cert: '16', seasons: [[1, 9, 2021], [2, 9, 2024]], ended: 2024, flat: [NETFLIX] },
  { kind: 'tv', id: 209867, title: 'Frieren e a Jornada para o Além', original: '葬送のフリーレン', date: '2023-09-29', genres: [16, 10759, 10765], origin: ['JP'], lang: 'ja', vote: 8.8, votes: 1000, pop: 90,
    overview: 'Depois de derrotar o Rei Demônio, uma maga elfa que vive séculos refaz a viagem com os antigos companheiros e aprende o valor do tempo.', runtime: 24, seasons: [[1, 28, 2023]], flat: [CRUNCHY] },
  { kind: 'tv', id: 95479, title: 'Jujutsu Kaisen', original: '呪術廻戦', date: '2020-10-03', genres: [16, 10759, 10765], origin: ['JP'], lang: 'ja', vote: 8.5, votes: 4000, pop: 100,
    overview: 'Um estudante engole um objeto amaldiçoado e entra para uma escola de feiticeiros que combatem maldições.', runtime: 24, seasons: [[1, 24, 2020], [2, 23, 2023]], flat: [CRUNCHY, NETFLIX] },
  { kind: 'tv', id: 105248, title: 'Cyberpunk: Mercenários', original: 'サイバーパンク エッジランナーズ', date: '2022-09-13', genres: [16, 10759, 10765], origin: ['JP'], lang: 'ja', vote: 8.5, votes: 1500, pop: 40,
    overview: 'Num futuro tomado por corporações e implantes, um jovem de rua decide sobreviver como mercenário em Night City.', runtime: 25, seasons: [[1, 10, 2022]], ended: 2022, flat: [NETFLIX] },
  { kind: 'tv', id: 94796, title: 'Pousando no Amor', original: '사랑의 불시착', date: '2019-12-14', genres: [35, 18], origin: ['KR'], lang: 'ko', vote: 8.6, votes: 2000, pop: 60,
    overview: 'Uma herdeira sul-coreana faz um pouso forçado de parapente na Coreia do Norte e é escondida por um oficial do exército.', runtime: 75, seasons: [[1, 16, 2019]], ended: 2020, flat: [NETFLIX] },
  { kind: 'tv', id: 93405, title: 'Round 6', original: '오징어 게임', date: '2021-09-17', genres: [10759, 9648, 18], origin: ['KR'], lang: 'ko', vote: 7.8, votes: 15000, pop: 130,
    overview: 'Centenas de pessoas endividadas aceitam participar de jogos infantis por um prêmio milionário, sem saber o preço da derrota.', runtime: 55, seasons: [[1, 9, 2021], [2, 7, 2024], [3, 6, 2025]], ended: 2025, flat: [NETFLIX] },
  { kind: 'tv', id: 126308, title: 'Xógum: A Gloriosa Saga do Japão', original: 'Shōgun', date: '2024-02-27', genres: [18, 10768], origin: ['US'], lang: 'en', vote: 8.5, votes: 1500, pop: 90,
    overview: 'No Japão feudal, um navegador inglês naufraga e acaba no centro de uma disputa pelo poder entre senhores rivais.', runtime: 60, cert: '16', seasons: [[1, 10, 2024]], flat: [DISNEY] },
  { kind: 'tv', id: 136315, title: 'O Urso', original: 'The Bear', date: '2022-06-23', genres: [18, 35], origin: ['US'], lang: 'en', vote: 8.2, votes: 1500, pop: 70,
    overview: 'Um chef premiado volta a Chicago para assumir a lanchonete da família depois de uma tragédia.', runtime: 30, seasons: [[1, 8, 2022], [2, 10, 2023], [3, 10, 2024]], flat: [DISNEY] },
  { kind: 'tv', id: 95396, title: 'Ruptura', original: 'Severance', date: '2022-02-17', genres: [18, 9648, 10765], origin: ['US'], lang: 'en', vote: 8.4, votes: 2500, pop: 85,
    overview: 'Funcionários de uma empresa passam por um procedimento que separa as memórias do trabalho das memórias da vida pessoal.', runtime: 50, seasons: [[1, 9, 2022], [2, 10, 2025]], flat: [APPLE], kw: [TWIST] },
  { kind: 'tv', id: 83867, title: 'Andor', original: 'Andor', date: '2022-09-21', genres: [10765, 10759, 18], origin: ['US'], lang: 'en', vote: 8.3, votes: 1800, pop: 60,
    overview: 'Os anos em que Cassian Andor deixa de ser um ladrão sem causa e se torna peça da rebelião contra o Império.', runtime: 45, seasons: [[1, 12, 2022], [2, 12, 2025]], ended: 2025, flat: [DISNEY] },
  { kind: 'tv', id: 100088, title: 'The Last of Us', original: 'The Last of Us', date: '2023-01-15', genres: [18, 10759], origin: ['US'], lang: 'en', vote: 8.6, votes: 5000, pop: 120,
    overview: 'Vinte anos depois de uma pandemia, um sobrevivente precisa atravessar um país devastado escoltando uma adolescente.', runtime: 55, cert: '16', seasons: [[1, 9, 2023], [2, 7, 2025]], flat: [MAX] },
  { kind: 'tv', id: 108545, title: 'O Problema dos 3 Corpos', original: '3 Body Problem', date: '2024-03-21', genres: [10765, 9648, 18], origin: ['US'], lang: 'en', vote: 7.5, votes: 1200, pop: 50,
    overview: 'Uma decisão tomada na China dos anos 1960 ecoa no presente, quando cientistas começam a morrer e as leis da física parecem falhar.', runtime: 55, seasons: [[1, 8, 2024]], flat: [NETFLIX] },
  { kind: 'tv', id: 93740, title: 'Fundação', original: 'Foundation', date: '2021-09-23', genres: [10765, 18], origin: ['US'], lang: 'en', vote: 7.6, votes: 1700, pop: 45,
    overview: 'Um matemático prevê a queda do Império Galáctico e reúne exilados para preservar o conhecimento da humanidade.', runtime: 60, seasons: [[1, 10, 2021], [2, 10, 2023], [3, 10, 2025]], flat: [APPLE] },
  { kind: 'tv', id: 90228, title: 'Duna: A Profecia', original: 'Dune: Prophecy', date: '2024-11-17', genres: [10765, 18, 10759], origin: ['US'], lang: 'en', vote: 7.1, votes: 500, pop: 40,
    overview: 'Dez mil anos antes de Paul Atreides, duas irmãs Harkonnen lutam contra forças que ameaçam o futuro da humanidade.', runtime: 60, seasons: [[1, 6, 2024]], flat: [MAX] },
  { kind: 'tv', id: 1396, title: 'Breaking Bad', original: 'Breaking Bad', date: '2008-01-20', genres: [18, 80], origin: ['US'], lang: 'en', vote: 8.9, votes: 15000, pop: 150,
    overview: 'Um professor de química com câncer terminal passa a fabricar metanfetamina para garantir o futuro da família.', runtime: 47, seasons: [[1, 7, 2008], [2, 13, 2009], [3, 13, 2010], [4, 13, 2011], [5, 16, 2012]], ended: 2013, flat: [NETFLIX] },
  { kind: 'tv', id: 66732, title: 'Stranger Things', original: 'Stranger Things', date: '2016-07-15', genres: [10765, 9648, 18], origin: ['US'], lang: 'en', vote: 8.6, votes: 18000, pop: 140,
    overview: 'Quando um garoto desaparece numa pequena cidade, os amigos dele descobrem experimentos secretos e uma menina com poderes.', runtime: 50, seasons: [[1, 8, 2016], [2, 9, 2017], [3, 8, 2019], [4, 9, 2022]], flat: [NETFLIX] },
  { kind: 'tv', id: 70523, title: 'Dark', original: 'Dark', date: '2017-12-01', genres: [80, 18, 9648, 10765], origin: ['DE'], lang: 'de', vote: 8.4, votes: 6000, pop: 60,
    overview: 'O desaparecimento de duas crianças revela os segredos de quatro famílias de uma cidade alemã, ligados através do tempo.', runtime: 60, seasons: [[1, 10, 2017], [2, 8, 2019], [3, 8, 2020]], ended: 2020, flat: [NETFLIX], kw: [TWIST] },
];

interface DemoPerson { id: number; name: string; dep: string; birthday?: string; place?: string; bio?: string }

const PEOPLE: DemoPerson[] = [
  { id: 137427, name: 'Denis Villeneuve', dep: 'Directing', birthday: '1967-10-03', place: 'Gentilly, Quebec, Canadá',
    bio: 'Diretor e roteirista canadense. Ganhou projeção internacional com dramas e suspenses como Incêndios e Os Suspeitos, e depois se tornou um dos nomes centrais da ficção científica com A Chegada, Blade Runner 2049 e os filmes de Duna.' },
  { id: 1190668, name: 'Timothée Chalamet', dep: 'Acting', birthday: '1995-12-27', place: 'Nova York, Estados Unidos', bio: 'Ator franco-americano, conhecido por Me Chame Pelo Seu Nome e pelo papel de Paul Atreides nos filmes de Duna.' },
  { id: 505710, name: 'Zendaya', dep: 'Acting', birthday: '1996-09-01', place: 'Oakland, Califórnia, Estados Unidos', bio: 'Atriz e cantora americana, conhecida por Euphoria e pelos filmes de Duna e do Homem-Aranha.' },
  { id: 933238, name: 'Rebecca Ferguson', dep: 'Acting', birthday: '1983-10-19', place: 'Estocolmo, Suécia' },
  { id: 3810, name: 'Javier Bardem', dep: 'Acting', birthday: '1969-03-01', place: 'Las Palmas, Espanha' },
  { id: 1640439, name: 'Austin Butler', dep: 'Acting', birthday: '1991-08-17', place: 'Anaheim, Califórnia, Estados Unidos' },
  { id: 1373737, name: 'Florence Pugh', dep: 'Acting', birthday: '1996-01-03', place: 'Oxford, Inglaterra' },
  { id: 25072, name: 'Oscar Isaac', dep: 'Acting', birthday: '1979-03-09', place: 'Cidade da Guatemala, Guatemala' },
  { id: 525, name: 'Christopher Nolan', dep: 'Directing', birthday: '1970-07-30', place: 'Londres, Inglaterra' },
  { id: 5602, name: 'David Lynch', dep: 'Directing', birthday: '1946-01-20', place: 'Missoula, Montana, Estados Unidos' },
  { id: 3000001, name: 'Hailee Steinfeld', dep: 'Acting' },
  { id: 3000002, name: 'Ella Purnell', dep: 'Acting' },
  { id: 3000003, name: 'Kevin Alejandro', dep: 'Acting' },
  { id: 3000004, name: 'Katie Leung', dep: 'Acting' },
  { id: 3000005, name: 'Harry Lloyd', dep: 'Acting' },
  { id: 3000010, name: 'Jon Spaihts', dep: 'Writing' },
  { id: 3000011, name: 'Christian Linke', dep: 'Creator' },
  { id: 3000012, name: 'Alex Yee', dep: 'Creator' },
];

const KEYWORDS: Record<string, number> = { 'twist ending': TWIST, 'psychological horror': PSYCH_HORROR };
const PROVIDER_NAMES: Record<number, string> = {
  [NETFLIX]: 'Netflix', [PRIME]: 'Amazon Prime Video', [DISNEY]: 'Disney Plus', [MAX]: 'Max', [APPLE]: 'Apple TV+',
  [CRUNCHY]: 'Crunchyroll', [GOOGLE]: 'Google Play Filmes', [APPLE_STORE]: 'Apple TV', 307: 'Globoplay', 531: 'Paramount Plus',
};

const PAGE_SIZE = 20;

function listItem(t: DemoTitle, withType = true): RawListItem {
  const base: RawListItem = {
    id: t.id,
    original_language: t.lang,
    origin_country: t.origin,
    poster_path: null,
    backdrop_path: null,
    vote_average: t.vote,
    vote_count: t.votes,
    popularity: t.pop,
    overview: t.overview,
    genre_ids: t.genres,
  };
  if (withType) base.media_type = t.kind;
  if (t.kind === 'movie') Object.assign(base, { title: t.title, original_title: t.original, release_date: t.date });
  else Object.assign(base, { name: t.title, original_name: t.original, first_air_date: t.date });
  return base;
}

function paginate<T>(items: T[], pageParam?: string): RawPage<T> {
  const page = Math.max(1, Number(pageParam) || 1);
  return {
    page,
    results: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total_pages: Math.max(1, Math.ceil(items.length / PAGE_SIZE)),
    total_results: items.length,
  };
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Lista de IDs no formato do TMDB: "a,b" = todos; "a|b" = qualquer um. */
function matchIds(have: Array<number | string>, expr?: string): boolean {
  if (!expr) return true;
  if (expr.includes('|')) return expr.split('|').some((x) => have.map(String).includes(x));
  return expr.split(',').every((x) => have.map(String).includes(x));
}

function discover(kind: Kind, q: Record<string, string>) {
  const field = kind === 'movie' ? 'primary_release_date' : 'first_air_date';
  let items = TITLES.filter((t) => t.kind === kind)
    .filter((t) => matchIds(t.genres, q.with_genres))
    .filter((t) => !q.without_genres || !q.without_genres.split(',').some((g) => t.genres.includes(Number(g))))
    .filter((t) => matchIds(t.origin, q.with_origin_country))
    .filter((t) => !q[`${field}.gte`] || t.date >= q[`${field}.gte`])
    .filter((t) => !q[`${field}.lte`] || t.date <= q[`${field}.lte`])
    .filter((t) => !q['vote_average.gte'] || t.vote >= Number(q['vote_average.gte']))
    .filter((t) => !q['vote_count.gte'] || t.votes >= Math.min(Number(q['vote_count.gte']), 1000))
    .filter((t) => !q.with_watch_providers || matchIds(t.flat ?? [], q.with_watch_providers))
    .filter((t) => !q.with_watch_monetization_types || (t.flat?.length ?? 0) + (t.rent?.length ?? 0) > 0)
    .filter((t) => !q.with_keywords || matchIds(t.kw ?? [], q.with_keywords));

  const sort = q.sort_by ?? 'popularity.desc';
  items = items.sort((a, b) =>
    sort.startsWith('vote_average') ? b.vote - a.vote : sort.includes('date') ? b.date.localeCompare(a.date) : b.pop - a.pop,
  );
  return paginate(items.map((t) => listItem(t, false)), q.page);
}

function findTitle(kind: Kind, id: number): DemoTitle {
  const t = TITLES.find((x) => x.kind === kind && x.id === id);
  if (!t) throw new TmdbError(404, 'Não encontrado no catálogo.');
  return t;
}

function person(id: number) {
  return PEOPLE.find((p) => p.id === id);
}

function titleDetail(kind: Kind, id: number): RawTitleDetail {
  const t = findTitle(kind, id);
  const cast = (t.cast ?? []).map(([pid, character], order) => ({
    id: pid,
    name: person(pid)?.name ?? '',
    character,
    roles: [{ character, episode_count: 9 }],
    profile_path: null,
    order,
  }));
  const crew = [
    ...(kind === 'movie' ? (t.directors ?? []).map((pid) => ({ id: pid, name: person(pid)?.name ?? '', job: 'Director', department: 'Directing' })) : []),
    ...(t.writers ?? []).map((pid) => ({ id: pid, name: person(pid)?.name ?? '', job: 'Screenplay', department: 'Writing' })),
  ];

  const recs = TITLES.filter((o) => o !== t && o.genres.some((g) => t.genres.includes(g)))
    .sort((a, b) => b.genres.filter((g) => t.genres.includes(g)).length - a.genres.filter((g) => t.genres.includes(g)).length || b.pop - a.pop)
    .slice(0, 10)
    .map((o) => listItem(o));

  const prov = (ids?: number[]) => ids?.map((pid, i) => ({ provider_id: pid, provider_name: PROVIDER_NAMES[pid] ?? 'Streaming', logo_path: null, display_priority: i }));

  const raw: RawTitleDetail = {
    ...listItem(t, false),
    genres: t.genres.map((g) => ({ id: g, name: GENRE_NAME[g] ?? '' })),
    tagline: '',
    production_countries: t.origin.map((c) => ({ iso_3166_1: c, name: ({ US: 'Estados Unidos', GB: 'Reino Unido', CA: 'Canadá', AU: 'Austrália', KR: 'Coreia do Sul', JP: 'Japão', DE: 'Alemanha' } as Record<string, string>)[c] ?? c })),
    spoken_languages: [{ iso_639_1: t.lang, name: ({ en: 'Inglês', ja: 'Japonês', ko: 'Coreano', fr: 'Francês', de: 'Alemão' } as Record<string, string>)[t.lang] ?? t.lang }],
    production_companies: [],
    videos: { results: t.trailer ? [{ key: t.trailer, name: 'Trailer oficial', site: 'YouTube', type: 'Trailer', official: true }] : [] },
    recommendations: { page: 1, results: recs, total_pages: 1, total_results: recs.length },
    'watch/providers': { results: t.flat || t.rent ? { BR: { link: 'https://www.themoviedb.org', flatrate: prov(t.flat), rent: prov(t.rent), buy: prov(t.rent) } } : {} },
  };

  if (kind === 'movie') {
    raw.runtime = t.runtime;
    raw.credits = { cast, crew };
    raw.release_dates = { results: t.cert ? [{ iso_3166_1: 'BR', release_dates: [{ certification: t.cert, type: 3 }] }] : [] };
    raw.belongs_to_collection = t.collection ? { id: t.collection, name: 'Duna' } : null;
  } else {
    raw.episode_run_time = t.runtime ? [t.runtime] : [];
    raw.aggregate_credits = { cast, crew };
    raw.created_by = (t.directors ?? []).map((pid) => ({ id: pid, name: person(pid)?.name ?? '' }));
    raw.content_ratings = { results: t.cert ? [{ iso_3166_1: 'BR', rating: t.cert }] : [] };
    raw.seasons = (t.seasons ?? []).map(([n, eps, year]) => ({ season_number: n, name: `Temporada ${n}`, episode_count: eps, air_date: `${year}-01-01`, poster_path: null }));
    raw.number_of_seasons = t.seasons?.length;
    raw.number_of_episodes = t.seasons?.reduce((s, [, eps]) => s + eps, 0);
    raw.status = t.ended ? 'Ended' : 'Returning Series';
    raw.last_air_date = t.ended ? `${t.ended}-12-01` : null;
  }
  return raw;
}

function season(id: number, n: number): RawSeason {
  const t = findTitle('tv', id);
  const s = t.seasons?.find(([num]) => num === n);
  if (!s) throw new TmdbError(404, 'Temporada não encontrada.');
  const [, eps, year] = s;
  return {
    season_number: n,
    name: `Temporada ${n}`,
    episodes: Array.from({ length: eps }, (_, i) => ({
      episode_number: i + 1,
      name: `Episódio ${i + 1}`,
      runtime: t.runtime,
      air_date: `${year}-${String(Math.min(12, 1 + Math.floor(i / 4))).padStart(2, '0')}-${String(1 + ((i * 7) % 28)).padStart(2, '0')}`,
      still_path: null,
      vote_average: Math.round((t.vote - 0.4 + ((i * 37) % 9) / 10) * 10) / 10,
      overview: '',
    })),
  };
}

function personDetail(id: number): RawPerson {
  const p = person(id);
  if (!p) throw new TmdbError(404, 'Pessoa não encontrada.');
  const cast: RawPersonCredit[] = [];
  const crew: RawPersonCredit[] = [];
  for (const t of TITLES) {
    const role = t.cast?.find(([pid]) => pid === id);
    if (role) cast.push({ ...listItem(t), character: role[1] });
    if (t.kind === 'movie' && t.directors?.includes(id)) crew.push({ ...listItem(t), job: 'Director', department: 'Directing' });
    if (t.kind === 'tv' && t.directors?.includes(id)) crew.push({ ...listItem(t), job: 'Creator', department: 'Creator' });
    if (t.writers?.includes(id)) crew.push({ ...listItem(t), job: 'Screenplay', department: 'Writing' });
  }
  return {
    id: p.id,
    name: p.name,
    known_for_department: p.dep,
    birthday: p.birthday ?? null,
    place_of_birth: p.place ?? null,
    biography: p.bio ?? '',
    profile_path: null,
    combined_credits: { cast, crew },
  };
}

export function demoGet(path: string, q: Record<string, string>): unknown {
  let m: RegExpExecArray | null;

  if ((m = /^\/trending\/all\/(day|week)$/.exec(path))) {
    // "Hoje" embaralha levemente a ordem da semana, para o ranking ter variação.
    const wobble = (t: DemoTitle) => (m![1] === 'day' ? t.pop * (1 + (((t.id * 7) % 9) - 4) / 12) : t.pop);
    return paginate(TITLES.slice().sort((a, b) => wobble(b) - wobble(a)).map((t) => listItem(t)), q.page);
  }
  if (path === '/movie/now_playing' || path === '/movie/upcoming') {
    const movies = TITLES.filter((t) => t.kind === 'movie').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
    return paginate(movies.map((t) => listItem(t, false)), q.page);
  }
  if ((m = /^\/discover\/(movie|tv)$/.exec(path))) return discover(m[1] as Kind, q);
  if (path === '/search/keyword') {
    const id = KEYWORDS[norm(q.query ?? '')];
    return paginate(id ? [{ id, name: q.query }] : []);
  }
  if (path === '/search/multi') {
    const query = norm(q.query ?? '').trim();
    const titles = TITLES.filter((t) => norm(t.title).includes(query) || norm(t.original).includes(query))
      .sort((a, b) => b.pop - a.pop)
      .map((t) => listItem(t));
    const people = PEOPLE.filter((p) => norm(p.name).includes(query)).map((p) => ({
      id: p.id,
      media_type: 'person' as const,
      name: p.name,
      known_for_department: p.dep,
      profile_path: null,
      known_for: TITLES.filter((t) => t.cast?.some(([pid]) => pid === p.id) || t.directors?.includes(p.id)).slice(0, 2).map((t) => listItem(t)),
    }));
    return paginate([...titles, ...people], q.page);
  }
  if ((m = /^\/(movie|tv)\/(\d+)$/.exec(path))) return titleDetail(m[1] as Kind, Number(m[2]));
  if ((m = /^\/tv\/(\d+)\/season\/(\d+)$/.exec(path))) return season(Number(m[1]), Number(m[2]));
  if ((m = /^\/collection\/(\d+)$/.exec(path))) {
    const parts = TITLES.filter((t) => t.collection === Number(m![1])).map((t) => listItem(t, false));
    return { id: Number(m[1]), name: 'Duna', parts };
  }
  if ((m = /^\/person\/(\d+)$/.exec(path))) return personDetail(Number(m[1]));

  throw new TmdbError(404, `Rota de demonstração não implementada: ${path}`);
}
