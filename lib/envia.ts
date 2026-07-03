/**
 * Spanish province name → Envia.com state code mapping
 * Source: https://queries.envia.com/state?country_code=ES
 */
const PROVINCE_CODES: Record<string, string> = {
  'álava': 'VI',
  'alava': 'VI',
  'albacete': 'AB',
  'alicante': 'A',
  'almería': 'AL',
  'almeria': 'AL',
  'asturias': 'O',
  'ávila': 'AV',
  'avila': 'AV',
  'badajoz': 'BA',
  'barcelona': 'B',
  'burgos': 'BU',
  'cáceres': 'CC',
  'caceres': 'CC',
  'cádiz': 'CA',
  'cadiz': 'CA',
  'canarias': 'CN',
  'cantabria': 'S',
  'castellón': 'CS',
  'castellon': 'CS',
  'ceuta': 'CE',
  'ciudad real': 'CR',
  'córdoba': 'CO',
  'cordoba': 'CO',
  'cuenca': 'CU',
  'girona': 'GI',
  'gerona': 'GI',
  'granada': 'GR',
  'guadalajara': 'GU',
  'guipúzcoa': 'SS',
  'guipuzcoa': 'SS',
  'huelva': 'H',
  'huesca': 'HU',
  'islas baleares': 'PM',
  'baleares': 'PM',
  'jaén': 'J',
  'jaen': 'J',
  'la coruña': 'C',
  'la coruna': 'C',
  'coruña': 'C',
  'coruna': 'C',
  'a coruña': 'C',
  'a coruna': 'C',
  'la rioja': 'LO',
  'las palmas': 'GC',
  'león': 'LE',
  'leon': 'LE',
  'lleida': 'L',
  'lérida': 'L',
  'lerida': 'L',
  'lugo': 'LU',
  'madrid': 'M',
  'málaga': 'MA',
  'malaga': 'MA',
  'melilla': 'ML',
  'murcia': 'MU',
  'navarra': 'NA',
  'ourense': 'OR',
  'orense': 'OR',
  'palencia': 'P',
  'pontevedra': 'PO',
  'salamanca': 'SA',
  'santa cruz de tenerife': 'TF',
  'tenerife': 'TF',
  'segovia': 'SG',
  'sevilla': 'SE',
  'soria': 'SO',
  'tarragona': 'T',
  'teruel': 'TE',
  'toledo': 'TO',
  'valencia': 'V',
  'valladolid': 'VA',
  'vizcaya': 'BI',
  'bizkaia': 'BI',
  'zamora': 'ZA',
  'zaragoza': 'Z',
};

/**
 * Normalize a province name to the Envia-compatible state code.
 * Falls back to the original string if not found.
 *
 * Examples:
 *   "Madrid"       → "M"
 *   "Barcelona"    → "B"
 *   "Cáceres"      → "CC"
 *   "Santa Cruz de Tenerife" → "TF"
 *   "Valencia"     → "V"
 */
export function getEnviaProvinceCode(provinceName: string): string {
  if (!provinceName) return '';

  const normalized = provinceName
    .toLowerCase()
    .trim()
    .replace(/\./g, '') // remove dots (e.g. "Barcelona." → "barcelona")
    .normalize('NFD')   // decompose accents
    .replace(/[\u0300-\u036f]/g, ''); // strip combining diacritics

  // Try direct lookup
  if (PROVINCE_CODES[normalized]) {
    return PROVINCE_CODES[normalized];
  }

  // If not found and the name is already 1-2 chars, it might already be a code
  if (provinceName.length <= 2) {
    return provinceName.toUpperCase();
  }

  // Fallback: return original (the API will reject but user will see the real error)
  return provinceName;
}

/**
 * Prepares an address object for Envia API by normalizing the province field.
 */
export function prepareEnviaAddress(address: {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}) {
  return {
    ...address,
    state: getEnviaProvinceCode(address.state),
  };
}
