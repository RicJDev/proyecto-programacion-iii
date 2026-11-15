// Datos territoriales de Venezuela para el registro en cascada

export interface ParishItem {
  id: string;
  name: string;
}

export interface MunicipalityItem {
  id: string;
  name: string;
  parishes: ParishItem[];
}

export interface StateItem {
  id: string;
  name: string;
  code: string;
  municipalities: MunicipalityItem[];
}

export const VENEZUELA_STATES: StateItem[] = [
  {
    id: 'miranda',
    name: 'Miranda',
    code: 'MIR',
    municipalities: [
      {
        id: 'sucre',
        name: 'Sucre',
        parishes: [
          { id: 'petare', name: 'Petare' },
          { id: 'leoncio_martinez', name: 'Leoncio Martínez' },
          { id: 'caucaguita', name: 'Caucagüita' },
          { id: 'fila_mariches', name: 'Filas de Mariche' },
          { id: 'la_dolorita', name: 'La Dolorita' },
        ],
      },
      {
        id: 'chacao',
        name: 'Chacao',
        parishes: [{ id: 'chacao_parroquia', name: 'Chacao' }],
      },
      {
        id: 'baruta',
        name: 'Baruta',
        parishes: [
          { id: 'baruta_parroquia', name: 'Baruta' },
          { id: 'el_cafetal', name: 'El Cafetal' },
          { id: 'las_minas', name: 'Las Minas de Baruta' },
        ],
      },
      {
        id: 'guaicaipuro',
        name: 'Guaicaipuro',
        parishes: [
          { id: 'los_teques', name: 'Los Teques' },
          { id: 'san_pedro', name: 'San Pedro' },
          { id: 'cecilio_acosta', name: 'Cecilio Acosta' },
        ],
      },
    ],
  },
  {
    id: 'distrito_capital',
    name: 'Distrito Capital',
    code: 'DC',
    municipalities: [
      {
        id: 'libertador',
        name: 'Libertador',
        parishes: [
          { id: 'el_valle', name: 'El Valle' },
          { id: 'sucre_catia', name: 'Sucre (Catia)' },
          { id: 'antimano', name: 'Antímano' },
          { id: 'el_recreo', name: 'El Recreo' },
          { id: 'san_juan', name: 'San Juan' },
          { id: 'catedral', name: 'Catedral' },
          { id: 'coche', name: 'Coche' },
          { id: 'la_pastora', name: 'La Pastora' },
        ],
      },
    ],
  },
  {
    id: 'aragua',
    name: 'Aragua',
    code: 'ARA',
    municipalities: [
      {
        id: 'girardot',
        name: 'Girardot (Maracay)',
        parishes: [
          { id: 'los_tacariguas', name: 'Los Tacariguas' },
          { id: 'las_delicias', name: 'Las Delicias' },
          { id: 'madre_maria', name: 'Madre María de San José' },
          { id: 'choroni', name: 'Choroní' },
        ],
      },
      {
        id: 'jose_felix_ribas',
        name: 'José Félix Ribas (La Victoria)',
        parishes: [
          { id: 'la_victoria', name: 'La Victoria' },
          { id: 'castor_nieves', name: 'Castor Nieves Ríos' },
          { id: 'zuata', name: 'Zuata' },
        ],
      },
    ],
  },
  {
    id: 'carabobo',
    name: 'Carabobo',
    code: 'CAR',
    municipalities: [
      {
        id: 'valencia',
        name: 'Valencia',
        parishes: [
          { id: 'san_jose', name: 'San José' },
          { id: 'candelaria', name: 'Candelaria' },
          { id: 'santa_rosa', name: 'Santa Rosa' },
          { id: 'miguel_pena', name: 'Miguel Peña' },
        ],
      },
      {
        id: 'naguanagua',
        name: 'Naguanagua',
        parishes: [{ id: 'naguanagua_p', name: 'Naguanagua' }],
      },
    ],
  },
  {
    id: 'zulia',
    name: 'Zulia',
    code: 'ZUL',
    municipalities: [
      {
        id: 'maracaibo',
        name: 'Maracaibo',
        parishes: [
          { id: 'bolivar_zulia', name: 'Bolívar' },
          { id: 'chiquinquira', name: 'Chiquinquirá' },
          { id: 'oleary', name: 'Olegario Villalobos' },
          { id: 'santa_lucia', name: 'Santa Lucía' },
        ],
      },
      {
        id: 'san_francisco',
        name: 'San Francisco',
        parishes: [
          { id: 'san_francisco_p', name: 'San Francisco' },
          { id: 'domitila_flores', name: 'Domitila Flores' },
        ],
      },
    ],
  },
];

